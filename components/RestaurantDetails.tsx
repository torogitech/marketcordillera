
import React, { useState, useRef, useEffect } from 'react';
import { Restaurant, RestaurantStatus, Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { 
  ArrowLeft, Save, Ban, Edit3, MapPin, Users, Store, Camera, 
  Activity, DollarSign, CheckCircle2, AlertTriangle, User, Mail, 
  Phone, Calendar, Star, Utensils, Search, Plus, Flame, Info, 
  Clock, ExternalLink, Settings, Trash2, LayoutGrid, List, X,
  Type as TypeIcon, Hash, Tag, Upload, ChevronDown, Loader2,
  ShieldCheck, FileText, HeartPulse, Building2, Gavel
} from 'lucide-react';

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onBack: () => void;
  onUpdate: (updatedRestaurant: Restaurant) => void;
}

interface LocationItem {
  code: string;
  name: string;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isManagingMenu, setIsManagingMenu] = useState(false);
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  
  // Location States
  const [regions, setRegions] = useState<LocationItem[]>([]);
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [barangays, setBarangays] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false
  });

  // Menu Section State
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Regions on mount if editing
  useEffect(() => {
    if (isEditing) {
      fetchRegions();
    }
  }, [isEditing]);

  const fetchRegions = async () => {
    setLoadingLocations(prev => ({ ...prev, regions: true }));
    try {
      const res = await fetch('https://psgc.gitlab.io/api/regions/');
      const data = await res.json();
      setRegions(data.map((item: any) => ({ code: item.code, name: item.name })));
    } catch (err) {
      console.error("Failed to fetch regions", err);
    } finally {
      setLoadingLocations(prev => ({ ...prev, regions: false }));
    }
  };

  const fetchProvinces = async (regionCode: string) => {
    if (!regionCode) return;
    setLoadingLocations(prev => ({ ...prev, provinces: true }));
    try {
      // Some regions (like NCR) don't have provinces but have districts
      let res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`);
      let data = await res.json();
      
      if (data.length === 0) {
        // Try districts for NCR
        res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/districts/`);
        data = await res.json();
      }

      setProvinces(data.map((item: any) => ({ code: item.code, name: item.name })));
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    } finally {
      setLoadingLocations(prev => ({ ...prev, provinces: false }));
    }
  };

  const fetchCities = async (parentCode: string, isDistrict: boolean = false) => {
    if (!parentCode) return;
    setLoadingLocations(prev => ({ ...prev, cities: true }));
    try {
      const endpoint = isDistrict ? 'districts' : 'provinces';
      const res = await fetch(`https://psgc.gitlab.io/api/${endpoint}/${parentCode}/cities-municipalities/`);
      const data = await res.json();
      setCities(data.map((item: any) => ({ code: item.code, name: item.name })));
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setLoadingLocations(prev => ({ ...prev, cities: false }));
    }
  };

  const fetchBarangays = async (cityCode: string) => {
    if (!cityCode) return;
    setLoadingLocations(prev => ({ ...prev, barangays: true }));
    try {
      const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`);
      const data = await res.json();
      setBarangays(data.map((item: any) => ({ code: item.code, name: item.name })));
    } catch (err) {
      console.error("Failed to fetch barangays", err);
    } finally {
      setLoadingLocations(prev => ({ ...prev, barangays: false }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const selectedText = e.target.options[e.target.selectedIndex].text;
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedText
    }));

    // Cascade updates
    if (name === 'region') {
      const regionCode = value;
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      fetchProvinces(regionCode);
    } else if (name === 'province') {
      const provinceCode = value;
      setCities([]);
      setBarangays([]);
      // Check if it's a district or province for NCR handling
      const isDistrict = provinces.find(p => p.code === provinceCode)?.name.includes('District');
      fetchCities(provinceCode, isDistrict);
    } else if (name === 'city') {
      const cityCode = value;
      setBarangays([]);
      fetchBarangays(cityCode);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'activeOrders' || name === 'todayRevenue' || name === 'rating' || name === 'establishedYear'
        ? Number(value) 
        : value
    }));
  };

  const handleSave = () => {
    // Construct full address string
    const parts = [formData.barangay, formData.city, formData.province, formData.region].filter(Boolean);
    const fullAddress = parts.length > 0 ? parts.join(', ') : formData.address;
    
    const finalData = { ...formData, address: fullAddress };
    onUpdate(finalData);
    setIsEditing(false);
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate this restaurant? Status will be set to Closed.')) {
      const updated = { ...formData, status: 'Closed' as RestaurantStatus, activeOrders: 0 };
      setFormData(updated);
      onUpdate(updated);
    }
  };

  const handleActivate = () => {
    const updated = { ...formData, status: 'Open' as RestaurantStatus };
    setFormData(updated);
    onUpdate(updated);
  };

  // Product Modal Handlers
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        name: '',
        price: 0,
        category: 'burger',
        image: 'https://picsum.photos/seed/newitem/300/300',
        calories: 0,
        ingredients: []
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSave = () => {
    alert(`Saved ${editingProduct?.name}. In a production environment, this would persist the change.`);
    setIsProductModalOpen(false);
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev!,
      [name]: name === 'price' || name === 'calories' ? Number(value) : value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: RestaurantStatus) => {
    switch (status) {
      case 'Open': return 'text-green-600 bg-green-50 border-green-200';
      case 'Busy': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Maintenance': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter products for the menu section
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatTime = (time: string) => {
    if (!time) return '--:--';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 bg-white transition-all hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Restaurant Details</h1>
            <p className="text-xs text-gray-500">Overview and configuration</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditing && (
            <button 
              onClick={() => {
                setIsManagingMenu(true);
                const element = document.getElementById('menu-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 font-medium hover:bg-orange-100 transition-all text-sm"
            >
              <Settings size={18} />
              <span>Manage Menu</span>
            </button>
          )}

          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 bg-white transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all text-sm"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              {formData.status !== 'Closed' ? (
                <button 
                  onClick={handleDeactivate}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 bg-white transition-all text-sm"
                >
                  <Ban size={18} />
                  <span>Deactivate</span>
                </button>
              ) : (
                <button 
                  onClick={handleActivate}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-green-200 text-green-600 font-medium hover:bg-green-50 bg-white transition-all text-sm"
                >
                  <CheckCircle2 size={18} />
                  <span>Activate</span>
                </button>
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all text-sm"
              >
                <Edit3 size={18} />
                <span>Edit Details</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative group mb-6">
              <img 
                src={formData.image} 
                alt={formData.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <Camera size={24} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Current Status</label>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-bold text-sm ${getStatusColor(formData.status)}`}>
                  {isEditing ? (
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="Busy">Busy</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <span className="flex items-center">
                        {formData.status === 'Maintenance' && <AlertTriangle size={16} className="mr-2" />}
                        {formData.status === 'Closed' && <Ban size={16} className="mr-2" />}
                        {formData.status === 'Open' && <CheckCircle2 size={16} className="mr-2" />}
                        {formData.status === 'Busy' && <Activity size={16} className="mr-2" />}
                        {formData.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block flex items-center">
                   <Clock size={12} className="mr-1" />
                   Operating Hours
                </label>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                     <input 
                        type="time" 
                        name="openingTime"
                        value={formData.openingTime || '09:00'}
                        onChange={handleInputChange}
                        className="bg-white border border-blue-200 text-sm rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                     />
                     <span className="text-gray-400">-</span>
                     <input 
                        type="time" 
                        name="closingTime"
                        value={formData.closingTime || '22:00'}
                        onChange={handleInputChange}
                        className="bg-white border border-blue-200 text-sm rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                     />
                  </div>
                ) : (
                  <div className="text-sm font-bold text-gray-800">
                    {formatTime(formData.openingTime)} - {formatTime(formData.closingTime)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                 <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Capacity</span>
                    <div className="flex items-center text-gray-800 font-bold text-lg">
                      <Users size={18} className="text-gray-400 mr-2" />
                      {formData.capacity}
                    </div>
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Revenue</span>
                    <div className="flex items-center text-orange-600 font-bold text-lg">
                      <DollarSign size={18} className="text-orange-400 mr-1" />
                      {formData.todayRevenue.toLocaleString()}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Business Permits & Compliance Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center uppercase tracking-widest">
                <ShieldCheck size={18} className="mr-2 text-emerald-500" />
                Permits & Compliance
             </h3>
             <div className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Business Permit No.</label>
                   {isEditing ? (
                      <div className="relative">
                         <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                         <input 
                            type="text" 
                            name="permitNumber"
                            value={formData.permitNumber || ''}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            placeholder="BP-2024-XXXXX"
                         />
                      </div>
                   ) : (
                      <p className="text-xs font-black text-gray-800">{formData.permitNumber || 'Not provided'}</p>
                   )}
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tax Identification (TIN)</label>
                   {isEditing ? (
                      <div className="relative">
                         <Gavel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                         <input 
                            type="text" 
                            name="tinNumber"
                            value={formData.tinNumber || ''}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            placeholder="000-000-000-000"
                         />
                      </div>
                   ) : (
                      <p className="text-xs font-black text-gray-800">{formData.tinNumber || 'Not provided'}</p>
                   )}
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Sanitary Permit</label>
                   {isEditing ? (
                      <select 
                        name="sanitaryPermitStatus"
                        value={formData.sanitaryPermitStatus || 'Pending'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none cursor-pointer"
                      >
                         <option value="Valid">Valid / Approved</option>
                         <option value="Expired">Expired</option>
                         <option value="Pending">Pending Inspection</option>
                      </select>
                   ) : (
                      <div className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        formData.sanitaryPermitStatus === 'Valid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        formData.sanitaryPermitStatus === 'Expired' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                         {formData.sanitaryPermitStatus === 'Valid' ? <CheckCircle2 size={12} className="mr-1"/> : <AlertTriangle size={12} className="mr-1"/>}
                         {formData.sanitaryPermitStatus || 'Pending'}
                      </div>
                   )}
                </div>

                <div className="grid grid-cols-1 gap-5 pt-2">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Fire Safety Certificate</label>
                      {isEditing ? (
                         <input 
                            type="text" 
                            name="fireSafetyPermit"
                            value={formData.fireSafetyPermit || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white outline-none"
                            placeholder="FS-2024-XXXX"
                         />
                      ) : (
                         <div className="flex items-center gap-2 text-xs font-black text-gray-700">
                            <Flame size={14} className="text-orange-500" />
                            {formData.fireSafetyPermit || 'None'}
                         </div>
                      )}
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Permit Expiry Date</label>
                      {isEditing ? (
                         <input 
                            type="date" 
                            name="permitExpiry"
                            value={formData.permitExpiry || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white outline-none"
                         />
                      ) : (
                         <div className="flex items-center gap-2 text-xs font-black text-gray-700">
                            <Calendar size={14} className="text-blue-500" />
                            {formData.permitExpiry || 'Not set'}
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Store size={20} className="mr-2 text-orange-500" />
              General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                />
              </div>

              {/* Enhanced Address Section */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location Tracking</label>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {/* Region */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Region</label>
                      <div className="relative">
                        <select 
                          name="region"
                          onChange={handleLocationChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-medium outline-none transition-all"
                        >
                          <option value="">{loadingLocations.regions ? 'Loading...' : 'Select Region'}</option>
                          {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        {loadingLocations.regions && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                      </div>
                    </div>

                    {/* Province */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Province / District</label>
                      <div className="relative">
                        <select 
                          name="province"
                          disabled={!provinces.length}
                          onChange={handleLocationChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-medium outline-none transition-all disabled:opacity-50"
                        >
                          <option value="">Select Province</option>
                          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        {loadingLocations.provinces && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">City / Municipality</label>
                      <div className="relative">
                        <select 
                          name="city"
                          disabled={!cities.length}
                          onChange={handleLocationChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-medium outline-none transition-all disabled:opacity-50"
                        >
                          <option value="">Select City</option>
                          {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        {loadingLocations.cities && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                      </div>
                    </div>

                    {/* Barangay */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Barangay</label>
                      <div className="relative">
                        <select 
                          name="barangay"
                          disabled={!barangays.length}
                          onChange={handleLocationChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-medium outline-none transition-all disabled:opacity-50"
                        >
                          <option value="">Select Barangay</option>
                          {barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        {loadingLocations.barangays && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" size={18} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      readOnly
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-800"
                    />
                  </div>
                )}
              </div>

               <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cuisine</label>
                <input
                  type="text"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <User size={20} className="mr-2 text-orange-500" />
              Owner Contact Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Legal Representative</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                   <input
                     type="text"
                     name="ownerName"
                     value={formData.ownerName}
                     onChange={handleInputChange}
                     disabled={!isEditing}
                     className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                   />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business Email</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                   <input
                     type="email"
                     name="ownerEmail"
                     value={formData.ownerEmail}
                     onChange={handleInputChange}
                     disabled={!isEditing}
                     className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                   />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                   <input
                     type="tel"
                     name="ownerPhone"
                     value={formData.ownerPhone}
                     onChange={handleInputChange}
                     disabled={!isEditing}
                     className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                   />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Established Year</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                   <input
                     type="number"
                     name="establishedYear"
                     value={formData.establishedYear}
                     onChange={handleInputChange}
                     disabled={!isEditing}
                     className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                   />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium disabled:opacity-70 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu-section" className="mt-12 pt-12 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Menu Items</h3>
                <p className="text-sm text-gray-500 mt-1">Products available at this location</p>
            </div>
            <div className="flex items-center space-x-2">
                {isManagingMenu ? (
                  <button 
                    onClick={() => setIsManagingMenu(false)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all text-sm"
                  >
                    <CheckCircle2 size={18} />
                    <span>Finish Managing</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsManagingMenu(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm shadow-sm"
                  >
                    <Settings size={18} />
                    <span>Manage Menu</span>
                  </button>
                )}
                <button 
                    onClick={() => openProductModal()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200 transition-all text-sm font-bold flex items-center"
                >
                    <Plus size={18} className="mr-2" /> Add Item
                </button>
            </div>
        </div>

        {/* Menu Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search menu items..." 
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-3.5 rounded-xl bg-gray-50 text-gray-400 border border-gray-100 hover:text-gray-600 transition-colors">
                        <LayoutGrid size={20} />
                    </button>
                    <button className="p-3.5 rounded-xl bg-white text-gray-400 border border-gray-100 hover:text-gray-600 transition-colors">
                        <List size={20} />
                    </button>
                 </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                        activeCategory === cat.id 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200' 
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
               <div 
                  key={product.id} 
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative ${isManagingMenu ? 'ring-2 ring-orange-100' : ''}`}
                >
                  {/* Management Overlay */}
                  {isManagingMenu && (
                    <div className="absolute top-3 right-3 z-10 flex gap-2 animate-[fadeIn_0.2s_ease-out]">
                        <button 
                          className="bg-white/90 backdrop-blur-md p-2 rounded-lg text-orange-600 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="bg-white/90 backdrop-blur-md p-2 rounded-lg text-red-600 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm(`Remove ${product.name} from this restaurant's menu?`)) {
                                alert('Removed');
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  )}

                  <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isManagingMenu ? 'opacity-80' : ''}`}
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/20 shadow-sm">
                       {product.category}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                         <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 flex-1" title={product.name}>{product.name}</h3>
                         <span className="font-bold text-orange-600 whitespace-nowrap text-sm">₱{product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 mb-4">
                        {product.calories && (
                            <div className="flex items-center text-orange-700 font-semibold">
                                <Flame size={12} className="mr-1 text-orange-500 fill-orange-500" />
                                {product.calories} kcal
                            </div>
                        )}
                         <div className="flex items-center text-gray-400 font-semibold">
                            <Info size={12} className="mr-1" />
                            Details
                        </div>
                    </div>

                    <div className="mt-auto border-t border-gray-50 pt-4">
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed italic">
                            {product.ingredients?.join(', ') || 'Standard recipe ingredients.'}
                        </p>
                    </div>
                  </div>
                </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 p-4 rounded-2xl mb-4">
                      <Search size={32} />
                  </div>
                  <h4 className="text-gray-900 font-bold">No menu items found</h4>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">Try adjusting your filters or search terms to find what you're looking for.</p>
              </div>
            )}
        </div>
      </div>

      {/* Product Management Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
            <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
               <div className="flex items-center gap-3">
                  <div className="bg-orange-500 p-2 rounded-xl text-white">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{editingProduct.id ? 'Edit Menu Item' : 'New Menu Item'}</h3>
                    <p className="text-xs text-gray-400">Update item details and availability</p>
                  </div>
               </div>
               <button 
                 onClick={() => setIsProductModalOpen(false)}
                 className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
               {/* Image Selector Preview */}
               <div className="flex flex-col items-center gap-4">
                  <div 
                    className="relative group w-32 h-32 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <img 
                      src={editingProduct.image} 
                      className="w-full h-full object-cover rounded-2xl border-4 border-gray-50 shadow-sm group-hover:opacity-80 transition-all"
                      alt="Product Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <Upload size={24} className="text-white mx-auto mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change Image</span>
                      </div>
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Click to upload a new image
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Product Name</label>
                    <div className="relative">
                      <TypeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="text" 
                        name="name"
                        value={editingProduct.name}
                        onChange={handleProductInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none"
                        placeholder="e.g. Classic Beef Burger"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Price (₱)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="number" 
                        name="price"
                        value={editingProduct.price}
                        onChange={handleProductInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <select 
                        name="category"
                        value={editingProduct.category}
                        onChange={handleProductInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none cursor-pointer appearance-none"
                      >
                         {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                         ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Calories</label>
                    <div className="relative">
                      <Flame className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="number" 
                        name="calories"
                        value={editingProduct.calories}
                        onChange={handleProductInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Brand/Origin</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="text" 
                        name="brand"
                        value={editingProduct.brand || ''}
                        onChange={handleProductInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none"
                        placeholder="e.g. Organic Farm"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Ingredients / Notes</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium outline-none resize-none"
                    placeholder="List key ingredients separated by commas..."
                    defaultValue={editingProduct.ingredients?.join(', ')}
                  ></textarea>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
               <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-all text-sm"
               >
                  Discard
               </button>
               <button 
                  onClick={handleProductSave}
                  className="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all text-sm shadow-lg shadow-orange-200 flex items-center space-x-2"
               >
                  <Save size={18}/>
                  <span>Save Product</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
