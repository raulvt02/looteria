import axiosInstance from '../axiosConfig';

export interface UserDTO {
  idUsuario: number;
  email: string;
  nombreUsuario: string;
  rol: string;
  fechaRegistro: string;
  ubicacion: string;
  puntosAcumulados: number;
  verificadoIdentidad: boolean;
  reputacionMedia: number;
}

export interface AdminUserUpdateRequest {
  email: string;
  nombreUsuario: string;
  rol: string;
  ubicacion: string;
  reputacionMedia: number;
  verificadoIdentidad: boolean;
}

export interface ListingDetailDTO {
  idPublicacion: number;
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  titulo: string;
  descripcion: string;
  plataforma: string;
  tipoArticulo: string;
  tipoTransaccion: string;
  precio: number;
  estadoArticulo: string;
  descripcionEstado: string;
  idioma: string;
  region: string;
  fechaCreacion: string;
  estadoPublicacion: string;
  envio: boolean;
  destacado: boolean;
}

export interface DashboardStatsDTO {
  totalUsuarios: number;
  usuariosVerificados: number;
  publicacionesActivas: number;
  transaccionesCompletadas: number;
}

export interface TransactionDTO {
  idTransaccion: number;
  publicacionId: number;
  productoTitulo: string;
  compradorId: number;
  compradorNombre: string;
  vendedorId: number;
  vendedorNombre: string;
  tipo: string;
  precioFinal: number;
  comision: number;
  estado: string;
  fechaTransaccion: string;
}

export interface ExchangeDTO {
  idIntercambio: number;
  publicacionId: number;
  publicacionTitulo: string;
  publicacionImagen?: string;
  solicitanteId: number;
  solicitanteNombre: string;
  solicitadoId: number;
  solicitadoNombre: string;
  mensaje: string;
  estado: string;
  completadoPorSolicitante: boolean;
  completadoPorSolicitado: boolean;
  fechaCreacion: string;
}

export const adminService = {
  // USUARIOS
  getAllUsers: async () => {
    return await axiosInstance.get<UserDTO[]>('/admin/usuarios');
  },

  getUserById: async (id: number) => {
    return await axiosInstance.get<UserDTO>(`/admin/usuarios/${id}`);
  },

  deleteUser: async (id: number) => {
    return await axiosInstance.delete(`/admin/usuarios/${id}`);
  },

  updateUser: async (id: number, payload: AdminUserUpdateRequest) => {
    return await axiosInstance.put<UserDTO>(`/admin/usuarios/${id}`, payload);
  },

  // PUBLICACIONES
  getAllListings: async () => {
    return await axiosInstance.get<ListingDetailDTO[]>('/admin/publicaciones');
  },

  getListingsByUser: async (userId: number) => {
    return await axiosInstance.get<ListingDetailDTO[]>(`/admin/publicaciones/usuario/${userId}`);
  },

  getListingById: async (id: number) => {
    return await axiosInstance.get<ListingDetailDTO>(`/admin/publicaciones/${id}`);
  },

  deleteListing: async (id: number) => {
    return await axiosInstance.delete(`/admin/publicaciones/${id}`);
  },

  // DASHBOARD
  getDashboardStats: async () => {
    return await axiosInstance.get<DashboardStatsDTO>('/admin/dashboard/stats');
  },

  // TRANSACCIONES
  getAllTransactions: async () => {
    return await axiosInstance.get<TransactionDTO[]>('/transacciones/all');
  },

  updateTransactionStatus: async (id: number, estado: string) => {
    return await axiosInstance.put<TransactionDTO>(`/transacciones/${id}/estado`, { estado });
  },

  deleteTransaction: async (id: number) => {
    return await axiosInstance.delete(`/admin/transacciones/${id}`);
  },

  // INTERCAMBIOS
  getAllExchanges: async () => {
    return await axiosInstance.get<ExchangeDTO[]>('/intercambios/all');
  },

  updateExchangeStatus: async (id: number, estado: string) => {
    return await axiosInstance.put<ExchangeDTO>(`/intercambios/${id}/estado`, { estado });
  },

  deleteExchange: async (id: number) => {
    return await axiosInstance.delete(`/admin/intercambios/${id}`);
  }
};

export default adminService;
