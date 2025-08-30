"use client";

import { createContext, useContext, useState } from "react";

type ProductFilters = {
  page: number;
  limit: number;
  sortBy: "createdAt" | "name" | "price";
  sortOrder: "asc" | "desc";
  setFilters: (updates: Partial<Omit<ProductFilters, "setFilters">>) => void;
};

const ProductFiltersContext = createContext<ProductFilters | undefined>(undefined);

export const ProductFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Omit<ProductFilters, "setFilters">>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const setFilters = (updates: Partial<Omit<ProductFilters, "setFilters">>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProductFiltersContext.Provider value={{ ...state, setFilters }}>
      {children}
    </ProductFiltersContext.Provider>
  );
};

export const useProductFilters = (): ProductFilters => {
  const context = useContext(ProductFiltersContext);
  if (!context) throw new Error("useProductFilters debe usarse dentro del ProductFiltersProvider");
  return context;
};
