import { Hero } from "./Hero";
import { GameCard, Game } from "./GameCard";
import { HowItWorks } from "./HowItWorks";
import { Footer } from "./Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { homePageService, HomePageListingDTO } from "../api/services/homePageService";

interface HomePageProps {
  onNavigate: (page: string, gameId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, popularRes] = await Promise.all([
          homePageService.getRecentListings(6),
          homePageService.getPopularListings(4)
        ]);

        const featured = featuredRes.data.map(mapToGame);
        const popular = popularRes.data.map(mapToGame);

        setFeaturedGames(featured);
        setPopularGames(popular);
      } catch (error) {
        console.error('Error loading home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const mapToGame = (dto: HomePageListingDTO): Game => ({
    id: dto.idPublicacion.toString(),
    title: dto.titulo,
    console: dto.plataformaNombre,
    condition: dto.estadoArticuloNombre,
    image: dto.imagenes && dto.imagenes.length > 0
      ? (dto.imagenes[0].startsWith("/") ? `${import.meta.env.VITE_API_URL}${dto.imagenes[0]}` : dto.imagenes[0])
      : "https://images.unsplash.com/photo-1593024579758-6221e85efbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5c3RhdGlvbiUyMGdhbWV8ZW58MXx8fHwxNzYyMjgwMDExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: dto.regionNombre,
    rating: 4.5,
    price: dto.precio,
    type: dto.tipoTransaccion === 'VENTA' ? 'sale' : dto.tipoTransaccion === 'INTERCAMBIO' ? 'exchange' : 'both',
    itemType: dto.tipoArticuloNombre?.toLowerCase() === "videogame" ? "videogame" : "collectible",
    platform: dto.plataformaNombre,
  });

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      const newScrollPosition =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* Featured Games Section */}
      <section className="py-16 bg-white">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-gray-900 text-3xl font-bold mb-2">
                Productos destacados
              </h2>
              <p className="text-gray-600">
                Los artículos más populares de esta semana
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => onNavigate("game", game.id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Popular Games Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-gray-900 text-3xl font-bold mb-2">
                Más buscados
              </h2>
              <p className="text-gray-600">
                Los favoritos de la comunidad
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {popularGames.map((game) => (
              <div key={game.id} className="flex-shrink-0 w-80">
                <GameCard game={game} onClick={() => onNavigate("game", game.id)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}