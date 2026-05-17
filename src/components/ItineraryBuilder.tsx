import { useState } from "react";
import { Itinerary, ItineraryItem, Recommendation } from "../types";
import { X, Save, Share2, Clock, MapPin, Info, Trash2, Globe, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface ItineraryBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  currentItinerary: Itinerary;
  onUpdate: (itinerary: Itinerary) => void;
  onSave: () => void;
}

export function ItineraryBuilder({ isOpen, onClose, currentItinerary, onUpdate, onSave }: ItineraryBuilderProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const updateItem = (id: string, updates: Partial<ItineraryItem>) => {
    const newItems = currentItinerary.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate({ ...currentItinerary, items: newItems });
  };

  const removeItem = (id: string) => {
    const newItems = currentItinerary.items.filter(item => item.id !== id);
    onUpdate({ ...currentItinerary, items: newItems });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <input 
                  type="text" 
                  value={currentItinerary.title}
                  onChange={(e) => onUpdate({ ...currentItinerary, title: e.target.value })}
                  placeholder="Itinerary Title"
                  className="text-2xl font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-300 w-full"
                />
                <input 
                  type="text" 
                  value={currentItinerary.description}
                  onChange={(e) => onUpdate({ ...currentItinerary, description: e.target.value })}
                  placeholder="Add a short description..."
                  className="text-sm text-gray-400 border-none p-0 focus:ring-0 placeholder:text-gray-200 w-full mt-1"
                />
                <div className="flex items-center gap-2 mt-3 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
                  <DollarSign size={14} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={currentItinerary.budget || ""}
                    onChange={(e) => onUpdate({ ...currentItinerary, budget: e.target.value })}
                    placeholder="Estimated Budget"
                    className="text-xs font-bold text-gray-600 border-none p-0 focus:ring-0 placeholder:text-gray-300 bg-transparent"
                  />
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {currentItinerary.items.length === 0 ? (
                <div className="text-center py-20 text-gray-300">
                  <MapPin className="mx-auto mb-4 opacity-20" size={48} />
                  <p>Your itinerary is empty. Add some hidden gems!</p>
                </div>
              ) : (
                currentItinerary.items.map((item, index) => (
                  <div key={item.id} className="relative pl-8 border-l-2 border-gray-100 pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-4 border-white shadow-sm" />
                    
                    <div className="bg-gray-50 rounded-3xl p-5 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900">{item.place.name}</h4>
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{item.place.category}</span>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                            <Clock size={12} /> Timing
                          </label>
                          <input 
                            type="text" 
                            value={item.timing || ""}
                            onChange={(e) => updateItem(item.id, { timing: e.target.value })}
                            placeholder="e.g. 10:00 AM"
                            className="w-full bg-white border-none rounded-xl text-xs py-2 px-3 focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                            <Globe size={12} /> Transport
                          </label>
                          <input 
                            type="text" 
                            value={item.transportation || ""}
                            onChange={(e) => updateItem(item.id, { transportation: e.target.value })}
                            placeholder="e.g. Metro Line 1"
                            className="w-full bg-white border-none rounded-xl text-xs py-2 px-3 focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                            <Info size={12} /> Tips
                          </label>
                          <input 
                            type="text" 
                            value={item.tips || ""}
                            onChange={(e) => updateItem(item.id, { tips: e.target.value })}
                            placeholder="e.g. Bring cash"
                            className="w-full bg-white border-none rounded-xl text-xs py-2 px-3 focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button 
                onClick={onSave}
                disabled={currentItinerary.items.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Save Itinerary
              </button>
              <button 
                onClick={() => {
                  onUpdate({ ...currentItinerary, isPublic: !currentItinerary.isPublic });
                }}
                className={cn(
                  "px-6 rounded-2xl font-bold flex items-center gap-2 transition-all",
                  currentItinerary.isPublic ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
                )}
              >
                <Share2 size={18} />
                {currentItinerary.isPublic ? "Public" : "Private"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
