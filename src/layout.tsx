import '@/styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Santos del Campillo',
  description: 'Panel de clientes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
