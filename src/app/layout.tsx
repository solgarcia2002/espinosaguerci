// app/layout.tsx
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import React from 'react';
import { ConsolidadoProvider } from '@/contexts/ConsolidadoContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Panel de Clientes - Espinosa Guerci',
  description: 'Administración de clientes y claves fiscales en un entorno seguro.',
  keywords: ['Next.js', 'Clientes', 'Claves Fiscales', 'Importación', 'Excel'],
  authors: [{ name: 'Sol García', url: 'https://github.com/solgarcia' }],
  openGraph: {
    title: 'Espinosa Guerci | Panel de Clientes',
    description: 'Subí tus archivos Excel de clientes de forma segura.',
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-brand bg-[#f4f4f4] text-[#1a1a1a] tracking-[0.01em] min-h-screen">
        <ConsolidadoProvider>{children}</ConsolidadoProvider>
      </body>
    </html>
  );
}
