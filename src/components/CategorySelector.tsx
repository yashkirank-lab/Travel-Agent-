import React from "react";
import { Category } from "../types";
import { cn } from "../lib/utils";
import { 
  Camera, 
  TrendingUp, 
  Zap, 
  History, 
  Utensils, 
  Mountain, 
  Moon,
  Heart
} from "lucide-react";

interface CategorySelectorProps {
  selectedCategories: Category[];
  onToggle: (category: Category) => void;
}

const CATEGORIES: { name: Category; icon: React.ReactNode; color: string }[] = [
  { name: "Scenic", icon: <Camera size={18} />, color: "bg-blue-100 text-blue-600" },
  { name: "Trendy", icon: <TrendingUp size={18} />, color: "bg-purple-100 text-purple-600" },
  { name: "Viral", icon: <Zap size={18} />, color: "bg-yellow-100 text-yellow-600" },
  { name: "Historical", icon: <History size={18} />, color: "bg-amber-100 text-amber-600" },
  { name: "Culinary", icon: <Utensils size={18} />, color: "bg-orange-100 text-orange-600" },
  { name: "Adventure", icon: <Mountain size={18} />, color: "bg-green-100 text-green-600" },
  { name: "Nightlife", icon: <Moon size={18} />, color: "bg-indigo-100 text-indigo-600" },
  { name: "Local Favorites", icon: <Heart size={18} />, color: "bg-red-100 text-red-600" },
];

export function CategorySelector({ selectedCategories, onToggle }: CategorySelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategories.includes(cat.name);
        return (
          <button
            key={cat.name}
            onClick={() => onToggle(cat.name)}
            className={cn(
              "flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all duration-300",
              isSelected 
                ? "bg-black text-white shadow-lg scale-105" 
                : "bg-white text-gray-500 border border-gray-100 shadow-sm"
            )}
          >
            <div className={cn(
              "p-2 rounded-full",
              isSelected ? "bg-white/20" : cat.color
            )}>
              {cat.icon}
            </div>
            <span className="text-xs font-medium">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
