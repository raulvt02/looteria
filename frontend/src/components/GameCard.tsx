import { MapPin, Star, Tag, Repeat } from "lucide-react";
import { Badge } from "./ui/badge";

export interface Game {
  id: string;
  title: string;
  console: string;
  condition: string;
  image: string;
  location?: string;
  rating?: number;
  price?: number;
  type?: "sale" | "exchange" | "both";
  platform?: string;
  franchise?: string;
  itemType?: "videogame" | "figure" | "comic" | "collectible";
}

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const getItemTypeLabel = (type?: string) => {
    switch (type) {
      case "videogame": return "Videojuego";
      case "figure": return "Figura";
      case "comic": return "Cómic";
      case "collectible": return "Coleccionable";
      default: return "Producto";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "nuevo": return "bg-green-100 text-green-700";
      case "como nuevo": return "bg-blue-100 text-blue-700";
      case "excelente": return "bg-cyan-100 text-cyan-700";
      case "muy bueno": return "bg-teal-100 text-teal-700";
      case "bueno": return "bg-yellow-100 text-yellow-700";
      case "aceptable": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge className={`${getConditionColor(game.condition)} border-0`}>
            {game.condition}
          </Badge>
        </div>
        {game.type && (
          <div className="absolute top-3 left-3">
            {game.type === "exchange" || game.type === "both" ? (
              <Badge className="bg-purple-100 text-purple-700 border-0">
                <Repeat className="w-3 h-3 mr-1" />
                Intercambio
              </Badge>
            ) : null}
          </div>
        )}
        {game.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">
              {game.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-medium">
            {getItemTypeLabel(game.itemType)}
          </span>
        </div>
        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
            {game.console || game.platform}
          </span>
          {game.location && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{game.location}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {game.type === "exchange" ? (
            <div className="flex items-center gap-1">
              <Repeat className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-purple-600">Intercambio</span>
            </div>
          ) : game.price !== undefined ? (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-primary">
                {game.price > 0 ? `${game.price}€` : "Precio a consultar"}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Precio a consultar</span>
          )}
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors group-hover:underline">
            Ver detalles →
          </button>
        </div>
      </div>
    </div>
  );
}
