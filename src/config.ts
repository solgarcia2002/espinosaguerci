// src/config.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined") {
  // Cliente (browser)
  if (!apiUrl) {
    throw new Error("❌ NEXT_PUBLIC_API_URL no está definida en el navegador");
  }
}

export const BASE_API_URL = apiUrl!;
