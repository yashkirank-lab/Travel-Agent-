import { Recommendation } from "../types";
import { MapPin } from "lucide-react";

interface MockMapProps {
  recommendations: Recommendation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MockMap({ recommendations, selectedId, onSelect }: MockMapProps) {
  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-3xl overflow-hidden mb-6 border border-slate-200">
      {/* Abstract Map Grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", 
        backgroundSize: "20px 20px" 
      }} />
      
      {/* Mock Roads */}
      <div className="absolute top-1/2 left-0 w-full h-4 bg-white/50 -translate-y-1/2 rotate-12" />
      <div className="absolute top-0 left-1/3 w-4 h-full bg-white/50 -rotate-6" />

      {/* Place Pins */}
      {recommendations.map((rec, idx) => {
        const isSelected = selectedId === rec.id;
        return (
          <div
            key={rec.id}
            onClick={() => onSelect(rec.id)}
            className={`absolute transition-all duration-500 cursor-pointer z-10 ${isSelected ? 'scale-125' : ''}`}
            style={{
              top: `${20 + (idx * 15) % 60}%`,
              left: `${15 + (idx * 20) % 70}%`
            }}
          >
            <div className="relative group">
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-lg transition-opacity whitespace-nowrap pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {rec.name}
              </div>
              <div className={`p-2 rounded-full shadow-lg border-2 transition-all ${isSelected ? 'bg-black border-white' : 'bg-white border-black animate-bounce'}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                <MapPin size={16} className={isSelected ? 'text-white' : 'text-black'} />
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 shadow-sm border border-white/50">
        Interactive Map View
      </div>
    </div>
  );
}
