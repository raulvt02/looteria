import { ArrowRight, Package, Shield, Gamepad2, Sparkles } from "lucide-react";

interface HeroProps {
  onNavigate: (page: string) => void;
}

const categories = [
  { name: "PS5", icon: Gamepad2, color: "bg-blue-100 text-blue-600" },
  { name: "Xbox", icon: Gamepad2, color: "bg-green-100 text-green-600" },
  { name: "Switch", icon: Gamepad2, color: "bg-red-100 text-red-600" },
  { name: "PC", icon: Package, color: "bg-purple-100 text-purple-600" },
  { name: "Coleccionables", icon: Sparkles, color: "bg-yellow-100 text-yellow-600" },
];

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main Hero */}
        <div className="text-center space-y-8 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-600">Plataforma verificada y segura</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Compra, vende e intercambia
            <br />
            <span className="text-primary">tus coleccionables favoritos</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La plataforma especializada en videojuegos y artículos de colección.
            Encuentra lo que buscas, vende lo que no usas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("explore")}
              className="group px-8 py-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Explorar catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="px-8 py-4 rounded-lg bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
            >
              Crear cuenta gratis
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">
            Categorías destacadas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onNavigate("explore")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-gray-600">Productos activos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5K+</div>
            <div className="text-sm text-gray-600">Usuarios registrados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-gray-600">Satisfacción</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
