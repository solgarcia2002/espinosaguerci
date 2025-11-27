'use client';

import { ReactNode } from 'react';
import { ConsolidadoProvider } from '@/contexts/ConsolidadoContext';
import { DisponibilidadProvider } from '@/contexts/DisponibilidadContext';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ConsolidadoProvider>
      <DisponibilidadProvider>{children}</DisponibilidadProvider>
    </ConsolidadoProvider>
  );
}

