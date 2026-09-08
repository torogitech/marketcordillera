
import React, { useState, useEffect } from 'react';
import { Store, StoreStatus, StoreType } from '../types';
import { 
  ArrowLeft, Save, Ban, Edit3, MapPin, Package, Store as StoreIcon, 
  Camera, BarChart3, PhilippinePeso, CheckCircle2, AlertTriangle, 
  User, Mail, Phone, Clock, Search, LayoutGrid, Info, ChevronDown,
  RefreshCw, TrendingUp, ShieldCheck
} from 'lucide-react';

interface StoreDetailsProps {
  store: Store;
  onBack: () => void;
  onUpdate: (updatedStore: Store) => void;
  onManageInventory: () => void;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ store, onBack, onUpdate, onManageInventory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Store>(store);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'inventoryCount' || name === 'inventoryLevel' || name === 'todayRevenue'
        ? Number(value) 
        : value
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const getStatusColor = (status: StoreStatus) => {
    switch (status) {
      case 'Open': return 'text-green-600 bg-green-50 border-green-200';
      case 'Stock Low': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Maintenance': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 bg-white transition-all hover:bg-gray-50 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Manage Retail Store</h1>
            <p className="text-xs text-gray-500">Retail Distribution & Inventory Tracking</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditing && (
            <button 
              onClick={onManageInventory}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition-all text-sm shadow-lg shadow-gray-200"
            >
              <LayoutGrid size={18} />
              <span>Inventory Management</span>
            </button>
          )}

          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 bg-white transition-all text-sm">Cancel</button>
              <button onClick={handleSave} className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all text-sm">
                <Save size={18} />
                <span>Save Registry</span>
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-all text-sm">
              <Edit3 size={18} />
              <span>Edit Store Info</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Stats Column */}
        <div className="space-y-6">
          {/* Card: Brand & Status */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden relative group mb-6">
              <img src={formData.image} alt={formData.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white"><Camera size={24} /></div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Operational Status</label>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-black text-[11px] uppercase tracking-wider ${getStatusColor(formData.status)}`}>
                  {isEditing ? (
                    <select name="status" value={formData.status} onChange={handleInputChange} className="bg-transparent border-none focus:ring-0 cursor-pointer">
                      <option value="Open">Open</option> 
                      <option value="Stock Low">Stock Low</option> 
                      <option value="Maintenance">Maintenance</option> 
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <span className="flex items-center">
                        {formData.status === 'Stock Low' && <AlertTriangle size={14} className="mr-2" />}
                        {formData.status === 'Closed' && <Ban size={14} className="mr-2" />}
                        {formData.status === 'Open' && <CheckCircle2 size={14} className="mr-2" />}
                        {formData.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                   <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center">
                     <TrendingUp size={12} className="mr-1" /> Inventory Health
                   </div>
                   <span className={`text-sm font-black ${formData.inventoryLevel < 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {formData.inventoryLevel}%
                   </span>
                </div>
                <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden mb-2">
                   <div 
                      className={`h-full transition-all duration-1000 rounded-full ${formData.inventoryLevel < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}
                      style={{ width: `${formData.inventoryLevel}%` }}
                   ></div>
                </div>
                <p className="text-[9px] text-orange-400 font-bold uppercase tracking-tight text-center">Auto-refill threshold: 25%</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">SKU Count</span>
                    <div className="flex items-center text-gray-800 font-black text-lg tracking-tight">
                      <Package size={18} className="text-gray-300 mr-2" />
                      {formData.inventoryCount.toLocaleString()}
                    </div>
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Net Revenue</span>
                    <div className="flex items-center text-gray-900 font-black text-lg tracking-tight">
                      <PhilippinePeso size={16} className="text-orange-500 mr-1" />
                      {formData.todayRevenue.toLocaleString()}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card: Logs & Integrity */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-xs font-black text-gray-900 mb-6 flex items-center uppercase tracking-[0.2em]">
                <ShieldCheck size={16} className="mr-2 text-emerald-500" />
                Network Integrity
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400">
                         <Clock size={16} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Restock</span>
                   </div>
                   <span className="text-xs font-black text-gray-700">{formData.lastRestocked || 'Pending'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400">
                         <RefreshCw size={16} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sync Status</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-widest italic">
              <StoreIcon size={24} className="text-orange-500" />
              General Store Registry
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block px-1">Legal Business Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all font-black text-gray-800 text-lg disabled:opacity-70"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block px-1">Physical Location Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-gray-800 disabled:opacity-70"
                  />
                </div>
              </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block px-1">Retail Category</label>
                 <div className="relative">
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none font-bold text-gray-800 appearance-none disabled:opacity-70 cursor-pointer"
                    >
                      <option value="Grocery">Grocery / Supermarket</option>
                      <option value="Pharmacy">Medical / Pharmacy</option>
                      <option value="Electronics">Computing & Tech</option>
                      <option value="Boutique">Apparel & Boutique</option>
                      <option value="General">General Supply</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block px-1">Store Reference ID</label>
                <div className="relative">
                   <Info className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                   <input 
                     type="text" 
                     value={formData.id} 
                     readOnly 
                     className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-100 font-mono text-xs font-black text-gray-400 uppercase tracking-widest cursor-not-allowed"
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Owner Details Registry */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-widest italic">
              <User size={24} className="text-orange-500" />
              Entity Ownership Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Legal Representative</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    name="ownerName" 
                    value={formData.ownerName} 
                    onChange={handleInputChange} 
                    disabled={!isEditing} 
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-gray-800 disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    name="ownerEmail" 
                    value={formData.ownerEmail} 
                    onChange={handleInputChange} 
                    disabled={!isEditing} 
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-gray-800 disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Secure Contact Terminal</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    name="ownerPhone" 
                    value={formData.ownerPhone} 
                    onChange={handleInputChange} 
                    disabled={!isEditing} 
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-gray-800 disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Broadcast Authorization</label>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                   <ShieldCheck size={20} className="text-emerald-500" />
                   <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Encrypted Distribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StoreDetails;
