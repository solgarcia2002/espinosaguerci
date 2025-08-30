"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    title: "Robots",
    links: [
      { label: "Colppy Pago a Proveedores", href: "/pago-proveedores" },
    ],
  },
  {
    title: "Configuracion",
    links: [{ label: "Configuracion", href: "/configuracion" }],
  },
];

export default function AdminSidebar() {
  const auth = useAuth();

  return (
    <aside className="w-64 min-h-screen text-white flex flex-col justify-between px-6 py-8 shadow-md bg-black">
      <div className="max-h[80%]">
        <div className="mb-10 flex flex-col items-start gap-2">
          <Image src="/logo.png" alt="Logo" width={200} height={60} />
          {auth.user && (
            <p className="text-sm font-body text-brand-white/80">
              Hola, {auth.user.name || auth.user.email}
            </p>
          )}
        </div>

        <nav className="space-y-6">
          {navItems.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-bold uppercase text-brand-white/60 tracking-widest mb-2 font-body">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-2 py-1 rounded text-sm font-body text-brand-white hover:bg-brand-white/10 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <button onClick={auth.logout} className="text-sm font-body text-white hover:underline mt-20">
        Cerrar sesión
      </button>
      </div>
      
    </aside>
  );
}
