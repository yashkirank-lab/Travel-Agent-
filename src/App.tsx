import { useState, useEffect } from "react";
import { Search, MapPin, Compass, Loader2, Sparkles, Heart, Map as MapIcon, Plus, Check } from "lucide-react";
import { Category, Recommendation, Itinerary, ItineraryItem } from "./types";
import { CategorySelector } from "./components/CategorySelector";
import { RecommendationCard } from "./components/RecommendationCard";
import { MockMap } from "./components/MockMap";
import { VibeCheckModal } from "./components/VibeCheckModal";
import { ItineraryBuilder } from "./components/ItineraryBuilder";
import { ItineraryList } from "./components/ItineraryList";
import { getRecommendations, verifyLocation } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

type View = "explore" | "itineraries";

export default function App() {
  const [view, setView] = useState<View>("explore");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(["Local Favorites"]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Itinerary State
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary>({
    id: Math.random().toString(36).substr(2, 9),
    title: "",
    description: "",
    items: [],
    author: "You",
    isPublic: false,
    comments: []
  });
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!location) return;
    
    setLoading(true);
    setError(null);
    try {
      // 1. Verify Location
      const verification = await verifyLocation(location);
      if (!verification || !verification.valid) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      // 2. Normalize location name if possible
      const searchLocation = verification.normalizedName || location;
      if (verification.normalizedName) setLocation(verification.normalizedName);

      // 3. Get Recommendations
      const results = await getRecommendations(searchLocation, selectedCategories);
      if (results.length === 0) {
        setError("No hidden gems found for this combination. Try different vibes!");
      }
      setRecommendations(results);
    } catch (err) {
      setError("Failed to fetch recommendations. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleVibeCheck = (id: string) => {
    const place = recommendations.find(r => r.id === id);
    if (place) {
      setActivePlace(place.name);
      setIsVibeCheckOpen(true);
    }
  };

  const addToItinerary = (rec: Recommendation) => {
    const newItem: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      place: rec,
      timing: "",
      transportation: "",
      tips: ""
    };
    setCurrentItinerary(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const saveItinerary = () => {
    if (currentItinerary.items.length === 0) return;
    
    const newItinerary = { ...currentItinerary, id: Math.random().toString(36).substr(2, 9) };
    setSavedItineraries(prev => [newItinerary, ...prev]);
    
    // Reset current
    setCurrentItinerary({
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      items: [],
      author: "You",
      isPublic: false,
      comments: []
    });
    setIsItineraryOpen(false);
    setView("itineraries");
  };

  // Initial search for demo
  useEffect(() => {
    const init = async () => {
      const initialLoc = "Tokyo, Japan";
      setLocation(initialLoc);
      setLoading(true);
      setError(null);
      try {
        const verification = await verifyLocation(initialLoc);
        if (verification && verification.valid) {
          const results = await getRecommendations(verification.normalizedName || initialLoc, ["Local Favorites", "Culinary"]);
          setRecommendations(results);
        } else {
          setError("Location not found.");
        }
      } catch (err) {
        setError("Initial load failed. Try searching for a city!");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              WanderLore <Sparkles className="text-amber-400 fill-amber-400" size={24} />
            </h1>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">AI Travel Discovery</p>
          </div>
          <button 
            onClick={() => setIsItineraryOpen(true)}
            className="relative w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 active:scale-95 transition-all"
          >
            <MapIcon size={22} />
            {currentItinerary.items.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {currentItinerary.items.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where are you exploring?"
            className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-black transition-all"
          />
          <button 
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                });
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-colors"
          >
            <MapPin size={18} />
          </button>
        </form>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {view === "explore" ? (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Category Carousel */}
              <section className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Select Your Vibe</h2>
                <CategorySelector 
                  selectedCategories={selectedCategories} 
                  onToggle={toggleCategory} 
                />
              </section>

              {/* Results */}
              <section>
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-bold">AI Recommendations</h2>
                  {loading && <Loader2 className="animate-spin text-gray-400" size={20} />}
                </div>

                {recommendations.length > 0 && !loading && (
                  <MockMap 
                    recommendations={recommendations} 
                    selectedId={selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      const el = document.getElementById(`rec-${id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  />
                )}

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="text-sm font-medium">Scanning local sentiment...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-20 text-red-400">
                        <p className="text-sm font-medium">{error}</p>
                        <button 
                          onClick={() => handleSearch()}
                          className="mt-4 text-xs font-bold underline text-gray-900"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : recommendations.length > 0 ? (
                      recommendations.map((rec) => (
                        <div key={rec.id} id={`rec-${rec.id}`} onClick={() => setSelectedId(rec.id)}>
                          <RecommendationCard 
                            recommendation={rec} 
                            onVibeCheck={handleVibeCheck}
                            onAddToItinerary={addToItinerary}
                            isSelected={selectedId === rec.id}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 text-gray-400">
                        <Compass className="mx-auto mb-4 opacity-20" size={64} />
                        <p className="text-sm">Enter a location to start your journey</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="itineraries"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-2xl font-bold">Shared Itineraries</h2>
                  <button 
                    onClick={() => setIsItineraryOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    <Plus size={14} /> Create New
                  </button>
                </div>
                
                <ItineraryList 
                  itineraries={savedItineraries} 
                  onView={(it) => {
                    setCurrentItinerary(it);
                    setIsItineraryOpen(true);
                  }} 
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-50"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check size={12} />
            </div>
            <span className="text-xs font-bold">Added to Itinerary</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <VibeCheckModal 
        isOpen={isVibeCheckOpen} 
        onClose={() => setIsVibeCheckOpen(false)} 
        placeName={activePlace || ""} 
      />

      <ItineraryBuilder 
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        currentItinerary={currentItinerary}
        onUpdate={setCurrentItinerary}
        onSave={saveItinerary}
      />

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-12 py-5 flex justify-between items-center z-40">
        <button 
          onClick={() => setView("explore")}
          className={cn("transition-all", view === "explore" ? "text-black scale-110" : "text-gray-300")}
        >
          <Compass size={26} />
        </button>
        <button 
          onClick={() => setView("itineraries")}
          className={cn("transition-all", view === "itineraries" ? "text-black scale-110" : "text-gray-300")}
        >
          <MapIcon size={26} />
        </button>
        <button className="text-gray-300">
          <Heart size={26} />
        </button>
        <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200" />
      </nav>
    </div>
  );
}
