
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { STORES } from '../constants';
import { Store, StoreStatus, CartItem } from '../types';
import { 
  X, CheckSquare, CheckCircle2, LayoutGrid, Map as MapIcon, 
  Crosshair, Package, BarChart3, AlertTriangle,
  Search, MoreVertical, Store as StoreIcon, ChevronRight,
  Info, Navigation, MapPin, LocateFixed
} from 'lucide-react';

interface StoreManagementProps {
  cart?: CartItem[];
  activeStoreId?: string;
  onStoreSelect?: (id: string) => void;
  onNavigateToMenu?: () => void;
  onOpenCart?: () => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ 
  onStoreSelect
}) => {
  const [filter, setFilter] = useState<StoreStatus | 'All'>('All');
  const [isMapView, setIsMapView] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(new Set());
  const [followMap, setFollowMap] = useState(true);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [addressSearch, setAddressSearch] = useState('');
  
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Baguio center
  const defaultCenter: [number, number] = [16.4023, 120.5960];

  useEffect(() => {
    if (isMapView && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const map = L.map('store-map', {
        zoomControl: false
      }).setView(defaultCenter, 13);
      
      mapInstanceRef.current = map;

      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      map.on('moveend', () => {
        setMapBounds(map.getBounds());
      });
      
      // Initialize bounds
      setMapBounds(map.getBounds());
    }

    if (isMapView && mapInstanceRef.current) {
      updateMapMarkers();
    }
  }, [isMapView, filter]);

  const updateMapMarkers = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    STORES.forEach(s => {
      if (s.lat && s.lng && (filter === 'All' || s.status === filter)) {
        const markerColor = s.status === 'Open' ? '#10b981' : s.status === 'Stock Low' ? '#f59e0b' : '#ef4444';
        
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(mapInstanceRef.current);
        
        const popupContent = `
          <div class="p-0 font-sans">
            <img src="${s.image}" class="w-full h-24 object-cover" />
            <div class="p-3">
              <p class="text-[9px] font-black uppercase text-orange-500 mb-0.5">${s.type}</p>
              <h4 class="font-bold text-gray-900 text-sm mb-1">${s.name}</h4>
              <div class="flex items-center justify-between mt-2">
                <span class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold">${s.status}</span>
                <span class="text-[10px] text-gray-500 font-bold">${s.inventoryLevel}% Stock</span>
              </div>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          closeButton: false,
          offset: [0, -5]
        });
        
        markersRef.current.push(marker);
      }
    });
  };

  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressSearch.trim()) return;
    
    // Simple geocoding simulation or actual call if needed
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch + ', Philippines')}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapInstanceRef.current?.setView([lat, lon], 15);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const filteredStores = useMemo(() => {
    return STORES.filter(s => {
      const matchesStatus = filter === 'All' || s.status === filter;
      if (!matchesStatus) return false;
      
      if (isMapView && followMap && mapBounds) {
        const L = (window as any).L;
        if (s.lat && s.lng) {
          const point = L.latLng(s.lat, s.lng);
          return mapBounds.contains(point);
        }
        return false;
      }
      
      return true;
    });
  }, [filter, mapBounds, followMap, isMapView]);

  const getStatusStyle = (status: StoreStatus) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700 border-green-200';
      case 'Stock Low': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      case 'Closed': return 'bg-gray-200 text-gray-600 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedStoreIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStoreIds(newSet);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Retail Hub <span className="text-orange-500">.</span></h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Unified inventory and logistics management for regional retail partners.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
             <button 
               onClick={() => setIsMapView(false)}
               className={`p-2.5 rounded-xl transition-all ${!isMapView ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
               title="Grid View"
             >
                <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setIsMapView(true)}
               className={`p-2.5 rounded-xl transition-all ${isMapView ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
               title="Map View"
             >
                <MapIcon size={20} />
             </button>
          </div>

          <button
            onClick={() => {
              setIsMultiSelect(!isMultiSelect);
              setSelectedStoreIds(new Set());
            }}
            className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
              isMultiSelect 
                ? 'bg-orange-50 text-orange-600 border-orange-200' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {isMultiSelect ? <X size={18}/> : <CheckSquare size={18}/>}
            {isMultiSelect ? 'Exit Bulk' : 'Multi-Select'}
          </button>

          <div className="hidden lg:flex items-center bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            {(['All', 'Open', 'Stock Low', 'Maintenance'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === status 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Integrated Search & Controls */}
      {isMapView && (
        <div className="mb-8 space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearchAddress} className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search address or landmark (e.g. Session Road, SM Baguio)..."
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-colors">
                        Locate
                    </button>
                </form>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-gray-200 shadow-sm">
                   <div className="flex items-center gap-2 px-4 border-r border-gray-100">
                      <div 
                         onClick={() => setFollowMap(!followMap)}
                         className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors relative ${followMap ? 'bg-orange-500' : 'bg-gray-200'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${followMap ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-500 whitespace-nowrap">Filter by Area</span>
                   </div>
                   <button 
                      onClick={() => mapInstanceRef.current?.setView(defaultCenter, 13)}
                      className="p-3 hover:bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                      title="Recenter Map"
                   >
                      <LocateFixed size={20} />
                   </button>
                </div>
            </div>

            <div className="relative h-[450px] w-full bg-white p-2 rounded-[3rem] border border-gray-100 shadow-inner overflow-hidden group">
                <div id="store-map" className="w-full h-full z-10"></div>
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                   <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                         {filteredStores.length} Stores in View
                      </span>
                   </div>
                </div>
            </div>
        </div>
      )}

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredStores.map((store) => {
          const isSelected = selectedStoreIds.has(store.id);
          const isClosed = store.status === 'Closed' || store.status === 'Maintenance';

          return (
            <div 
              key={store.id} 
              className={`rounded-[2.5rem] p-6 border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col cursor-pointer ${
                isClosed ? 'bg-gray-50' : 'bg-white'
              } ${
                isSelected 
                  ? 'ring-4 ring-orange-500 border-orange-500 transform scale-[1.02]' 
                  : 'border-gray-100 hover:border-orange-100'
              }`}
              onClick={() => {
                if (isMultiSelect) toggleSelection(store.id);
                else onStoreSelect?.(store.id);
              }}
            >
              {/* Image & Type Header */}
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                 <img 
                    src={store.image} 
                    alt={store.name} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isClosed ? 'grayscale opacity-60' : ''}`} 
                 />
                 <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[9px] font-black uppercase text-gray-900 px-3 py-1.5 rounded-xl border border-white shadow-lg">
                       {store.type}
                    </span>
                 </div>
                 {isSelected && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]">
                       <CheckCircle2 size={48} className="text-white drop-shadow-xl" />
                    </div>
                 )}
              </div>

              {/* Basic Info */}
              <div className="mb-4">
                <h3 className={`text-xl font-black tracking-tight truncate mb-1 ${isClosed ? 'text-gray-400' : 'text-gray-900 group-hover:text-orange-600 transition-colors'}`}>
                  {store.name}
                </h3>
                <div className="flex items-center text-[11px] text-gray-400 font-bold tracking-tight italic">
                   <MapPin size={12} className="mr-1 text-orange-500" />
                   <span className="truncate">{store.address}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between mb-6">
                 <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center shadow-sm ${getStatusStyle(store.status)}`}>
                    {store.status}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</span>
                    <span className={`text-xs font-black ${store.inventoryLevel < 30 ? 'text-red-500' : 'text-emerald-500'}`}>
                       {store.inventoryLevel}% <span className="font-bold text-[9px] text-gray-300">Stock</span>
                    </span>
                  </div>
              </div>

              {/* Progress visual */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner">
                <div 
                   className={`h-full transition-all duration-1000 ${
                     store.inventoryLevel < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : store.inventoryLevel < 60 ? 'bg-orange-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                   }`} 
                   style={{ width: `${store.inventoryLevel}%` }}
                ></div>
              </div>

              {/* Metrics Grid */}
              <div className={`grid grid-cols-2 gap-4 mb-6 ${isClosed ? 'opacity-40' : ''}`}>
                 <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 group-hover:bg-white transition-colors">
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center"><BarChart3 size={10} className="mr-1"/> Net Rev</div>
                    <div className="font-black text-gray-900 text-base">₱{store.todayRevenue.toLocaleString()}</div>
                 </div>
                 <div className="bg-orange-50/30 rounded-2xl p-4 border border-orange-100/30 group-hover:bg-orange-50 transition-colors">
                    <div className="text-[9px] text-orange-600 font-black uppercase tracking-widest mb-1 flex items-center"><Package size={10} className="mr-1"/> SKU Units</div>
                    <div className="font-black text-orange-900 text-base">{store.inventoryCount}</div>
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-[10px] text-gray-300 font-black uppercase tracking-widest">
                   <Info size={14} className="mr-1.5"/> Store Registry 
                </div>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onStoreSelect?.(store.id);
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                    isClosed ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-orange-600 shadow-lg shadow-gray-200'
                  }`}
                >
                  Manage Store
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Multi-Select Tick */}
              {isMultiSelect && (
                <div className="absolute top-4 right-4 z-20">
                   <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 shadow-xl shadow-orange-200 scale-110' : 'bg-white/80 backdrop-blur-md border-gray-300'}`}>
                      {isSelected && <CheckSquare size={20} className="text-white" />}
                   </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredStores.length === 0 && (
           <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-24 h-24 bg-gray-50 text-gray-200 p-6 rounded-[2.5rem] mb-6 shadow-inner">
                  <Navigation size={48} className="animate-bounce" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 tracking-tight">No active stores in this region</h4>
              <p className="text-gray-400 font-medium mt-2 max-w-xs">Move the map or disable the 'Area Filter' to see all distribution stores.</p>
              <button 
                 onClick={() => { setFollowMap(false); setFilter('All'); }}
                 className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-gray-200"
              >
                 Reset Network Filters
              </button>
           </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedStoreIds.size > 0 && (
         <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-4 animate-[slideUp_0.4s_ease-out]">
            <div className="bg-gray-900 border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[3rem] px-10 py-6 flex items-center gap-10 max-w-3xl w-full mx-auto text-white">
               <div className="flex items-center gap-5 border-r border-gray-800 pr-10">
                  <div className="bg-orange-500 p-4 rounded-2xl shadow-xl shadow-orange-500/20">
                     <Package size={28} />
                  </div>
                  <div>
                     <p className="font-black text-2xl tracking-tighter">{selectedStoreIds.size} Stores</p>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Retail Command</p>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-4">
                  <button className="flex-1 py-4 bg-white text-gray-900 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                    Direct Restock
                  </button>
                  <button className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Sever Sync
                  </button>
               </div>
               <button 
                  onClick={() => { setIsMultiSelect(false); setSelectedStoreIds(new Set()); }}
                  className="p-3 text-gray-600 hover:text-white transition-colors bg-white/5 rounded-full"
               >
                  <X size={24} />
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .leaflet-container {
          filter: grayscale(1) invert(1) contrast(1.1) brightness(0.95);
          border-radius: 2.5rem;
        }
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 1.5rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default StoreManagement;
