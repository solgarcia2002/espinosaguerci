'use client';

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Cliente = {
  nombre: string;
  cuit: string;
  clave_fiscal: string;
  empresa: string;
  cuit_empresa: string;
  clave_empresa: string;
  telefono: string;
  email: string;
};

export default function Configuracion() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0] || e?.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Formato inválido. Solo se aceptan archivos .xlsx o .xls.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo excede los 5MB permitidos.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setFilename(file.name);

    try {
      const res = await fetch("https://api.tu-dominio.com/clientes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al procesar el archivo en el backend");

      const json = await res.json();
      setClientes(json.clientes || []);
    } catch (err) {
      alert("No se pudo procesar el archivo. Verificá que sea un Excel válido.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUpload(e);
  };

  if (!authChecked) return <div className="p-8">Verificando sesión…</div>;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="card p-6 space-y-6">

          <h1 className="text-2xl font-bold text-brand-negro">Configuración</h1>
          <p className="text-brand-gris-700">
            Cargá un archivo Excel con los datos de tus clientes. El archivo será procesado por el backend.
          </p>

          {/* Tabla de ejemplo */}
          <div className="overflow-x-auto">
            <p className="text-sm font-semibold text-brand-gris-600 mb-2">
              Formato requerido del Excel:
            </p>
            <table className="min-w-[1000px] text-sm bg-white border border-brand-gris-300 rounded">
              <thead className="bg-brand-negro text-white">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">CUIT - PF</th>
                  <th className="px-3 py-2">Clave Fiscal - PF</th>
                  <th className="px-3 py-2">Empresa</th>
                  <th className="px-3 py-2">CUIT - Empresa</th>
                  <th className="px-3 py-2">Clave Fiscal - Empresa</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2">Email</th>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString("es", { month: "long" });
                    return <th key={i} className="px-3 py-2 capitalize">{month}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-brand-gris-50 text-center">
                  <td className="px-3 py-2">Juan Pérez</td>
                  <td className="px-3 py-2">20304050607</td>
                  <td className="px-3 py-2">••••••</td>
                  <td className="px-3 py-2">Acme S.A.</td>
                  <td className="px-3 py-2">30711222334</td>
                  <td className="px-3 py-2">••••••</td>
                  <td className="px-3 py-2">351-1234567</td>
                  <td className="px-3 py-2">juan@acme.com</td>
                  {Array.from({ length: 12 }, (_, i) => (
                    <td key={i} className="px-3 py-2">20</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Aviso de seguridad */}
          <div className="p-4 bg-brand-rojo/10 border-l-4 border-brand-rojo text-brand-rojo text-sm rounded">
            ⚠️ <strong>Importante:</strong> Las claves fiscales no son accesibles por humanos y son procesadas automáticamente.<br />
            Siempre que haya un cambio en los datos de un cliente (clave, teléfono, email o nuevos ingresos/bajas), <strong>deberás subir un nuevo archivo Excel</strong>.
          </div>

          {/* Input de archivo */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-brand-gris-300 bg-white hover:bg-brand-gris-100 transition cursor-pointer rounded-md p-6 text-center"
          >
            <p className="text-sm text-brand-gris-600">
              Arrastrá tu archivo Excel aquí o <span className="text-brand-gris-800 font-semibold underline">hacé clic para seleccionarlo</span>
            </p>
            <p className="text-xs text-brand-gris-400 mt-1">Archivos permitidos: .xlsx, .xls (máx. 5MB)</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={loading}
              className="hidden"
            />
          </div>

          {/* Archivo seleccionado */}
          {filename && (
            <p className="text-sm text-brand-gris-600">
              Archivo cargado: <span className="font-medium">{filename}</span>
            </p>
          )}

          {/* Spinner */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-brand-gris-700">
              <span className="loader animate-spin border-2 border-t-transparent border-brand-verde rounded-full w-5 h-5 inline-block" />
              Procesando archivo…
            </div>
          )}

          {/* Tabla de resultados */}
          {clientes.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm border border-brand-gris-300 bg-white rounded-md shadow">
                <thead className="bg-brand-negro text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2">CUIT</th>
                    <th className="px-4 py-2">Clave Fiscal</th>
                    <th className="px-4 py-2">Empresa</th>
                    <th className="px-4 py-2">CUIT Empresa</th>
                    <th className="px-4 py-2">Clave Empresa</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c, i) => (
                    <tr key={i} className="even:bg-brand-gris-50">
                      <td className="px-4 py-2">{c.nombre}</td>
                      <td className="px-4 py-2 text-center">{c.cuit}</td>
                      <td className="px-4 py-2 text-center">••••••</td>
                      <td className="px-4 py-2">{c.empresa}</td>
                      <td className="px-4 py-2 text-center">{c.cuit_empresa}</td>
                      <td className="px-4 py-2 text-center">••••••</td>
                      <td className="px-4 py-2">{c.telefono}</td>
                      <td className="px-4 py-2">{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
