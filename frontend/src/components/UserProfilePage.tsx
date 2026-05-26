import { useState, useEffect, useCallback } from "react";
import { User, Mail, MapPin, Star, Package, ShoppingBag, Truck, Trophy, Edit, Trash2, Upload, X, Clock, CheckCircle, XCircle, MessageCircle, Repeat } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "./Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import { useAuth } from "../context/AuthContext";
import profileService from "../api/services/profileService";

interface UserProfilePageProps {
  onNavigate: (page: string, gameId?: string) => void;
  userRole?: "guest" | "registered" | "admin";
}

export function UserProfilePage({ onNavigate, userRole: _userRole = "registered" }: UserProfilePageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ nombreUsuario: "", ubicacion: "" });
  const [editingListing, setEditingListing] = useState<any>(null);
  const [editListingData, setEditListingData] = useState({
    titulo: "",
    descripcionEstado: "",
    precio: "",
    tipoTransaccion: "VENTA",
    estadoArticulo: "",
    idioma: "",
    region: "",
    estadoPublicacion: "ACTIVA",
  });
  const [editingLoading, setEditingLoading] = useState(false);
  const [receivedReviews, setReceivedReviews] = useState<any[]>([]);
  const [editingImages, setEditingImages] = useState<{ idImagen: number; rutaImagen: string }[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [redemptionModal, setRedemptionModal] = useState<{ codigo: string; descripcion: string; puntosUsados: number } | null>(null);
  const [canjeLoading, setCanjeLoading] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [updatingTx, setUpdatingTx] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  
  // Exchange states
  const [exchangeActiveTab, setExchangeActiveTab] = useState<"received" | "sent">("received");
  const [exchangesReceived, setExchangesReceived] = useState<any[]>([]);
  const [exchangesSent, setExchangesSent] = useState<any[]>([]);
  const [exchangesLoading, setExchangesLoading] = useState(true);
  const [exchangeActionLoading, setExchangeActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (user?.idUsuario) {
      loadProfileData();
      loadVerificationStatus();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const data = await profileService.getProfileData(user!.idUsuario!);
      setProfile(data);
      setProfileData({ nombreUsuario: data.nombreUsuario, ubicacion: data.ubicacion || "" });

      const listings = await profileService.getUserListings(user!.idUsuario!);
      setMyListings(listings);

      const reviews = await profileService.getReceivedReviews(user!.idUsuario!);
      setReceivedReviews(reviews);

      const [asBuyer, asSeller, asSolicitante, asSolicitado] = await Promise.all([
        profileService.getTransactionsByBuyer(user!.idUsuario!),
        profileService.getTransactionsBySeller(user!.idUsuario!),
        profileService.getExchangesBySolicitante(user!.idUsuario!),
        profileService.getExchangesBySolicitado(user!.idUsuario!),
      ]);

      // Set exchanges for the exchanges tab
      setExchangesReceived(asSolicitado);
      setExchangesSent(asSolicitante);
      setExchangesLoading(false);

      const completedExchanges = [
        ...asSolicitante.filter((e: any) => e.estado === "COMPLETADA").map((e: any) => ({
          ...e,
          tipo: "INTERCAMBIO",
          rol: "solicitante",
          fechaTransaccion: e.fechaCreacion,
          titulo: e.publicacionTitulo,
          imagen: e.publicacionImagen,
          otroUsuario: e.solicitadoNombre,
        })),
        ...asSolicitado.filter((e: any) => e.estado === "COMPLETADA").map((e: any) => ({
          ...e,
          tipo: "INTERCAMBIO",
          rol: "solicitado",
          fechaTransaccion: e.fechaCreacion,
          titulo: e.publicacionTitulo,
          imagen: e.publicacionImagen,
          otroUsuario: e.solicitanteNombre,
        })),
      ];

      const merged = [
        ...asBuyer.map((t: any) => ({ ...t, rol: "comprador", tipo: "VENTA" })),
        ...asSeller
          .filter((t: any) => !asBuyer.some((b: any) => b.idTransaccion === t.idTransaccion))
          .map((t: any) => ({ ...t, rol: "vendedor", tipo: "VENTA" })),
        ...completedExchanges,
      ].sort((a, b) => new Date(b.fechaTransaccion).getTime() - new Date(a.fechaTransaccion).getTime());
      setTransactions(merged);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      const { verificado } = await profileService.getEstadoVerificacion(user!.idUsuario!);
      setIsVerified(verificado);
    } catch (error) {
      console.error("Error loading verification status:", error);
    }
  };

  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    try {
      await profileService.enviarCodigoVerificacion(user!.idUsuario!);
      toast.success("Código enviado a tu email. Revisa tu bandeja de entrada.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al enviar el código");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Introduce el código de verificación");
      return;
    }
    setVerifyingCode(true);
    try {
      await profileService.verificarCodigo(user!.idUsuario!, verificationCode);
      toast.success("¡Verificación completada! Has recibido 100 puntos.");
      setIsVerified(true);
      setShowVerificationModal(false);
      setVerificationCode("");
      await loadProfileData(); // Recargar para ver los puntos actualizados
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Código inválido o expirado");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleUpdateTransactionStatus = async (idTransaccion: number, nuevoEstado: string) => {
    setUpdatingTx(idTransaccion);
    try {
      await profileService.updateTransactionStatus(idTransaccion, nuevoEstado);
      setTransactions(prev =>
        prev.map(t => t.idTransaccion === idTransaccion ? { ...t, estado: nuevoEstado } : t)
      );
      if (nuevoEstado === "COMPLETADA") {
        toast.success("¡Recepción confirmada!");
        await loadProfileData();
      } else {
        toast.success("Estado actualizado correctamente.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al actualizar el estado");
    } finally {
      setUpdatingTx(null);
    }
  };

  // Exchange handlers
  const handleUpdateExchangeStatus = async (id: number, estado: string) => {
    setExchangeActionLoading(id);
    try {
      await profileService.updateExchangeStatus(id, estado);
      toast.success(`Intercambio ${estado === "ACEPTADA" ? "aceptado" : "rechazado"} correctamente`);
      await loadProfileData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al actualizar el estado");
    } finally {
      setExchangeActionLoading(null);
    }
  };

  const handleMarcarCompletado = async (id: number) => {
    if (!user?.idUsuario) return;
    setExchangeActionLoading(id);
    try {
      const result = await profileService.marcarIntercambioCompletado(id, user.idUsuario);
      if (result.estado === "COMPLETADA") {
        toast.success("¡Intercambio completado! Ambos usuarios han recibido 50 puntos.");
      } else {
        toast.success("Has marcado tu parte como completada. Esperando confirmación del otro usuario.");
      }
      await loadProfileData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al marcar como completado");
    } finally {
      setExchangeActionLoading(null);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await profileService.updateProfile(user!.idUsuario!, profileData);
      setProfile({ ...profile, ...profileData });
      setEditingProfile(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        await profileService.deleteListing(listingId);
        setMyListings(myListings.filter(l => l.idPublicacion !== listingId));
        toast.success("Publicación eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la publicación");
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      try {
        await profileService.deleteReview(reviewId);
        setReceivedReviews(receivedReviews.filter(r => r.idResena !== reviewId));
        toast.success("Reseña eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la reseña");
      }
    }
  };

  const handleOpenEditListing = async (listing: any) => {
    setEditingListing(listing);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    try {
      const imgs = await profileService.getImages(listing.idPublicacion);
      setEditingImages(imgs);
    } catch {
      setEditingImages([]);
    }
    setEditListingData({
      titulo: listing.titulo || "",
      descripcionEstado: listing.descripcionEstado || "",
      precio: listing.precio?.toString() || "",
      tipoTransaccion: listing.tipoTransaccion || "VENTA",
      estadoArticulo: listing.estadoArticulo || "",
      idioma: listing.idioma || "",
      region: listing.region || "",
      estadoPublicacion: listing.estadoPublicacion || "ACTIVA",
    });
  };

  const handleAddEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - editingImages.length - newImagePreviews.length;
    const toAdd = files.slice(0, remaining);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
      setNewImageFiles((prev) => [...prev, file]);
    });
  };

  const handleDeleteEditImage = async (imageId: number) => {
    try {
      await profileService.deleteImage(imageId);
      setEditingImages((prev) => prev.filter((img) => img.idImagen !== imageId));
    } catch {
      toast.error("Error al eliminar la imagen");
    }
  };

  const handleSaveEditListing = async () => {
    if (!editingListing) return;

    try {
      setEditingLoading(true);
      for (const file of newImageFiles) {
        try {
          const uploaded = await profileService.uploadImage(editingListing.idPublicacion, file);
          setEditingImages((prev) => [...prev, { idImagen: Date.now(), rutaImagen: uploaded.rutaImagen }]);
        } catch (imgErr) {
          console.error("Error subiendo imagen:", imgErr);
        }
      }
      setNewImageFiles([]);
      setNewImagePreviews([]);
      const updated = await profileService.updateListing(editingListing.idPublicacion, {
        titulo: editListingData.titulo,
        descripcionEstado: editListingData.descripcionEstado,
        precio: editListingData.precio,
        tipoTransaccion: editListingData.tipoTransaccion,
        estadoArticulo: editListingData.estadoArticulo,
        idioma: editListingData.idioma,
        region: editListingData.region,
        estadoPublicacion: editListingData.estadoPublicacion,
      });

      setMyListings(myListings.map(l =>
        l.idPublicacion === editingListing.idPublicacion
          ? { ...l, ...(updated || {}),
              titulo: editListingData.titulo,
              descripcionEstado: editListingData.descripcionEstado,
              precio: parseFloat(editListingData.precio),
              tipoTransaccion: editListingData.tipoTransaccion,
              estadoArticulo: editListingData.estadoArticulo,
              idioma: editListingData.idioma,
              region: editListingData.region,
              estadoPublicacion: editListingData.estadoPublicacion,
            }
          : l
      ));

      setEditingListing(null);
      toast.success("Publicación actualizada exitosamente");
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message || error?.message || "Error desconocido";
      toast.error("Error al actualizar la publicación: " + serverMsg);
      console.error("Error updating listing:", error?.response?.data || error);
    } finally {
      setEditingLoading(false);
    }
  };



  const getShipmentStatus = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 border-0">Entregado</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-700 border-0">En tránsito</Badge>;
      case "preparing":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Preparando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-0">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Error al cargar perfil</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Verification Banner */}
      {!isVerified && (
        <div className="bg-gradient-to-r from-blue-600 to-primary py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-1.5">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Verifica tu cuenta</p>
                <p className="text-white/80 text-xs">Obtén la insignia de usuario verificado +100 puntos</p>
              </div>
            </div>
            <Button
              onClick={() => setShowVerificationModal(true)}
              className="bg-white text-primary hover:bg-white/90 text-sm px-4 py-2"
              disabled={sendingCode}
            >
              {sendingCode ? "Enviando..." : "Verificar ahora"}
            </Button>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Verificación de cuenta</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Te enviaremos un código de 6 dígitos a tu email ({profile?.email || user?.email})
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1">El código expira en 30 minutos</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendVerificationCode}
                  variant="outline"
                  className="flex-1"
                  disabled={sendingCode}
                >
                  {sendingCode ? "..." : "Reenviar"}
                </Button>
              </div>
              <Button
                onClick={handleVerifyCode}
                className="w-full bg-primary"
                disabled={verifyingCode || verificationCode.length !== 6}
              >
                {verifyingCode ? "Verificando..." : "Verificar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={profileData.nombreUsuario}
                  onChange={(e) => setProfileData({...profileData, nombreUsuario: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={profileData.ubicacion}
                  onChange={(e) => setProfileData({...profileData, ubicacion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleUpdateProfile}
                >
                  Guardar
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Editar publicación</h2>
            <div className="space-y-4">

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título de la publicación</label>
                <input
                  type="text"
                  value={editListingData.titulo}
                  onChange={(e) => setEditListingData({ ...editListingData, titulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Título de la publicación"
                />
              </div>

              {/* Tipo de transacción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de transacción</label>
                <div className="grid grid-cols-2 gap-3">
                  {["VENTA", "INTERCAMBIO"].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setEditListingData({ ...editListingData, tipoTransaccion: tipo })}
                      className={`p-3 border-2 rounded-lg text-sm font-semibold transition ${
                        editListingData.tipoTransaccion === tipo
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tipo === "VENTA" ? "Venta" : "Intercambio"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editListingData.precio}
                  onChange={(e) => setEditListingData({ ...editListingData, precio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Estado del artículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del artículo</label>
                <select
                  value={editListingData.estadoArticulo}
                  onChange={(e) => setEditListingData({ ...editListingData, estadoArticulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Como nuevo">Como nuevo</option>
                  <option value="Buen estado">Buen estado</option>
                  <option value="En uso">En uso</option>
                  <option value="Defectuoso">Defectuoso</option>
                </select>
              </div>

              {/* Descripción del estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del estado</label>
                <textarea
                  rows={3}
                  value={editListingData.descripcionEstado}
                  onChange={(e) => setEditListingData({ ...editListingData, descripcionEstado: e.target.value })}
                  placeholder="Describe el estado del artículo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              {/* Idioma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select
                  value={editListingData.idioma}
                  onChange={(e) => setEditListingData({ ...editListingData, idioma: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Español">Español</option>
                  <option value="Inglés">Inglés</option>
                  <option value="Francés">Francés</option>
                  <option value="Alemán">Alemán</option>
                </select>
              </div>

              {/* Región */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
                <select
                  value={editListingData.region}
                  onChange={(e) => setEditListingData({ ...editListingData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Europa">Europa</option>
                  <option value="América del Norte">América del Norte</option>
                  <option value="América del Sur">América del Sur</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes ({editingImages.length + newImagePreviews.length}/3)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {editingImages.map((img) => (
                    <div key={img.idImagen} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img.rutaImagen.startsWith("/") ? `${import.meta.env.VITE_API_URL}${img.rutaImagen}` : img.rutaImagen}
                        alt="imagen"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteEditImage(img.idImagen)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={src} alt="nueva" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
                          setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {editingImages.length + newImagePreviews.length < 3 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Añadir</span>
                      <input type="file" accept="image/*" multiple onChange={handleAddEditImage} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Estado de la publicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado de la publicación</label>
                <select
                  value={editListingData.estadoPublicacion}
                  onChange={(e) => setEditListingData({ ...editListingData, estadoPublicacion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ACTIVA">Activa</option>
                  <option value="DESACTIVADA">Desactivada</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSaveEditListing}
                  disabled={editingLoading}
                >
                  {editingLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setEditingListing(null)}
                  disabled={editingLoading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl font-bold text-primary border-4 border-white shadow-xl">
              {profile.nombreUsuario?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-white text-4xl font-bold">{profile.nombreUsuario || "Usuario"}</h1>
                {profile.verificadoIdentidad && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    ✓ Verificado
                  </Badge>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-white/90 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.ubicacion || "Sin ubicación"}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setEditingProfile(true)}
              className="!bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-6 py-2"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar perfil
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <div>
                  <div className="text-2xl font-bold text-white">{profile.puntosAcumulados || 0}</div>
                  <div className="text-sm text-white/80">Puntos</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-300" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {receivedReviews.length > 0 ? (profile.reputacionMedia || 0).toFixed(2) : "—"}
                  </div>
                  <div className="text-sm text-white/80">Reputación</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">{myListings.filter(l => l.estadoPublicacion === "ACTIVA").length}</div>
                  <div className="text-sm text-white/80">Activas</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">{myListings.length}</div>
                  <div className="text-sm text-white/80">Publicaciones</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="listings">Mis publicaciones</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="exchanges">Intercambios</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            <TabsTrigger value="points">Puntos</TabsTrigger>
          </TabsList>

          {/* My Listings */}
          <TabsContent value="listings" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mis publicaciones</h2>
              <Button
                onClick={() => onNavigate("create-listing")}
                className="bg-primary hover:bg-primary/90"
              >
                Crear nueva publicación
              </Button>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No tienes publicaciones aún</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myListings.map((listing) => (
                  <div
                    key={listing.idPublicacion}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {listing.imagenes && listing.imagenes.length > 0 ? (
                          <img
                            src={listing.imagenes[0].startsWith("/") ? `${import.meta.env.VITE_API_URL}${listing.imagenes[0]}` : listing.imagenes[0]}
                            alt={listing.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {listing.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {listing.tipoTransaccion}
                            </p>
                          </div>
                          <Badge className={
                            listing.estadoPublicacion === "ACTIVA"
                              ? "bg-green-100 text-green-700 border-0"
                              : "bg-gray-100 text-gray-700 border-0"
                          }>
                            {listing.estadoPublicacion === "ACTIVA" ? "Activa" : "Desactivada"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          {listing.tipoTransaccion === "INTERCAMBIO" ? (
                            <span className="text-2xl font-bold text-blue-600">Intercambio</span>
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">{listing.precio}€</span>
                          )}
                          <span>{new Date(listing.fechaCreacion.split('T')[0]).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate("game", listing.idPublicacion)}
                          >
                            Ver publicación
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenEditListing(listing)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteListing(listing.idPublicacion)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de transacciones</h2>
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No tienes transacciones aún</p>
              </div>
            ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((t) => (
                      <tr key={t.idTransaccion || t.idIntercambio} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {t.tipo === "INTERCAMBIO" ? (
                            <Badge className="bg-blue-100 text-blue-700 border-0">Intercambio</Badge>
                          ) : (
                            <Badge className={t.rol === "vendedor" ? "bg-green-100 text-green-700 border-0" : "bg-blue-100 text-blue-700 border-0"}>
                              {t.rol === "vendedor" ? "Venta" : "Compra"}
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{t.titulo || t.productoTitulo || "Producto"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {t.tipo === "INTERCAMBIO" ? t.otroUsuario : (t.rol === "vendedor" ? t.compradorNombre : t.vendedorNombre)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {t.tipo === "INTERCAMBIO" ? (
                            <span>Intercambio</span>
                          ) : (
                            t.precioFinal > 0 ? `${t.precioFinal}€` : "-"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {t.estado === "COMPLETADA" && <Badge className="bg-green-100 text-green-700 border-0">Completado</Badge>}
                          {t.estado === "PENDIENTE" && <Badge className="bg-yellow-100 text-yellow-700 border-0">Pendiente</Badge>}
                          {t.estado === "EN_TRANSITO" && <Badge className="bg-blue-100 text-blue-700 border-0">En tránsito</Badge>}
                          {t.estado === "CANCELADA" && <Badge className="bg-red-100 text-red-700 border-0">Cancelada</Badge>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {t.fechaTransaccion ? new Date(t.fechaTransaccion).toLocaleDateString("es-ES") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {t.tipo !== "INTERCAMBIO" && t.rol === "vendedor" && t.estado === "PENDIENTE" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingTx === t.idTransaccion}
                              onClick={() => handleUpdateTransactionStatus(t.idTransaccion, "EN_TRANSITO")}
                            >
                              {updatingTx === t.idTransaccion ? "..." : "Marcar enviado"}
                            </Button>
                          )}
                          {t.rol === "comprador" && t.estado === "EN_TRANSITO" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={updatingTx === t.idTransaccion}
                              onClick={() => handleUpdateTransactionStatus(t.idTransaccion, "COMPLETADA")}
                            >
                              {updatingTx === t.idTransaccion ? "..." : "Confirmar recepción"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </TabsContent>

          {/* Exchanges */}
          <TabsContent value="exchanges" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis intercambios</h2>
            
            {/* Sub-tabs for received/sent */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setExchangeActiveTab("received")}
                className={`px-6 py-3 rounded-full transition-all ${
                  exchangeActiveTab === "received"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Recibidas {exchangesReceived.filter((e) => e.estado === "PENDIENTE").length > 0 && `(${exchangesReceived.filter((e) => e.estado === "PENDIENTE").length})`}
              </button>
              <button
                onClick={() => setExchangeActiveTab("sent")}
                className={`px-6 py-3 rounded-full transition-all ${
                  exchangeActiveTab === "sent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Enviadas
              </button>
            </div>

            {exchangesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando intercambios...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(exchangeActiveTab === "received" ? exchangesReceived : exchangesSent).map((exchange) => {
                  const isReceived = exchangeActiveTab === "received";
                  const otherUserName = isReceived ? exchange.solicitanteNombre : exchange.solicitadoNombre;
                  const isLoading = exchangeActionLoading === exchange.idIntercambio;
                  const yaMarcaste = isReceived
                    ? exchange.completadoPorSolicitado
                    : exchange.completadoPorSolicitante;

                  const getStatusInfo = (estado: string) => {
                    switch (estado) {
                      case "PENDIENTE": return { icon: Clock, text: "Pendiente", color: "text-yellow-500", bg: "bg-yellow-50" };
                      case "ACEPTADA": return { icon: CheckCircle, text: "Aceptada", color: "text-green-500", bg: "bg-green-50" };
                      case "RECHAZADA": return { icon: XCircle, text: "Rechazada", color: "text-red-500", bg: "bg-red-50" };
                      case "CANCELADA": return { icon: XCircle, text: "Cancelada", color: "text-gray-500", bg: "bg-gray-50" };
                      case "COMPLETADA": return { icon: Package, text: "Completada", color: "text-blue-500", bg: "bg-blue-50" };
                      default: return { icon: Clock, text: estado, color: "text-gray-500", bg: "bg-gray-50" };
                    }
                  };

                  const statusInfo = getStatusInfo(exchange.estado);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={exchange.idIntercambio} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{otherUserName?.[0]?.toUpperCase() || "?"}</span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold">{otherUserName}</p>
                            <p className="text-gray-500 text-sm">{new Date(exchange.fechaCreacion).toLocaleDateString("es-ES")}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          <span className={`${statusInfo.color} text-sm font-semibold`}>{statusInfo.text}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={exchange.publicacionImagen?.startsWith("/") ? `${import.meta.env.VITE_API_URL}${exchange.publicacionImagen}` : exchange.publicacionImagen || "https://images.unsplash.com/photo-1593024579758-6221e85efbe6?w=400&q=80"}
                            alt={exchange.publicacionTitulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-500 text-sm font-semibold mb-1">
                            {isReceived ? "Quiere tu publicación" : "Publicación solicitada"}
                          </p>
                          <button
                            onClick={() => onNavigate("game", exchange.publicacionId)}
                            className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-left"
                          >
                            {exchange.publicacionTitulo}
                          </button>
                          <div className="flex items-center gap-1 mt-2">
                            <Repeat className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 text-sm font-medium">Intercambio</span>
                          </div>
                        </div>
                      </div>

                      {exchange.mensaje && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{exchange.mensaje}</p>
                          </div>
                        </div>
                      )}

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

                      <div className="flex gap-3">
                        {exchange.estado === "PENDIENTE" && isReceived && (
                          <>
                            <Button
                              onClick={() => handleUpdateExchangeStatus(exchange.idIntercambio, "ACEPTADA")}
                              disabled={isLoading}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              {isLoading ? "..." : "Aceptar"}
                            </Button>
                            <Button
                              onClick={() => handleUpdateExchangeStatus(exchange.idIntercambio, "RECHAZADA")}
                              disabled={isLoading}
                              variant="outline"
                              className="flex-1"
                            >
                              Rechazar
                            </Button>
                          </>
                        )}

                        {exchange.estado === "PENDIENTE" && !isReceived && (
                          <Button
                            onClick={() => handleUpdateExchangeStatus(exchange.idIntercambio, "CANCELADA")}
                            disabled={isLoading}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancelar solicitud
                          </Button>
                        )}

                        {exchange.estado === "ACEPTADA" && (
                          yaMarcaste ? (
                            <div className="flex-1 py-2 px-6 rounded-full bg-green-50 text-green-600 text-center font-semibold text-sm">
                              ✓ Ya marcaste como completado — esperando al otro usuario
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleMarcarCompletado(exchange.idIntercambio)}
                              disabled={isLoading}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              {isLoading ? "..." : "Marcar como completado"}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}

                {(exchangeActiveTab === "received" ? exchangesReceived : exchangesSent).length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {exchangeActiveTab === "received"
                        ? "Nadie ha solicitado intercambiar contigo todavía"
                        : "Todavía no has enviado ninguna solicitud de intercambio"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis reseñas recibidas ({receivedReviews.length})</h2>
            {receivedReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aún no tienes reseñas recibidas</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {receivedReviews.map((review) => (
                  <div key={review.idResena} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.usuarioRevisor}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{new Date(review.fecha).toLocaleDateString("es-ES")}</span>
                            <button
                              onClick={() => handleDeleteReview(review.idResena)}
                              className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar reseña"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.calificacion
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{review.calificacion}/5</span>
                        </div>
                        <p className="text-gray-700">{review.comentario}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Points */}
          <TabsContent value="points" className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Tus puntos Looteria</h2>
              <div className="text-6xl font-bold mb-4">{profile.puntosAcumulados || 0}</div>
              <p className="text-white/90">
                Gana puntos con cada venta y canjéalos por descuentos y beneficios exclusivos
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cómo ganar puntos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Por cada venta completada</span>
                  </div>
                  <span className="font-bold text-primary">+50 puntos</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Por cada reseña positiva recibida (4-5 estrellas)</span>
                  </div>
                  <span className="font-bold text-primary">+25 puntos</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Verificación de identidad</span>
                  </div>
                  <span className="font-bold text-primary">+100 puntos</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Canjear puntos</h3>
              <div className="grid md:grid-cols-1 gap-4 max-w-md mx-auto">
                {([
                  { tipo: "DESCUENTO_5", puntos: 500, titulo: "500 puntos", descripcion: "Descuento 5€ en tu próxima compra" },
                ] as const).map((oferta) => {
                  const suficientes = (profile.puntosAcumulados || 0) >= oferta.puntos;
                  return (
                    <div
                      key={oferta.tipo}
                      className={`border-2 rounded-lg p-4 transition-colors ${
                        suficientes ? "border-gray-200 hover:border-primary cursor-pointer" : "border-gray-100 opacity-60"
                      }`}
                    >
                      <div className="text-lg font-bold text-gray-900 mb-2">{oferta.titulo}</div>
                      <div className="text-gray-600 mb-3">{oferta.descripcion}</div>
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled={!suficientes || canjeLoading === oferta.tipo}
                        onClick={async () => {
                          setCanjeLoading(oferta.tipo);
                          try {
                            const result = await profileService.canjearPuntos(user!.idUsuario!, oferta.tipo);
                            setProfile((p: any) => ({ ...p, puntosAcumulados: result.puntosRestantes }));
                            setRedemptionModal({ codigo: result.codigo, descripcion: result.descripcion, puntosUsados: result.puntosUsados });
                          } catch (e: any) {
                            toast.error(e?.response?.data?.message || "Error al canjear puntos");
                          } finally {
                            setCanjeLoading(null);
                          }
                        }}
                      >
                        {canjeLoading === oferta.tipo ? "Canjeando..." : suficientes ? "Canjear" : `Faltan ${oferta.puntos - (profile.puntosAcumulados || 0)} puntos`}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal código de canje */}
            {redemptionModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRedemptionModal(null)}>
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Canje exitoso!</h3>
                    <p className="text-gray-600 mb-6">{redemptionModal.descripcion}</p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="text-sm text-gray-500 mb-2">Tu código de descuento</p>
                      <div className="text-2xl font-mono font-bold text-primary tracking-widest">
                        {redemptionModal.codigo}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Guarda este código y úsalo en tu próximo pedido. Se han descontado <strong>{redemptionModal.puntosUsados} puntos</strong> de tu cuenta.</p>
                    <Button className="w-full" onClick={() => setRedemptionModal(null)}>Cerrar</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
