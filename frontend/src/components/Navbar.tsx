import { Search, Menu, X, LogOut, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onNavigate: (page: string, idParam?: string, mode?: "login" | "register") => void;
  currentPage: string;
  userRole?: "guest" | "registered" | "admin";
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("explore");
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate("home");
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center">
              <PackageOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 text-xl font-bold">
              Looteria
            </span>
          </button>

          {/* Barra de navegación */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => onNavigate("home")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === "home"
                  ? "text-primary bg-accent"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate("explore")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === "explore"
                  ? "text-primary bg-accent"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
            >
              Catálogo
            </button>
            {user && user?.rol !== "ADMIN" && (
              <button
                onClick={() => onNavigate("profile")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === "profile"
                    ? "text-primary bg-accent"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                Mis publicaciones
              </button>
            )}
            {user?.rol === "ADMIN" && (
              <button
                onClick={() => onNavigate("admin")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === "admin"
                    ? "text-primary bg-accent"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                ⚙️ Admin
              </button>
            )}
          </div>

          {/* Right Side - User Info / Login */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.nombreUsuario}</p>
                  <p className="text-xs text-gray-500">
                    {user.rol === 'ADMIN' ? '👨‍💼 Admin' : '👤 Usuario'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("login")}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => onNavigate("login", undefined, "register")}
                  className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            <div className="pt-2 space-y-1">
              <button
                onClick={() => {
                  onNavigate("home");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  onNavigate("explore");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Catálogo
              </button>
              {user && (
                <>
                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Mis publicaciones
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("create-listing");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Crear publicación
                  </button>
                </>
              )}
              {user?.rol === "ADMIN" && (
                <button
                  onClick={() => {
                    onNavigate("admin");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Panel Admin
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <>
                  <p className="text-sm font-medium text-gray-900 px-4 py-2">
                    {user.nombreUsuario}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg mb-2"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("login", undefined, "register");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
