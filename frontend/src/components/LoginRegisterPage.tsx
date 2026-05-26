import { useState } from "react";
import { Mail, Lock, User, MapPin, Eye, EyeOff, PackageOpen, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import authService from "../api/services/authService.ts";
import { useAuth } from "../context/AuthContext";

interface LoginRegisterPageProps {
  onNavigate: (page: string) => void;
  initialMode?: "login" | "register";
}

export function LoginRegisterPage({ onNavigate, initialMode = "login" }: LoginRegisterPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Validaciones para login
        if (!loginData.email.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu email' });
          setLoading(false);
          return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginData.email)) {
          setMessage({ type: 'error', text: 'Por favor introduce un email válido' });
          setLoading(false);
          return;
        }

        if (!loginData.password.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu contraseña' });
          setLoading(false);
          return;
        }

        if (loginData.password.length < 6) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
          setLoading(false);
          return;
        }

        if (!/[A-Z]/.test(loginData.password)) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos una mayúscula' });
          setLoading(false);
          return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(loginData.password)) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)' });
          setLoading(false);
          return;
        }

        const result = await authService.login(loginData.email, loginData.password);
        login(result, result.token || "");
        setMessage({ type: 'success', text: 'Login exitoso. Redirigiendo...' });
        setTimeout(() => onNavigate('home'), 1500);
      } else {
        // Validaciones para registro
        if (!registerData.username.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu nombre de usuario' });
          setLoading(false);
          return;
        }

        if (registerData.username.length < 3) {
          setMessage({ type: 'error', text: 'El nombre de usuario debe tener al menos 3 caracteres' });
          setLoading(false);
          return;
        }

        if (!registerData.email.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu email' });
          setLoading(false);
          return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
          setMessage({ type: 'error', text: 'Por favor introduce un email válido' });
          setLoading(false);
          return;
        }

        if (!registerData.location.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu ubicación' });
          setLoading(false);
          return;
        }

        if (!registerData.password.trim()) {
          setMessage({ type: 'error', text: 'Por favor introduce tu contraseña' });
          setLoading(false);
          return;
        }

        if (registerData.password.length < 6) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
          setLoading(false);
          return;
        }

        if (!/[A-Z]/.test(registerData.password)) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos una mayúscula' });
          setLoading(false);
          return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(registerData.password)) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)' });
          setLoading(false);
          return;
        }

        if (registerData.password !== registerData.confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
          setLoading(false);
          return;
        }

        if (!registerData.acceptTerms) {
          setMessage({ type: 'error', text: 'Debes aceptar los términos y condiciones' });
          setLoading(false);
          return;
        }

        await authService.register(registerData.email, registerData.username, registerData.password);
        setMessage({ type: 'success', text: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.' });
        // Cambiar a modo de login después del registro
        setIsLogin(true);
        // Copiar email al formulario de login
        setLoginData({ email: registerData.email, password: "" });
        // Limpiar formulario de registro
        setRegisterData({
          username: "",
          email: "",
          location: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        });
        setLoading(false);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error de conexión con el servidor' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-primary to-blue-600">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center justify-center space-x-2 mb-8 mx-auto"
        >
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            <PackageOpen className="w-7 h-7 text-primary" />
          </div>
          <span className="text-white text-2xl font-bold">
            Looteria
          </span>
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                    placeholder="Tu nombre de usuario"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={isLogin ? loginData.email : registerData.email}
                  onChange={(e) =>
                    isLogin
                      ? setLoginData({ ...loginData, email: e.target.value })
                      : setRegisterData({ ...registerData, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={registerData.location}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, location: e.target.value })
                    }
                    placeholder="Tu ciudad"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={isLogin ? loginData.password : registerData.password}
                  onChange={(e) =>
                    isLogin
                      ? setLoginData({ ...loginData, password: e.target.value })
                      : setRegisterData({ ...registerData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={registerData.acceptTerms}
                    onCheckedChange={(checked: boolean) =>
                      setRegisterData({ ...registerData, acceptTerms: !!checked })
                    }
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    Acepto los{" "}
                    <a href="#" className="text-primary hover:underline">
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-primary hover:underline">
                      política de privacidad
                    </a>
                  </span>
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                </>
              ) : (
                isLogin ? "Iniciar sesión" : "Crear cuenta"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary font-medium hover:underline"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary font-medium hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => onNavigate("home")}
          className="mt-6 w-full text-center text-white hover:text-white/80 transition-colors"
        >
          ← Volver a inicio
        </button>
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
    </div>
  );
}
