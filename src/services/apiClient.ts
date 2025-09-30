const getTenantId = (): string => {
  return process.env.TENANT || "d9d1c7f9-8909-4d43-a32b-278174459446";
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | number[]>
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, val]) => {
          acc[key] = Array.isArray(val) ? val.join(",") : String(val);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "tenant-id": getTenantId(),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(`${baseUrl}/${endpoint}${queryString}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message ?? "Error en la petición");
  }

  return response.json() as Promise<T>;
}
