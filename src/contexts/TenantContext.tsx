"use client";
import { createContext, useContext, useState } from "react";

type TenantContextType = {
  tenantId: number | null;
  setTenantId: (id: number) => void;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenantId, setTenantId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tenantId");
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  });

  const updateTenantId = (id: number) => {
    setTenantId(id);
    localStorage.setItem("tenantId", id.toString());
  };

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId: updateTenantId }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant debe usarse dentro del TenantProvider");
  }
  return context;
};
