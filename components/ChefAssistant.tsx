import React, { useState } from 'react';
import { ChefHat, X, Send, Sparkles } from 'lucide-react';
import { askChefAI } from '../services/geminiService';

interface ChefAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChefAssistant: React.FC<ChefAssistantProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const answer = await askChefAI(query);
    setResponse(answer);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-start text-white">
          <div>
            <div className="flex items-center space-x-2 mb-2">
               <ChefHat size={24} className="text-yellow-300" />
               <h3 className="text-lg font-bold">Chef's Assistant</h3>
            </div>
            <p className="text-white/80 text-xs">Ask about ingredients, allergens, or wine pairings.</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="min-h-[120px] bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
            {isLoading ? (
               <div className="flex items-center justify-center h-full space-x-2 text-purple-600">
                 <Sparkles size={16} className="animate-spin" />
                 <span>Thinking...</span>
               </div>
            ) : (
              response || <span className="text-gray-400 italic">"What can I help you with today?"</span>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
              placeholder="e.g. Is the salad gluten-free?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={isLoading || !query}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
             <button onClick={() => setQuery("What wine goes with the Spicy Pizza?")} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
               🍷 Wine Pairing
             </button>
             <button onClick={() => setQuery("List common allergens in the Burger")} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
               🥜 Allergens
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefAssistant;
