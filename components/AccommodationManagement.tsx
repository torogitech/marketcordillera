import React, { useState } from 'react';
import { Accommodation, AccommodationStatus } from '../types';
import { BedDouble, Users, CheckSquare, CheckCircle2, AlertTriangle, Key, Layers, DollarSign } from 'lucide-react';

interface AccommodationManagementProps {
  accommodations: Accommodation[];
  onAccommodationSelect: (accommodation: Accommodation) => void;
}

const AccommodationManagement: React.FC<AccommodationManagementProps> = ({ accommodations, onAccommodationSelect }) => {
  const [filter, setFilter] = useState<AccommodationStatus | 'All'>('All');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredAccommodations = accommodations.filter(a => filter === 'All' || a.status === filter);

  const getStatusColor = (status: AccommodationStatus) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Booked': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cleaning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: AccommodationStatus) => {
      switch (status) {
        case 'Available': return <CheckCircle2 size={14} className="mr-1.5" />;
        case 'Booked': return <Key size={14} className="mr-1.5" />;
        case 'Cleaning': return <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>;
        case 'Maintenance': return <AlertTriangle size={14} className="mr-1.5" />;
        default: return <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>;
      }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage rooms, bookings, and housekeeping.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsMultiSelect(!isMultiSelect);
              setSelectedIds(new Set());
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              isMultiSelect 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isMultiSelect ? <CheckCircle2 size={16}/> : <CheckSquare size={16}/>}
            {isMultiSelect ? 'Cancel Selection' : 'Select Multiple'}
          </button>

          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm hidden md:flex">
            {(['All', 'Available', 'Booked', 'Cleaning', 'Maintenance'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === status 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Scroll */}
      <div className="md:hidden flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
         {(['All', 'Available', 'Booked', 'Cleaning', 'Maintenance'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === status 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAccommodations.map((accommodation) => {
          const isSelected = selectedIds.has(accommodation.id);

          return (
            <div 
              key={accommodation.id} 
              className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col cursor-pointer ${
                isSelected 
                  ? 'ring-4 ring-orange-500 border-orange-500 transform scale-[1.02]' 
                  : 'border-gray-100'
              }`}
              onClick={() => {
                if (isMultiSelect) {
                  toggleSelection(accommodation.id);
                } else {
                  onAccommodationSelect(accommodation);
                }
              }}
            >
              {/* Selection Checkbox Overlay */}
              {isMultiSelect && (
                <div className="absolute top-4 right-4 z-10">
                   <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}>
                      {isSelected && <CheckSquare size={14} className="text-white" />}
                   </div>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                 <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    <img src={accommodation.image} alt={accommodation.roomNumber} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg">
                      Floor {accommodation.floor}
                    </div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 truncate">Room {accommodation.roomNumber}</h3>
                    </div>
                    <div className="text-sm font-medium text-orange-600 mb-1">{accommodation.type}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-1 truncate">
                        <Users size={12} className="mr-1" />
                        Up to {accommodation.capacity} Guests
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(accommodation.status)}`}>
                    {getStatusBadge(accommodation.status)}
                    {accommodation.status}
                  </span>
                  <div className="text-sm font-bold text-gray-800">
                     ₱{accommodation.pricePerNight.toLocaleString()}
                     <span className="text-xs text-gray-400 font-normal">/night</span>
                  </div>
              </div>

              {/* Guest / Status Info */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-1">
                 {accommodation.status === 'Booked' && accommodation.currentGuest ? (
                   <div>
                     <span className="text-xs text-gray-500 block">Current Guest</span>
                     <span className="font-medium text-gray-900 text-sm">{accommodation.currentGuest}</span>
                   </div>
                 ) : (
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-gray-400">Features:</span>
                       <div className="flex -space-x-1 overflow-hidden">
                          {accommodation.features.slice(0,3).map((f, i) => (
                             <div key={i} className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-600">{f}</div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onAccommodationSelect(accommodation);
                  }}
                  disabled={isMultiSelect}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-gray-200 disabled:opacity-50"
                >
                  <BedDouble size={16} />
                  <span>Manage Room</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar for Multi-Select */}
      {selectedIds.size > 0 && (
         <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 max-w-2xl w-full mx-auto">
               <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                     <CheckSquare size={20} />
                  </div>
                  <div>
                     <p className="font-bold text-gray-900">{selectedIds.size} Selected</p>
                     <p className="text-xs text-gray-500">Manage multiple rooms</p>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-3">
                  <button 
                    className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    <Layers size={18} />
                    <span>Update Status</span>
                  </button>
               </div>
            </div>
         </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AccommodationManagement;