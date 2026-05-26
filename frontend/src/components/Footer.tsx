import { Facebook, Twitter, Instagram, Youtube, ArrowUp, PackageOpen } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <PackageOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold">
                Looteria
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              La plataforma especializada en compra-venta e intercambio de videojuegos, 
              artículos de colección. Encuentra tesoros únicos y conecta con otros coleccionistas.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-bold">Compañía</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sobre nosotros
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Carreras
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-bold">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Centro de ayuda
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Seguridad
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacidad
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Looteria. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40"
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}