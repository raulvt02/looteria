import { useState, useEffect } from 'react';
import { adminService, UserDTO, ListingDetailDTO, DashboardStatsDTO, TransactionDTO, ExchangeDTO } from '../api/services/adminService';
import { homePageService } from '../api/services/homePageService';
import { Trash2, RefreshCw, AlertCircle, Check, Users, ShoppingBag, TrendingUp, ShieldCheck, Star } from 'lucide-react';

type Tab = 'dashboard' | 'usuarios' | 'publicaciones' | 'transacciones' | 'intercambios';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [listings, setListings] = useState<ListingDetailDTO[]>([]);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeDTO[]>([]);
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'user' | 'listing'; id: number } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, listingsRes, transactionsRes, exchangesRes, statsRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllListings(),
        adminService.getAllTransactions(),
        adminService.getAllExchanges(),
        adminService.getDashboardStats()
      ]);
      setUsers(usersRes.data);
      setListings(listingsRes.data);
      setTransactions(transactionsRes.data);
      setExchanges(exchangesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.idUsuario !== id));
      setSuccessMessage('Usuario eliminado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeleteConfirm(null);
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    }
  };

  const handleDeleteListing = async (id: number) => {
    try {
      await adminService.deleteListing(id);
      setListings(listings.filter(l => l.idPublicacion !== id));
      setSuccessMessage('Publicación eliminada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeleteConfirm(null);
    } catch (err) {
      setError('Error al eliminar publicación');
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await homePageService.toggleFeatured(id);
      setListings(listings.map(l => l.idPublicacion === id ? { ...l, destacado: !l.destacado } : l));
      setSuccessMessage('Estado destacado actualizado');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al actualizar destacado');
      console.error(err);
    }
  };

  const handleUpdateTransactionStatus = async (id: number, newStatus: string) => {
    try {
      await adminService.updateTransactionStatus(id, newStatus);
      setTransactions(transactions.map(t => t.idTransaccion === id ? { ...t, estado: newStatus } : t));
      setSuccessMessage('Estado de transacción actualizado');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al actualizar estado de transacción');
      console.error(err);
    }
  };

  const handleUpdateExchangeStatus = async (id: number, newStatus: string) => {
    try {
      await adminService.updateExchangeStatus(id, newStatus);
      setExchanges(exchanges.map(e => e.idIntercambio === id ? { ...e, estado: newStatus } : e));
      setSuccessMessage('Estado de intercambio actualizado');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al actualizar estado de intercambio');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium text-lg"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <Check size={20} />
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'usuarios'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('publicaciones')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'publicaciones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Publicaciones ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('transacciones')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'transacciones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Transacciones ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('intercambios')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'intercambios'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Intercambios ({exchanges.length})
          </button>
        </div>

        {/* Confirmación de eliminación */}
        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 max-w-sm">
              <h3 className="text-lg font-bold mb-4">
                ¿Está seguro de que desea eliminar?
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'user') {
                      handleDeleteUser(deleteConfirm.id);
                    } else {
                      handleDeleteListing(deleteConfirm.id);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        ) : activeTab === 'dashboard' ? (
          // DASHBOARD
          <div className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Total Usuarios</h3>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsuarios}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Usuarios Verificados</h3>
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.usuariosVerificados}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalUsuarios > 0 ? ((stats.usuariosVerificados / stats.totalUsuarios) * 100).toFixed(1) : 0}% del total
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Publicaciones Activas</h3>
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.publicacionesActivas}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Transacciones Completadas</h3>
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.transaccionesCompletadas}</p>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'usuarios' ? (
          // USUARIOS TABLE
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reputación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Verificado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No hay usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.idUsuario} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.idUsuario}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.nombreUsuario}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.rol === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.rol === 'REGISTRADO' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.ubicacion || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {user.reputacionMedia?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={user.verificadoIdentidad ? 'text-green-600' : 'text-gray-400'}>
                          {user.verificadoIdentidad ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setDeleteConfirm({ type: 'user', id: user.idUsuario! })}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'publicaciones' ? (
          // PUBLICACIONES TABLE
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Juego</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Región</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Publicación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No hay publicaciones
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr key={listing.idPublicacion} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{listing.idPublicacion}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{listing.titulo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{listing.nombreUsuario}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {listing.tipoTransaccion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {listing.precio ? `€${listing.precio.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{listing.estadoArticulo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{listing.region}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          listing.estadoPublicacion === 'ACTIVA' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.estadoPublicacion === 'ACTIVA' ? 'Activa' : 'Desactivada'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleFeatured(listing.idPublicacion!)}
                            className={`p-2 rounded transition ${listing.destacado ? 'text-yellow-600 bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                            title={listing.destacado ? 'Quitar destacado' : 'Marcar como destacado'}
                          >
                            <Star size={18} fill={listing.destacado ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'listing', id: listing.idPublicacion! })}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'transacciones' ? (
          // TRANSACCIONES TABLE
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Comprador</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendedor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No hay transacciones
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.idTransaccion} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.idTransaccion}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{transaction.productoTitulo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.compradorNombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.vendedorNombre}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {transaction.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        €{transaction.precioFinal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                          transaction.estado === 'EN_TRANSITO' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(transaction.fechaTransaccion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={transaction.estado}
                          onChange={(e) => handleUpdateTransactionStatus(transaction.idTransaccion, e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="EN_TRANSITO">EN_TRANSITO</option>
                          <option value="COMPLETADA">COMPLETADA</option>
                          <option value="CANCELADA">CANCELADA</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'intercambios' ? (
          // INTERCAMBIOS TABLE
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Solicitante</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Solicitado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No hay intercambios
                    </td>
                  </tr>
                ) : (
                  exchanges.map((exchange) => (
                    <tr key={exchange.idIntercambio} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{exchange.idIntercambio}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{exchange.publicacionTitulo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{exchange.solicitanteNombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{exchange.solicitadoNombre}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          exchange.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                          exchange.estado === 'ACEPTADA' ? 'bg-blue-100 text-blue-800' :
                          exchange.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {exchange.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(exchange.fechaCreacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={exchange.estado}
                          onChange={(e) => handleUpdateExchangeStatus(exchange.idIntercambio, e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="ACEPTADA">ACEPTADA</option>
                          <option value="RECHAZADA">RECHAZADA</option>
                          <option value="CANCELADA">CANCELADA</option>
                          <option value="COMPLETADA">COMPLETADA</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
