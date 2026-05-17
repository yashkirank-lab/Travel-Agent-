import { Itinerary } from "../types";
import { Star, MessageSquare, User, MapPin, Share2, DollarSign } from "lucide-react";
import { motion } from "motion/react";

interface ItineraryListProps {
  itineraries: Itinerary[];
  onView: (itinerary: Itinerary) => void;
}

export function ItineraryList({ itineraries, onView }: ItineraryListProps) {
  return (
    <div className="space-y-6">
      {itineraries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No public itineraries yet. Be the first to share one!</p>
        </div>
      ) : (
        itineraries.map((itinerary) => (
          <motion.div
            key={itinerary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onView(itinerary)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{itinerary.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{itinerary.description}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                <Star size={12} fill="currentColor" />
                {itinerary.rating || 4.5}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2">
                {itinerary.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                    {item.place.name[0]}
                  </div>
                ))}
                {itinerary.items.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-black text-white border-2 border-white flex items-center justify-center text-[10px] font-bold">
                    +{itinerary.items.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium">{itinerary.items.length} Stops</span>
              {itinerary.budget && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
                  <DollarSign size={10} />
                  {itinerary.budget}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={12} className="text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-600">{itinerary.author}</span>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <MessageSquare size={14} />
                  {itinerary.comments?.length || 0}
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Share2 size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
