import { Recommendation } from "../types";
import { ExternalLink, MapPin, Star, MessageSquare, Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onVibeCheck: (id: string) => void;
  onAddToItinerary: (rec: Recommendation) => void;
  isSelected?: boolean;
}

export function RecommendationCard({ recommendation, onVibeCheck, onAddToItinerary, isSelected }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-3xl p-5 shadow-sm border transition-all duration-300 mb-4",
        isSelected ? "border-black ring-1 ring-black scale-[1.02]" : "border-gray-50"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{recommendation.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
            <MapPin size={12} />
            <span>{recommendation.category}</span>
            <span className="mx-1">•</span>
            <span className="text-gray-900 font-bold">{recommendation.priceLevel}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {recommendation.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-semibold rounded-full uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {recommendation.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-3">
          {recommendation.links.yelp && (
            <a href={recommendation.links.yelp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
              <ExternalLink size={18} />
            </a>
          )}
          {recommendation.links.tripadvisor && (
            <a href={recommendation.links.tripadvisor} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
              <Star size={18} />
            </a>
          )}
          <button 
            onClick={() => onAddToItinerary(recommendation)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Add to Itinerary"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <button 
          onClick={() => onVibeCheck(recommendation.id)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all active:scale-95"
        >
          <MessageSquare size={14} />
          Vibe Check
        </button>
      </div>
    </motion.div>
  );
}
