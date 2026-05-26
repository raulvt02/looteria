import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

interface FiltersProps {
  onFilterChange: (filters: { itemType: string; platform: string; condition: string }) => void;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const hasActiveFilters = selectedItemType || selectedPlatform || selectedCondition;

  const clearFilters = () => {
    setSelectedItemType("");
    setSelectedPlatform("");
    setSelectedCondition("");
    onFilterChange({ itemType: "", platform: "", condition: "" });
  };

  const handleFilterChange = () => {
    onFilterChange({
      itemType: selectedItemType,
      platform: selectedPlatform,
      condition: selectedCondition
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-gray-900 text-lg font-semibold">
            Filtros rápidos
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Tipo de artículo
          </label>
          <select
            value={selectedItemType}
            onChange={(e) => {
              setSelectedItemType(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="videogame">Videojuegos</option>
            <option value="collectible">Coleccionables</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Plataforma
          </label>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">Todas las plataformas</option>
            <option value="ps5">PlayStation 5</option>
            <option value="xbox">Xbox Series X/S</option>
            <option value="switch">Nintendo Switch</option>
            <option value="pc">PC</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Estado
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => {
              setSelectedCondition(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="new">Nuevo</option>
            <option value="like-new">Como nuevo</option>
            <option value="very-good">Buen estado</option>
            <option value="good">En uso</option>
          </select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          <div className="flex flex-wrap gap-2">
            {selectedItemType && (
              <Badge className="bg-primary/10 text-primary border-0">
                {selectedItemType === "videogame" ? "Videojuegos" : "Coleccionables"}
              </Badge>
            )}
            {selectedPlatform && (
              <Badge className="bg-blue-100 text-blue-700 border-0">
                {selectedPlatform.toUpperCase()}
              </Badge>
            )}
            {selectedCondition && (
              <Badge className="bg-green-100 text-green-700 border-0">
                {selectedCondition === "new" ? "Nuevo" :
                 selectedCondition === "like-new" ? "Como nuevo" :
                 selectedCondition === "very-good" ? "Buen estado" : "En uso"}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}