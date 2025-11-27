'use client';

import { ReactNode } from 'react';
import { ConsolidadoProvider } from '@/contexts/ConsolidadoContext';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return <ConsolidadoProvider>{children}</ConsolidadoProvider>;
}

