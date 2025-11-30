'use client';

import { ReactNode } from 'react';
import { ConsolidadoProvider } from '@/contexts/ConsolidadoContext';
import { DisponibilidadProvider } from '@/contexts/DisponibilidadContext';
import { ProveedoresProvider } from '@/contexts/ProveedoresContext';
import { ClientesProvider } from '@/contexts/ClientesContext';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ConsolidadoProvider>
      <DisponibilidadProvider>
        <ProveedoresProvider>
          <ClientesProvider>{children}</ClientesProvider>
        </ProveedoresProvider>
      </DisponibilidadProvider>
    </ConsolidadoProvider>
  );
}

