
import React, { useState, useEffect, useRef } from 'react';
import { Restaurant, RestaurantStatus } from '../types';
import { 
  MapPin, Users, BarChart3, Settings2, CheckCircle2, 
  AlertCircle, CheckSquare, Star, UtensilsCrossed, 
  BookOpen, ShoppingCart, Activity, X, Map as MapIcon, 
  LayoutGrid, Crosshair, Search
} from 'lucide-react';

interface RestaurantManagementProps {
  restaurants: Restaurant[];
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

const RestaurantManagement: React.FC<RestaurantManagementProps> = ({ restaurants, onRestaurantSelect }) => {
  const [filter, setFilter] = useState<RestaurantStatus | 'All'>('All');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMapView, setIsMapView] = useState(false);
  const [mapFilteredRestaurants, setMapFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Coordinates for the map center (Baguio City)
  const defaultCenter: [number, number] = [16.4023, 120.5960];

  useEffect(() => {
    if (isMapView && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const map = L.map('restaurant-map').setView(defaultCenter, 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Listen for map movements to "filter by location"
      map.on('moveend', () => {
        handleMapFilter();
      });
    }

    if (isMapView && mapInstanceRef.current) {
      updateMapMarkers();
    }

    return () => {
      // We don't necessarily want to destroy the map every time, but Leaflet needs care
    };
  }, [isMapView, filter, restaurants]);

  const handleMapFilter = () => {
    if (!mapInstanceRef.current) return;
    const bounds = mapInstanceRef.current.getBounds();
    const visible = restaurants.filter(r => {
      if (!r.lat || !r.lng) return false;
      const point = (window as any).L.latLng(r.lat, r.lng);
      const matchesStatus = filter === 'All' || r.status === filter;
      return bounds.contains(point) && matchesStatus;
    });
    setMapFilteredRestaurants(visible);
  };

  const updateMapMarkers = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    restaurants.forEach(r => {
      if (r.lat && r.lng && (filter === 'All' || r.status === filter)) {
        const marker = L.marker([r.lat, r.lng]).addTo(mapInstanceRef.current);
        
        const popupContent = `
          <div class="p-0">
            <img src="${r.image}" class="w-full h-24 object-cover" />
            <div class="p-3">
              <h4 class="font-bold text-gray-900">${r.name}</h4>
              <p class="text-xs text-gray-500 mb-2">${r.cuisineType}</p>
              <div class="flex items-center text-orange-600 font-bold text-sm">
                ₱${r.todayRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          // Optional: handle selection on click
        });
        
        markersRef.current.push(marker);
      }
    });
  };

  const filteredRestaurants = isMapView ? mapFilteredRestaurants : restaurants.filter(r => filter === 'All' || r.status === filter);

  const getStatusColor = (status: RestaurantStatus) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700 border-green-200';
      case 'Busy': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Closed': return 'bg-gray-200 text-gray-600 border-gray-300';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: RestaurantStatus) => {
      switch (status) {
        case 'Open': return <CheckCircle2 size={14} className="mr-1.5" />;
        case 'Busy': return <Users size={14} className="mr-1.5" />;
        case 'Maintenance': return <AlertCircle size={14} className="mr-1.5" />;
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

  const handleQuickAction = (e: React.MouseEvent, action: string, restaurant: Restaurant) => {
    e.stopPropagation();
    alert(`${action} for ${restaurant.name}`);
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(defaultCenter, 13);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage locations, monitor capacity, and track revenue.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
             <button 
               onClick={() => setIsMapView(false)}
               className={`p-2 rounded-lg transition-all ${!isMapView ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
             >
                <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setIsMapView(true)}
               className={`p-2 rounded-lg transition-all ${isMapView ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
             >
                <MapIcon size={20} />
             </button>
          </div>

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
            {(['All', 'Open', 'Busy', 'Closed', 'Maintenance'] as const).map((status) => (
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

      {isMapView && (
        <div className="mb-8 relative h-[500px] w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                    <MapPin size={18} className="text-orange-500" />
                    <span>Map View: {mapFilteredRestaurants.length} Restaurants Visible</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                      onClick={handleRecenter}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                    >
                        <Crosshair size={16} /> Recenter
                    </button>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        Move map to filter list below
                    </div>
                </div>
            </div>
            <div id="restaurant-map" className="flex-1"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRestaurants.map((restaurant) => {
          const isSelected = selectedIds.has(restaurant.id);
          const isDeactivated = restaurant.status === 'Closed';

          return (
            <div 
              key={restaurant.id} 
              className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col cursor-pointer ${
                isDeactivated ? 'bg-gray-100 border-gray-200' : 'bg-white'
              } ${
                isSelected 
                  ? 'ring-4 ring-orange-500 border-orange-500 transform scale-[1.02]' 
                  : 'border-gray-100'
              }`}
              onClick={() => {
                if (isMultiSelect) {
                  toggleSelection(restaurant.id);
                } else {
                  onRestaurantSelect(restaurant);
                }
              }}
            >
              {/* Checkbox Overlay for Multi-Select */}
              {isMultiSelect && (
                <div className="absolute top-4 right-4 z-20">
                   <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}>
                      {isSelected && <CheckSquare size={14} className="text-white" />}
                   </div>
                </div>
              )}

              {/* Quick Action Hover Bar - Replaces Kebab Menu */}
              {!isMultiSelect && (
                <div className="absolute top-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-center gap-1 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-sm">
                   <button 
                     onClick={(e) => handleQuickAction(e, 'Viewing Menu', restaurant)}
                     title="View Menu"
                     className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                   >
                     <BookOpen size={18} />
                   </button>
                   <button 
                     onClick={(e) => handleQuickAction(e, 'Managing Orders', restaurant)}
                     title="Manage Orders"
                     className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                   >
                     <ShoppingCart size={18} />
                   </button>
                   <button 
                     onClick={(e) => handleQuickAction(e, 'Setting Status', restaurant)}
                     title="Set Status"
                     className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                   >
                     <Activity size={18} />
                   </button>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                 <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 ${isDeactivated ? 'opacity-75' : ''}`}>
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isDeactivated ? 'grayscale' : ''}`} 
                    />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold truncate ${isDeactivated ? 'text-gray-500' : 'text-gray-800'}`}>
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 truncate">
                        <MapPin size={12} className="mr-1" />
                        {restaurant.address.split(',')[0]}
                    </div>
                    <div className={`flex items-center text-xs mt-1 truncate font-medium ${isDeactivated ? 'text-gray-400' : 'text-orange-600'}`}>
                        <UtensilsCrossed size={12} className="mr-1" />
                        {restaurant.cuisineType}
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(restaurant.status)}`}>
                    {getStatusBadge(restaurant.status)}
                    {restaurant.status}
                  </span>
                  <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg border ${isDeactivated ? 'bg-gray-200 border-gray-300 text-gray-500' : 'bg-yellow-50 border-yellow-100 text-gray-700'}`}>
                     <Star size={12} className={`mr-1 ${isDeactivated ? 'text-gray-500 fill-gray-500' : 'text-yellow-500 fill-yellow-500'}`} />
                     {restaurant.rating}
                  </div>
              </div>

              {/* Stats Grid */}
              <div className={`grid grid-cols-2 gap-3 mb-4 ${isDeactivated ? 'opacity-60' : ''}`}>
                 <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1 flex items-center"><Users size={12} className="mr-1"/> Capacity</div>
                    <div className="font-bold text-gray-800">{restaurant.capacity}</div>
                 </div>
                 <div className={`${isDeactivated ? 'bg-gray-200' : 'bg-orange-50'} rounded-xl p-3`}>
                    <div className={`text-xs mb-1 flex items-center ${isDeactivated ? 'text-gray-500' : 'text-orange-600'}`}><BarChart3 size={12} className="mr-1"/> Revenue</div>
                    <div className={`font-bold ${isDeactivated ? 'text-gray-600' : 'text-orange-700'}`}>₱{restaurant.todayRevenue.toLocaleString()}</div>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onRestaurantSelect(restaurant);
                  }}
                  disabled={isMultiSelect}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 ${
                    isDeactivated 
                      ? 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200 group-hover:bg-orange-600 group-hover:shadow-orange-200'
                  }`}
                >
                  <Settings2 size={16} />
                  <span>Manage Location</span>
                </button>
              </div>
            </div>
          );
        })}
        {filteredRestaurants.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 p-4 rounded-2xl mb-4">
                  <Activity size={32} />
              </div>
              <h4 className="text-gray-900 font-bold">No restaurants in this area</h4>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">Try moving the map or changing your status filter.</p>
          </div>
        )}
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
                     <p className="text-xs text-gray-500">Manage multiple locations</p>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-3">
                  <button 
                    className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    <Settings2 size={18} />
                    <span>Update Status</span>
                  </button>
               </div>
               <button 
                 onClick={() => {
                   setIsMultiSelect(false);
                   setSelectedIds(new Set());
                 }}
                 className="p-2 text-gray-400 hover:text-gray-600"
               >
                 <X size={20} />
               </button>
            </div>
         </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RestaurantManagement;
