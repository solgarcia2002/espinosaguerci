'use client';

import Providers from '@/contexts/Providers';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

