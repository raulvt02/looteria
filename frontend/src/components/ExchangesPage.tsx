import { useState, useEffect, useCallback } from "react";
import { Package, Clock, CheckCircle, XCircle, MessageCircle, Repeat } from "lucide-react";
import { Footer } from "./Footer";
import { useAuth } from "../context/AuthContext";
import profileService from "../api/services/profileService";
import { toast } from "sonner";

interface ExchangesPageProps {
  onNavigate: (page: string) => void;
}

interface ExchangeDTO {
  idIntercambio: number;
  publicacionId: number;
  publicacionTitulo: string;
  publicacionImagen: string | null;
  solicitanteId: number;
  solicitanteNombre: string;
  solicitadoId: number;
  solicitadoNombre: string;
  mensaje: string;
  estado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA" | "COMPLETADA";
  completadoPorSolicitante: boolean;
  completadoPorSolicitado: boolean;
  fechaCreacion: string;
}

export function ExchangesPage({ onNavigate }: ExchangesPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [received, setReceived] = useState<ExchangeDTO[]>([]);
  const [sent, setSent] = useState<ExchangeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadExchanges = useCallback(async () => {
    if (!user?.idUsuario) return;
    try {
      setLoading(true);
      const [recibidos, enviados] = await Promise.all([
        profileService.getExchangesBySolicitado(user.idUsuario),
        profileService.getExchangesBySolicitante(user.idUsuario),
      ]);
      setReceived(recibidos);
      setSent(enviados);
    } catch (err) {
      toast.error("Error al cargar los intercambios");
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    loadExchanges();
  }, [loadExchanges]);

  const handleUpdateStatus = async (id: number, estado: string) => {
    setActionLoading(id);
    try {
      await profileService.updateExchangeStatus(id, estado);
      toast.success(`Intercambio ${estado === "ACEPTADA" ? "aceptado" : "rechazado"} correctamente`);
      await loadExchanges();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al actualizar el estado");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarcarCompletado = async (id: number) => {
    if (!user?.idUsuario) return;
    setActionLoading(id);
    try {
      const result = await profileService.marcarIntercambioCompletado(id, user.idUsuario);
      if (result.estado === "COMPLETADA") {
        toast.success("¡Intercambio completado! Ambos usuarios han recibido 50 puntos.");
      } else {
        toast.success("Has marcado tu parte como completada. Esperando confirmación del otro usuario.");
      }
      await loadExchanges();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al marcar como completado");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusInfo = (estado: ExchangeDTO["estado"]) => {
    switch (estado) {
      case "PENDIENTE":
        return { icon: Clock, text: "Pendiente", color: "text-yellow-500", bg: "bg-yellow-50" };
      case "ACEPTADA":
        return { icon: CheckCircle, text: "Aceptada", color: "text-green-500", bg: "bg-green-50" };
      case "RECHAZADA":
        return { icon: XCircle, text: "Rechazada", color: "text-red-500", bg: "bg-red-50" };
      case "CANCELADA":
        return { icon: XCircle, text: "Cancelada", color: "text-gray-500", bg: "bg-gray-50" };
      case "COMPLETADA":
        return { icon: Package, text: "Completada", color: "text-blue-500", bg: "bg-blue-50" };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (ruta: string | null) => {
    if (!ruta) return "https://images.unsplash.com/photo-1593024579758-6221e85efbe6?w=400&q=80";
    return ruta.startsWith("/") ? `${import.meta.env.VITE_API_URL}${ruta}` : ruta;
  };

  const activeExchanges = activeTab === "received" ? received : sent;
  const pendingCount = received.filter((e) => e.estado === "PENDIENTE").length;

  const renderExchangeCard = (exchange: ExchangeDTO) => {
    const statusInfo = getStatusInfo(exchange.estado);
    const StatusIcon = statusInfo.icon;
    const isReceived = activeTab === "received";
    const otherUserName = isReceived ? exchange.solicitanteNombre : exchange.solicitadoNombre;
    const isLoading = actionLoading === exchange.idIntercambio;

    const yaMarcaste = isReceived
      ? exchange.completadoPorSolicitado
      : exchange.completadoPorSolicitante;

    return (
      <div key={exchange.idIntercambio} className="bg-white rounded-[10px] shadow-md hover:shadow-xl transition-all overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007BFF] to-[#00FFC6] flex items-center justify-center">
                <span className="text-white font-bold">{otherUserName?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div>
                <p className="text-[#1A1A1A] font-bold">{otherUserName}</p>
                <p className="text-gray-500 text-sm">{formatDate(exchange.fechaCreacion)}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
              <span className={`${statusInfo.color} text-sm font-semibold`}>{statusInfo.text}</span>
            </div>
          </div>

          {/* Publication info */}
          <div className="flex gap-4 mb-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={getImageUrl(exchange.publicacionImagen)}
                alt={exchange.publicacionTitulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-semibold mb-1">
                {isReceived ? "Quiere tu publicación" : "Publicación solicitada"}
              </p>
              <button
                onClick={() => onNavigate(`game:${exchange.publicacionId}`)}
                className="text-[#1A1A1A] font-bold hover:text-[#007BFF] transition-colors text-left"
              >
                {exchange.publicacionTitulo}
              </button>
              <div className="flex items-center gap-1 mt-2">
                <Repeat className="w-4 h-4 text-purple-600" />
                <span className="text-purple-600 text-sm font-medium">Intercambio</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {exchange.mensaje && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{exchange.mensaje}</p>
              </div>
            </div>
          )}

          {/* Completion progress for ACEPTADA */}
          {exchange.estado === "ACEPTADA" && (
            <div className="flex gap-4 mb-4 text-sm">
              <div className={`flex items-center gap-1 ${exchange.completadoPorSolicitante ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{exchange.solicitanteNombre}</span>
              </div>
              <div className={`flex items-center gap-1 ${exchange.completadoPorSolicitado ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{exchange.solicitadoNombre}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          {exchange.estado === "PENDIENTE" && isReceived && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus(exchange.idIntercambio, "ACEPTADA")}
                disabled={isLoading}
                className="flex-1 py-2 px-6 rounded-full bg-gradient-to-r from-[#FF2D92] to-[#A100FF] text-white hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              >
                {isLoading ? "..." : "Aceptar"}
              </button>
              <button
                onClick={() => handleUpdateStatus(exchange.idIntercambio, "RECHAZADA")}
                disabled={isLoading}
                className="flex-1 py-2 px-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-semibold disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          )}

          {exchange.estado === "PENDIENTE" && !isReceived && (
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus(exchange.idIntercambio, "CANCELADA")}
                disabled={isLoading}
                className="flex-1 py-2 px-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-semibold disabled:opacity-50"
              >
                Cancelar solicitud
              </button>
            </div>
          )}

          {exchange.estado === "ACEPTADA" && (
            <div className="flex gap-3">
              {yaMarcaste ? (
                <div className="flex-1 py-2 px-6 rounded-full bg-green-50 text-green-600 text-center font-semibold text-sm">
                  ✓ Ya marcaste como completado — esperando al otro usuario
                </div>
              ) : (
                <button
                  onClick={() => handleMarcarCompletado(exchange.idIntercambio)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-6 rounded-full bg-gradient-to-r from-[#007BFF] to-[#00FFC6] text-white hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {isLoading ? "..." : "Marcar como completado"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#00FFC6] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-2" style={{ fontSize: "2.5rem", fontWeight: "800" }}>
            Mis intercambios
          </h1>
          <p className="text-white/90" style={{ fontSize: "1.125rem" }}>
            Gestiona tus propuestas de intercambio
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-6 py-3 rounded-full transition-all ${
              activeTab === "received"
                ? "bg-gradient-to-r from-[#FF2D92] to-[#A100FF] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ fontWeight: "600" }}
          >
            Recibidas {pendingCount > 0 && `(${pendingCount})`}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-6 py-3 rounded-full transition-all ${
              activeTab === "sent"
                ? "bg-gradient-to-r from-[#FF2D92] to-[#A100FF] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ fontWeight: "600" }}
          >
            Enviadas
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando intercambios...</p>
          </div>
        )}

        {/* Exchange Cards */}
        {!loading && (
          <div className="space-y-6">
            {activeExchanges.map(renderExchangeCard)}
          </div>
        )}

        {/* Empty State */}
        {!loading && activeExchanges.length === 0 && (
          <div className="bg-white rounded-[10px] shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-[#1A1A1A] mb-2" style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              No hay intercambios
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "received"
                ? "Nadie ha solicitado intercambiar contigo todavía"
                : "Todavía no has enviado ninguna solicitud de intercambio"}
            </p>
            <button
              onClick={() => onNavigate("explore")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF2D92] to-[#A100FF] text-white hover:shadow-lg transition-all"
              style={{ fontWeight: "600" }}
            >
              Explorar juegos
            </button>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
