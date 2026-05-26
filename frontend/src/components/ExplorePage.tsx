import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { GameCard } from "./GameCard";
import { Footer } from "./Footer";
import { productService, SearchListing } from "../api/services/productService";

interface ExplorePageProps {
  onNavigate: (page: string, gameId?: string) => void;
}

// Convertir SearchListing a Game para compatibilidad con GameCard
const listingToGame = (listing: SearchListing): any => ({
  id: listing.idPublicacion?.toString() || "",
  title: listing.titulo,
  console: listing.plataforma,
  condition: listing.estadoArticulo,
  image: listing.imagenUrl
    ? (listing.imagenUrl.startsWith("/") ? `${import.meta.env.VITE_API_URL}${listing.imagenUrl}` : listing.imagenUrl)
    : "https://images.unsplash.com/photo-1593024579758-6221e85efbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  location: listing.region,
  rating: 4.5,
  price: listing.precio,
  type: listing.tipoTransaccion === "VENTA" ? "sale" : "exchange",
  itemType: listing.tipoArticulo?.toLowerCase() === "videogame" ? "videogame" : "collectible",
  platform: listing.plataforma,
  description: listing.descripcion,
  user: listing.usuario,
});

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<SearchListing[]>([]);
  const [filters, setFilters] = useState({
    platform: "",
    itemType: "",
    condition: "",
    transactionType: "",
    region: "",
    priceRange: "",
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await productService.getActiveListings();
      setAllListings(response.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar publicaciones
  const filteredGames = allListings
    .filter((listing) => {
      const matchesSearch = (listing.titulo || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesPlatform =
        !filters.platform ||
        (listing.plataforma || "").toLowerCase().includes(filters.platform.toLowerCase());

      const matchesCondition =
        !filters.condition ||
        (listing.estadoArticulo || "").toLowerCase().includes(filters.condition.toLowerCase());

      const matchesTransactionType =
        !filters.transactionType ||
        listing.tipoTransaccion === filters.transactionType;

      const matchesRegion =
        !filters.region ||
        (listing.region || "").toLowerCase().includes(filters.region.toLowerCase());

      const matchesPrice =
        !filters.priceRange ||
        (filters.priceRange === "under50" && listing.precio < 50) ||
        (filters.priceRange === "50to100" &&
          listing.precio >= 50 &&
          listing.precio <= 100) ||
        (filters.priceRange === "over100" && listing.precio > 100);

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesCondition &&
        matchesTransactionType &&
        matchesRegion &&
        matchesPrice
      );
    })
    .map(listingToGame);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-4xl font-bold mb-3">Catálogo de Productos</h1>
          <p className="text-blue-100 text-lg mb-6">Descubre videojuegos y artículos de colección</p>

          {/* Search Bar */}
          <div className="max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700">
            Se encontraron <span className="text-blue-600 font-bold">{filteredGames.length}</span> productos
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
          >
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Filtrar por:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Plataforma</label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Todas</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Switch">Nintendo Switch</option>
                  <option value="PC">PC</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Como nuevo">Como nuevo</option>
                  <option value="Buen estado">Buen estado</option>
                  <option value="En uso">En uso</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de transacción</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Todas</option>
                  <option value="VENTA">Venta</option>
                  <option value="INTERCAMBIO">Intercambio</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Región</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Todas</option>
                  <option value="Europa">Europa</option>
                  <option value="América">América</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Rango de precio</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Cualquiera</option>
                  <option value="under50">Menos de $50</option>
                  <option value="50to100">$50 - $100</option>
                  <option value="over100">Más de $100</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="block text-gray-700 text-sm font-medium mb-2 invisible">-</label>
                <button
                  onClick={() => setFilters({
                    platform: "",
                    itemType: "",
                    condition: "",
                    transactionType: "",
                    region: "",
                    priceRange: "",
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-all"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="text-center py-12 text-gray-600">Cargando productos...</div>}

        {/* Products Grid */}
        {!loading && (
          <div>
            {filteredGames.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p>No hay productos que coincidan con tus filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => onNavigate("game", game.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
