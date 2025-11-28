'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return <div className="p-8">Verificando sesión…</div>;
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-azul">Bienvenid@</h1>
        <p className="mt-2 text-brand-gris-700">
          Este es tu panel principal.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <section className="card p-6">
            <h3 className="font-semibold text-brand-azul">Estado</h3>
            <p className="text-sm text-brand-gris-600 mt-2">Resumen rápido del sistema.</p>
          </section>
          <section className="card p-6">
            <h3 className="font-semibold text-brand-azul">Tareas</h3>
            <p className="text-sm text-brand-gris-600 mt-2">Tus próximos pasos.</p>
          </section>
          <section className="card p-6">
            <h3 className="font-semibold text-brand-azul">Actividad</h3>
            <p className="text-sm text-brand-gris-600 mt-2">Últimos eventos registrados.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
