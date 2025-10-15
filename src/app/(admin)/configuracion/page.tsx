'use client';

import Layout from "@/components/Layout";
import ColppyCredentialsForm from "@/components/ColppyCredentialsForm";
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
        <div className="space-y-8">
          
          {/* Sección de Credenciales de Colppy */}
          <ColppyCredentialsForm />


        </div>
      </div>
    </Layout>
  );
}
