
import React, { useState, useEffect, useRef } from 'react';
import { STORES } from '../constants';
import { Store, StoreStatus, CartItem, StoreType } from '../types';
import { 
  QrCode, Users, Clock, Filter, X, Download, Share2, 
  ClipboardList, ChevronRight, Receipt, CheckSquare, 
  CheckCircle2, Settings, User, Mail, Phone, Save, 
  Edit3, LayoutGrid, Map as MapIcon, Crosshair,
  Package, ShoppingBag, BarChart3, AlertTriangle,
  Info, Search, MoreVertical, Store as StoreIcon
} from 'lucide-react';

interface StoreManagementProps {
  cart?: CartItem[];
  activeStoreId?: string;
  onStoreSelect?: (id: string) => void;
  onNavigateToMenu?: () => void;
  onOpenCart?: () => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ 
  cart = [], 
  activeStoreId, 
  onStoreSelect,
  onNavigateToMenu,
  onOpenCart
}) => {
  const [filter, setFilter] = useState<StoreStatus | 'All'>('All');
  const [isMapView, setIsMapView] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(new Set());
  const [mapFilteredStores, setMapFilteredStores] = useState<Store[]>(STORES);
  
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Baguio center
  const defaultCenter: [number, number] = [16.4023, 120.5960];

  useEffect(() => {
    if (isMapView && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const map = L.map('store-map').setView(defaultCenter, 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      map.on('moveend', () => handleMapFilter());
    }

    if (isMapView && mapInstanceRef.current) {
      updateMapMarkers();
    }
  }, [isMapView, filter]);

  const handleMapFilter = () => {
    if (!mapInstanceRef.current) return;
    const bounds = mapInstanceRef.current.getBounds();
    const visible = STORES.filter(s => {
      if (!s.lat || !s.lng) return false;
      const point = (window as any).L.latLng(s.lat, s.lng);
      const matchesStatus = filter === 'All' || s.status === filter;
      return bounds.contains(point) && matchesStatus;
    });
    setMapFilteredStores(visible);
  };

  const updateMapMarkers = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    STORES.forEach(s => {
      if (s.lat && s.lng && (filter === 'All' || s.status === filter)) {
        const marker = L.marker([s.lat, s.lng]).addTo(mapInstanceRef.current);
        const popup = `
          <div class="p-0">
            <img src="${s.image}" class="w-full h-24 object-cover" />
            <div class="p-3">
              <h4 class="font-bold text-gray-900">${s.name}</h4>
              <p class="text-[10px] font-black uppercase text-orange-500 mb-1">${s.type}</p>
              <div class="text-xs text-gray-500">${s.inventoryLevel}% Stocked</div>
            </div>
          </div>
        `;
        marker.bindPopup(popup);
        markersRef.current.push(marker);
      }
    });
  };

  const filteredStores = isMapView ? mapFilteredStores : STORES.filter(s => filter === 'All' || s.status === filter);

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
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Retail Hub <span className="text-orange-500">.</span></h1>
          <p className="text-sm text-gray-500 mt-1">Unified inventory and logistics management for retail partners.</p>
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
              setSelectedStoreIds(new Set());
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              isMultiSelect 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isMultiSelect ? <CheckCircle2 size={16}/> : <CheckSquare size={16}/>}
            {isMultiSelect ? 'Cancel' : 'Bulk Action'}
          </button>

          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm hidden md:flex">
            {(['All', 'Open', 'Stock Low', 'Maintenance', 'Closed'] as const).map((status) => (
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

      {/* Map View Integration */}
      {isMapView && (
        <div className="mb-8 relative h-[500px] w-full bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                    <StoreIcon size={18} className="text-orange-500" />
                    <span>Distribution Network: {mapFilteredStores.length} Retailers</span>
                </div>
                <button 
                   onClick={() => mapInstanceRef.current?.setView(defaultCenter, 13)}
                   className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                >
                    <Crosshair size={16} /> Recenter
                </button>
            </div>
            <div id="store-map" className="flex-1"></div>
        </div>
      )}

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStores.map((store) => {
          const isSelected = selectedStoreIds.has(store.id);
          const isStockLow = store.status === 'Stock Low';
          const isClosed = store.status === 'Closed' || store.status === 'Maintenance';

          return (
            <div 
              key={store.id} 
              className={`rounded-[2rem] p-5 border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col cursor-pointer ${
                isClosed ? 'bg-gray-50' : 'bg-white'
              } ${
                isSelected 
                  ? 'ring-4 ring-orange-500 border-orange-500 transform scale-[1.02]' 
                  : 'border-gray-100'
              }`}
              onClick={() => {
                if (isMultiSelect) toggleSelection(store.id);
                else {
                  onStoreSelect?.(store.id);
                  onNavigateToMenu?.();
                }
              }}
            >
              {/* Header: Image & Basic Info */}
              <div className="flex gap-4 mb-4">
                 <div className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 ${isClosed ? 'opacity-50 grayscale' : ''}`}>
                    <img 
                      src={store.image} 
                      alt={store.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider mb-1">{store.type}</p>
                       {!isMultiSelect && <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>}
                    </div>
                    <h3 className={`text-lg font-bold truncate ${isClosed ? 'text-gray-400' : 'text-gray-800'}`}>
                      {store.name}
                    </h3>
                    <div className="flex items-center text-[11px] text-gray-400 font-medium mt-0.5 truncate">
                        <Package size={12} className="mr-1" />
                        {store.inventoryCount} SKU Items
                    </div>
                 </div>
              </div>

              {/* Status & Inventory Health */}
              <div className="flex items-center justify-between mb-4">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center ${getStatusStyle(store.status)}`}>
                    {store.status === 'Stock Low' && <AlertTriangle size={12} className="mr-1" />}
                    {store.status}
                  </span>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Lvl: <span className={store.inventoryLevel < 30 ? 'text-red-500' : 'text-green-500'}>{store.inventoryLevel}%</span>
                  </div>
              </div>

              {/* Visual Inventory Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4 shadow-inner">
                <div 
                   className={`h-full transition-all duration-1000 ${
                     store.inventoryLevel < 30 ? 'bg-red-500' : store.inventoryLevel < 60 ? 'bg-orange-500' : 'bg-green-500'
                   }`} 
                   style={{ width: `${store.inventoryLevel}%` }}
                ></div>
              </div>

              {/* Revenue & Logistics Stats */}
              <div className={`grid grid-cols-2 gap-3 mb-4 ${isClosed ? 'opacity-40' : ''}`}>
                 <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100/50">
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center"><BarChart3 size={10} className="mr-1"/> Revenue</div>
                    <div className="font-bold text-gray-900 text-sm">₱{store.todayRevenue.toLocaleString()}</div>
                 </div>
                 <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100/50">
                    <div className="text-[9px] text-orange-600 font-black uppercase tracking-widest mb-1 flex items-center"><Clock size={10} className="mr-1"/> Last Restock</div>
                    <div className="font-bold text-orange-800 text-[10px]">{store.lastRestocked}</div>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-[10px] text-gray-400 italic">
                   <Info size={12} className="mr-1"/> Details
                </div>
                <button 
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                    isClosed ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-orange-600'
                  }`}
                >
                  Manage
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Selection Checkbox Overlay */}
              {isMultiSelect && (
                <div className="absolute top-4 right-4 z-10">
                   <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-200' : 'bg-white/80 backdrop-blur-sm border-gray-300'}`}>
                      {isSelected && <CheckSquare size={18} className="text-white" />}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bulk Action Bar */}
      {selectedStoreIds.size > 0 && (
         <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-[2rem] px-8 py-5 flex items-center gap-8 max-w-2xl w-full mx-auto text-white">
               <div className="flex items-center gap-4 border-r border-gray-700 pr-8">
                  <div className="bg-orange-500 p-3 rounded-2xl">
                     <Package size={24} />
                  </div>
                  <div>
                     <p className="font-black text-lg">{selectedStoreIds.size} Selected</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retail Operations</p>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-4">
                  <button className="flex-1 py-3.5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                    Initiate Restock
                  </button>
                  <button className="flex-1 py-3.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Emergency Close
                  </button>
               </div>
               <button 
                  onClick={() => { setIsMultiSelect(false); setSelectedStoreIds(new Set()); }}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
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
        .leaflet-container {
          filter: grayscale(1) invert(1) contrast(1.1) brightness(0.9);
          border: 1px solid #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default StoreManagement;
