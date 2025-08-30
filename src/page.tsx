import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo principal centrado */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-8 transition-transform duration-300 hover:scale-105">
          <Image
            src="/logo.png"
            alt="Juan Pablo del Campillo - Contador"
            width={300}
            height={200}
            className="w-auto h-auto max-w-sm md:max-w-md lg:max-w-lg"
            priority
          />
        </div>
        
        {/* Título principal */}
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 tracking-wide">
          Espinosa Guerci
        </h1>
        
        {/* Subtítulo */}
        <p className="text-gray-300 text-lg md:text-xl text-center mb-12 max-w-2xl leading-relaxed">
          Estudio Contable
        </p>
        
        {/* Botón de acceso al login */}
        <Link
          href="/login"
          className="group bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg
                   hover:bg-gray-200 transition-all duration-300 
                   hover:shadow-lg hover:shadow-white/20
                   border-2 border-transparent hover:border-gray-300"
        >
          <span className="flex items-center gap-3">
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Acceso al Sistema
          </span>
        </Link>
      </div>
      
      {/* Footer minimalista */}
      <footer className="w-full py-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Estudio Espinosa&Guerci. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}