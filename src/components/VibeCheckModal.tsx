import { useState } from "react";
import { X, Heart, ThumbsDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VibeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
}

export function VibeCheckModal({ isOpen, onClose, placeName }: VibeCheckModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (vibe: string) => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vibe Check</h2>
                <p className="text-gray-500 text-sm mb-8">How was your experience at <span className="text-black font-semibold">{placeName}</span>?</p>

                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleSubmit("Authentic")}
                    className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                      <Heart className="text-red-500" size={24} />
                    </div>
                    <span className="text-xs font-bold">Authentic</span>
                  </button>

                  <button 
                    onClick={() => handleSubmit("Hidden Gem")}
                    className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="p-3 bg-yellow-50 rounded-2xl group-hover:bg-yellow-100 transition-colors">
                      <Zap className="text-yellow-500" size={24} />
                    </div>
                    <span className="text-xs font-bold">Hidden Gem</span>
                  </button>

                  <button 
                    onClick={() => handleSubmit("Crowded")}
                    className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                      <ThumbsDown className="text-gray-400" size={24} />
                    </div>
                    <span className="text-xs font-bold">Crowded</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Feedback Received!</h3>
                <p className="text-gray-500 text-sm mt-2">Updating AI training data...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
