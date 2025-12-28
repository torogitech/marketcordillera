

import React, { useState } from 'react';
import { STORES, RECENT_ORDERS } from '../constants';
import { Store, StoreStatus, CartItem } from '../types';
import { QrCode, Users, Clock, Filter, X, Download, Share2, ClipboardList, ChevronRight, Receipt, CheckSquare, CheckCircle2, Settings, User, Mail, Phone, Save, Edit3 } from 'lucide-react';

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
  const [selectedQrStore, setSelectedQrStore] = useState<Store | null>(null);
  const [selectedDetailStore, setSelectedDetailStore] = useState<Store | null>(null);
  const [manageStore, setManageStore] = useState<Store | null>(null);
  
  // State for editing in Manage Modal
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [manageFormData, setManageFormData] = useState<Store | null>(null);

  // Multi-selection state
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState<Set<string>>(new Set());

  const filteredStores = STORES.filter(store => filter === 'All' || store.status === filter);

  const getStatusColor = (status: StoreStatus) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Occupied': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Reserved': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: StoreStatus) => {
      switch (status) {
        case 'Available': return <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>;
        case 'Occupied': return <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>;
        case 'Reserved': return <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>;
      }
  };

  // Helper to get display data for a store
  const getStoreOrderData = (storeId: string) => {
    // 1. If this store is the active one in the app, display the current Cart
    if (activeStoreId === storeId && cart.length > 0) {
       const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
       return {
         itemCount: cart.length,
         items: cart.map(c => ({ name: c.name, qty: c.quantity, price: c.price })),
         total: total,
         status: 'Active'
       };
    }

    // 2. Otherwise, check mock data for "Occupied" stores
    const storeObj = STORES.find(s => s.id === storeId);
    if (!storeObj) return null;

    const mockOrder = RECENT_ORDERS.find(o => o.store === storeObj.name);
    
    if (mockOrder) {
      return {
        itemCount: mockOrder.items.length,
        items: mockOrder.items.map(name => ({ name, qty: 1, price: 0 })), // Mock price 0 if not detailed
        total: mockOrder.total,
        status: mockOrder.status
      };
    }

    return null;
  };

  // Helper to get detailed data for the modal
  const getDetailData = (storeId: string) => {
      const data = getStoreOrderData(storeId);
      if (!data) return null;
      return data;
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedStoreIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedStoreIds(newSet);
  };

  const handleBatchAction = (action: 'menu' | 'cart') => {
    // For now, we'll take the first selected store as the "primary" context
    const firstId = Array.from(selectedStoreIds)[0];
    if (firstId && onStoreSelect) {
      onStoreSelect(firstId);
      if (action === 'menu') {
        onNavigateToMenu?.();
      } else {
        onOpenCart?.();
      }
      // Reset selection after action
      setIsMultiSelect(false);
      setSelectedStoreIds(new Set());
    }
  };

  // Store Manage Functions
  const openManageModal = (store: Store) => {
    setManageStore(store);
    setManageFormData(store);
    setIsEditingStore(false);
  };

  const handleManageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (manageFormData) {
      setManageFormData({ ...manageFormData, [e.target.name]: e.target.value });
    }
  };

  const handleSaveStoreSettings = () => {
    // In a real app, update the store via API or global state
    console.log("Saving store settings:", manageFormData);
    if (manageFormData) {
        setManageStore(manageFormData);
    }
    setIsEditingStore(false);
    // Here you would also call a prop function to update the parent state if needed
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage retail stores and generate QR codes.</p>
        </div>
        
        <div className="flex items-center gap-3">
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
            {isMultiSelect ? 'Cancel Selection' : 'Select Multiple'}
          </button>

          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm hidden md:flex">
            {(['All', 'Available', 'Occupied', 'Reserved'] as const).map((status) => (
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
         {(['All', 'Available', 'Occupied', 'Reserved'] as const).map((status) => (
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
        {filteredStores.map((store) => {
          const orderData = getStoreOrderData(store.id);
          const isActive = activeStoreId === store.id;
          const isSelected = selectedStoreIds.has(store.id);

          return (
            <div 
              key={store.id} 
              className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col cursor-pointer ${
                isSelected 
                  ? 'ring-4 ring-orange-500 border-orange-500 transform scale-[1.02]' 
                  : isActive 
                    ? 'ring-2 ring-orange-400 border-orange-400' 
                    : 'border-gray-100'
              }`}
              style={{ backgroundColor: store.status === 'Occupied' ? '#fff7ed' : store.status === 'Reserved' ? '#eff6ff' : store.status === 'Available' ? '#f0fdf4' : 'white' }}
              onClick={() => {
                onStoreSelect?.(store.id);
                if (isMultiSelect) {
                  toggleSelection(store.id);
                } else {
                   // If occupied or has items, open details modal. Otherwise, go to menu.
                   if (store.status === 'Occupied' || (orderData && orderData.itemCount > 0)) {
                      setSelectedDetailStore(store);
                   } else {
                      onNavigateToMenu?.();
                   }
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

              {/* Manage/Settings Button - New */}
              {!isMultiSelect && (
                 <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       openManageModal(store);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 p-1.5 hover:bg-white rounded-lg transition-all"
                 >
                    <Settings size={18} />
                 </button>
              )}

              <div className="flex justify-between items-start mb-4 pl-3 pr-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Users size={14} className="mr-1" />
                    <span>{store.seats} Capacity</span>
                  </div>
                </div>
                {!isMultiSelect && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(store.status)} bg-white/50 backdrop-blur-sm`}>
                    {getStatusBadge(store.status)}
                    {store.status}
                  </span>
                )}
              </div>

              {/* Order Content */}
              <div className="pl-3 mb-4 flex-1">
                 {orderData ? (
                   <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 hover:bg-white/80 transition-colors shadow-sm">
                     <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><ClipboardList size={12}/> {orderData.itemCount} Items</span>
                        <span className="text-orange-600 font-bold">₱{orderData.total.toFixed(2)}</span>
                     </div>
                     <div className="space-y-1">
                        {orderData.items.slice(0, 2).map((item, i) => (
                           <div key={i} className="text-xs text-gray-700 truncate">• {item.name} <span className="text-gray-400">x{item.qty}</span></div>
                        ))}
                        {orderData.items.length > 2 && (
                          <div className="text-[10px] text-gray-400 italic">+{orderData.items.length - 2} more...</div>
                        )}
                     </div>
                   </div>
                 ) : (
                    <div className="h-full flex flex-col justify-center space-y-3">
                      <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Active:</span>
                          <span className="font-medium text-gray-700 flex items-center">
                              <Clock size={14} className="mr-1 text-gray-400" />
                              {store.lastActive}
                          </span>
                      </div>
                      {store.currentOrderId && (
                          <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Order ID:</span>
                              <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{store.currentOrderId}</span>
                          </div>
                      )}
                    </div>
                 )}
              </div>

              <div className="pl-3 mt-auto pt-4 border-t border-gray-100/50">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQrStore(store);
                  }}
                  disabled={isMultiSelect}
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-medium transition-colors border border-gray-200 group-hover:border-gray-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <QrCode size={18} />
                  <span>Generate QR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar for Multi-Select */}
      {selectedStoreIds.size > 0 && (
         <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 max-w-2xl w-full mx-auto">
               <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                     <CheckSquare size={20} />
                  </div>
                  <div>
                     <p className="font-bold text-gray-900">{selectedStoreIds.size} Selected</p>
                     <p className="text-xs text-gray-500">Manage multiple stores</p>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-3">
                  <button 
                    onClick={() => handleBatchAction('menu')}
                    className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    <ClipboardList size={18} />
                    <span>Add Items</span>
                  </button>
                  <button 
                    onClick={() => handleBatchAction('cart')}
                    className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                  >
                    <Receipt size={18} />
                    <span>Manage Order</span>
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Manage Store Modal */}
      {manageStore && manageFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 flex flex-col max-h-[85vh]">
            <div className="bg-gray-900 p-6 flex justify-between items-start text-white">
               <div>
                  <h2 className="text-xl font-bold">Store Settings</h2>
                  <p className="text-gray-400 text-sm mt-1">Manage details for {manageStore.name}</p>
               </div>
               <button 
                 onClick={() => setManageStore(null)}
                 className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-800 flex items-center">
                     <User size={20} className="mr-2 text-orange-500" />
                     Owner Information
                  </h3>
                  {!isEditingStore ? (
                    <button 
                       onClick={() => setIsEditingStore(true)}
                       className="text-orange-600 text-sm font-medium hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                    >
                       <Edit3 size={16} className="mr-1" /> Edit
                    </button>
                  ) : (
                    <button 
                       onClick={handleSaveStoreSettings}
                       className="bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 px-4 py-1.5 rounded-lg transition-colors flex items-center shadow-lg shadow-orange-200"
                    >
                       <Save size={16} className="mr-1" /> Save
                    </button>
                  )}
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="ownerName"
                        value={manageFormData.ownerName || ''}
                        onChange={handleManageInputChange}
                        disabled={!isEditingStore}
                        placeholder="e.g. John Doe"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="ownerEmail"
                        value={manageFormData.ownerEmail || ''}
                        onChange={handleManageInputChange}
                        disabled={!isEditingStore}
                        placeholder="owner@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="ownerPhone"
                        value={manageFormData.ownerPhone || ''}
                        onChange={handleManageInputChange}
                        disabled={!isEditingStore}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
               <div className="flex gap-3">
                 <button 
                   onClick={() => setManageStore(null)}
                   className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                 >
                   Close
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQrStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="bg-gray-900 p-6 flex justify-between items-start text-white">
              <div>
                  <h2 className="text-xl font-bold">QR Code</h2>
                  <p className="text-gray-400 text-sm mt-1">Scan to access menu for {selectedQrStore.name}</p>
              </div>
              <button 
                onClick={() => setSelectedQrStore(null)}
                className="text-gray-400 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center bg-white">
              <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-inner mb-6">
                  {/* Using a public QR code API for demonstration */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://restaurant.com/menu/${selectedQrStore.id}`} 
                    alt={`QR Code for ${selectedQrStore.name}`}
                    className="w-48 h-48 object-contain"
                  />
              </div>
              
              <div className="flex space-x-3 w-full">
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-orange-200">
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Details Modal (Orders) */}
      {selectedDetailStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[80vh]">
            <div className={`p-6 flex justify-between items-start text-white ${getStatusColor(selectedDetailStore.status).replace('text-green-700', 'bg-green-600').replace('text-orange-700', 'bg-orange-600').replace('text-blue-700', 'bg-blue-600').replace('bg-green-100', '').replace('bg-orange-100', '').replace('bg-blue-100', '')}`}>
              <div>
                  <h2 className="text-xl font-bold text-white">{selectedDetailStore.name} Details</h2>
                  <div className="flex items-center space-x-4 mt-2 text-white/90">
                    <div className="flex items-center text-xs">
                        <Users size={14} className="mr-1" />
                        <span>{selectedDetailStore.seats} Capacity</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selectedDetailStore.status}</span>
                  </div>
              </div>
              <button 
                onClick={() => setSelectedDetailStore(null)}
                className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-0 flex-1 overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                        <Receipt size={16} className="mr-2 text-gray-500"/>
                        Current Order Items
                    </h3>
                    
                    {getDetailData(selectedDetailStore.id) ? (
                        <div className="space-y-3">
                            {getDetailData(selectedDetailStore.id)?.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-start">
                                        <div className="bg-gray-100 text-gray-500 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3">
                                            {item.qty}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                        </div>
                                    </div>
                                    {item.price > 0 && (
                                        <span className="text-sm font-medium text-gray-600">₱{(item.price * item.qty).toFixed(2)}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No active orders found for this store.
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                        ₱{getDetailData(selectedDetailStore.id)?.total.toFixed(2) || '0.00'}
                    </span>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => {
                            setSelectedDetailStore(null);
                            onNavigateToMenu?.();
                        }}
                        className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                        Add Items
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedDetailStore(null);
                            onOpenCart?.();
                        }}
                        className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 text-sm flex items-center justify-center"
                    >
                        <span>Manage Order</span>
                        <ChevronRight size={16} className="ml-1" />
                    </button>
                </div>
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

export default StoreManagement;