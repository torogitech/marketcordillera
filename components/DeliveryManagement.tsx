
import React, { useState, useEffect } from 'react';
import { Rider, RiderStatus, VehicleType, RiderActivity } from '../types';
import { RIDERS } from '../constants';
import { 
  Search, Plus, Bike, Truck, Car, Star, Phone, Mail, 
  Filter, CheckCircle2, XCircle, Clock, Trash2, Edit, Edit3,
  X, UserPlus, Save, Activity, ArrowUpRight, ArrowDownRight,
  TrendingUp, Users, MapPin, Shield, Info, Timer, Award,
  Target, AlertTriangle, ShoppingBag, PhilippinePeso, History, ArrowRight,
  Wallet, TrendingDown, Briefcase, ThumbsUp, MessageCircle, Power, ShieldAlert,
  Ban, CreditCard, Banknote, CheckSquare, Zap, BadgeCheck, Globe, ChevronDown, Loader2
} from 'lucide-react';

interface LocationItem {
  code: string;
  name: string;
}

const AVAILABILITY_OPTIONS = [
  'Available for next 2 hours',
  'Unavailable until 5 PM',
  'On scheduled break',
  'End of Shift',
  'Lunch Break',
  'Medical Leave'
];

const DeliveryManagement: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>(RIDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RiderStatus | 'All'>('All');
  
  // Multi-selection states
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedRiderIds, setSelectedRiderIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [isCustomAvailability, setIsCustomAvailability] = useState(false);

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

  // Form State
  const [formData, setFormData] = useState<Partial<Rider>>({
    name: '',
    email: '',
    phone: '',
    status: 'Available',
    availabilityDetail: '',
    vehicle: 'Motorcycle',
    rating: 5.0,
    deliveries: 0,
    avgDeliveryTime: 25,
    successRate: 100,
    cancellationRate: 0,
    totalCommission: 0,
    recentActivity: [],
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    address: '',
    region: '',
    province: '',
    city: '',
    barangay: ''
  });

  // Fetch Regions when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchRegions();
    }
  }, [isModalOpen]);

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
      let res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`);
      let data = await res.json();
      if (data.length === 0) {
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
      const isDistrict = provinces.find(p => p.code === provinceCode)?.name.includes('District');
      fetchCities(provinceCode, isDistrict);
    } else if (name === 'city') {
      const cityCode = value;
      setBarangays([]);
      fetchBarangays(cityCode);
    }
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (rider?: Rider) => {
    if (rider) {
      setEditingRider(rider);
      setFormData(rider);
      setIsCustomAvailability(
        rider.availabilityDetail !== undefined && 
        rider.availabilityDetail !== '' && 
        !AVAILABILITY_OPTIONS.includes(rider.availabilityDetail)
      );
    } else {
      setEditingRider(null);
      setIsCustomAvailability(false);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        status: 'Available', 
        availabilityDetail: '', 
        vehicle: 'Motorcycle', 
        rating: 5.0, 
        deliveries: 0, 
        avgDeliveryTime: 25,
        successRate: 100,
        cancellationRate: 0,
        totalCommission: 0,
        recentActivity: [],
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        address: '',
        region: '',
        province: '',
        city: '',
        barangay: ''
      });
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
    setIsModalOpen(true);
  };

  const handleSaveRider = () => {
    const parts = [formData.barangay, formData.city, formData.province, formData.region].filter(Boolean);
    const fullAddress = parts.length > 0 ? parts.join(', ') : formData.address;
    const finalFormData = { ...formData, address: fullAddress };

    if (editingRider) {
      setRiders(riders.map(r => r.id === editingRider.id ? { ...r, ...finalFormData } as Rider : r));
    } else {
      const id = `ri${Date.now()}`;
      const newRider: Rider = {
        id,
        name: finalFormData.name || 'New Rider',
        email: finalFormData.email || '',
        phone: finalFormData.phone || '',
        status: finalFormData.status as RiderStatus,
        availabilityDetail: finalFormData.availabilityDetail,
        vehicle: finalFormData.vehicle as VehicleType,
        rating: finalFormData.rating || 5.0,
        deliveries: finalFormData.deliveries || 0,
        avgDeliveryTime: finalFormData.avgDeliveryTime || 25,
        successRate: finalFormData.successRate || 100,
        cancellationRate: finalFormData.cancellationRate || 0,
        totalCommission: finalFormData.totalCommission || 0,
        avatar: `https://picsum.photos/seed/${id}/150`,
        recentActivity: [],
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        address: fullAddress,
        region: finalFormData.region,
        province: finalFormData.province,
        city: finalFormData.city,
        barangay: finalFormData.barangay
      };
      setRiders([newRider, ...riders]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRider = (id: string) => {
    const rider = riders.find(r => r.id === id);
    if (rider && window.confirm(`Are you sure you want to delete rider ${rider.name}?`)) {
      setRiders(riders.filter(r => r.id !== id));
      const newSelected = new Set(selectedRiderIds);
      newSelected.delete(id);
      setSelectedRiderIds(newSelected);
    }
  };

  const handleToggleStatus = (id: string) => {
    const rider = riders.find(r => r.id === id);
    if (!rider) return;

    let nextStatus: RiderStatus;
    if (rider.status === 'Suspended' || formData.status === 'Suspended') {
      nextStatus = 'Offline';
      if (window.confirm(`Re-activate ${rider.name}'s account? Status will be set to Offline.`)) {
        const updatedRiders = riders.map(r => r.id === id ? { ...r, status: nextStatus } : r);
        setRiders(updatedRiders);
        setFormData(prev => ({ ...prev, status: nextStatus }));
      }
    } else {
      nextStatus = 'Suspended';
      if (window.confirm(`Are you sure you want to suspend/deactivate ${rider.name}? They will not be able to accept orders.`)) {
        const updatedRiders = riders.map(r => r.id === id ? { ...r, status: nextStatus } : r);
        setRiders(updatedRiders);
        setFormData(prev => ({ ...prev, status: nextStatus }));
      }
    }
  };

  const toggleRiderSelection = (id: string) => {
    const newSet = new Set(selectedRiderIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRiderIds(newSet);
  };

  const handleBatchPayout = () => {
    const selectedRiders = riders.filter(r => selectedRiderIds.has(r.id));
    // Fix: Explicitly type acc and r in reduce to resolve arithmetic operation errors.
    const totalPayout = selectedRiders.reduce((acc: number, r: Rider) => acc + (Number(r.totalCommission) || 0), 0);
    
    if (window.confirm(`Initiate payout for ${selectedRiderIds.size} riders?\nTotal Commission: ₱${totalPayout.toLocaleString()}\n\nNote: This will reset their pending commission balances to zero.`)) {
      setRiders(riders.map(r => 
        selectedRiderIds.has(r.id) ? { ...r, totalCommission: 0 } : r
      ));
      setSelectedRiderIds(new Set());
      setIsMultiSelect(false);
      alert('Payout initiated successfully. Balances have been updated.');
    }
  };

  const getStatusStyle = (status: RiderStatus) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Delivery': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Break': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Offline': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Suspended': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getVehicleIcon = (vehicle: VehicleType) => {
    switch (vehicle) {
      case 'Motorcycle': return <Bike size={16} />;
      case 'Bicycle': return <Bike size={16} />;
      case 'Car': return <Car size={16} />;
    }
  };

  const renderRatingBar = (stars: number, count: number) => {
    const total = Object.values(formData.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }).reduce((a: number, b: number) => a + b, 0) || 1;
    const percentage = (count / total) * 100;
    return (
      <div key={stars} className="flex items-center gap-4 text-sm group">
        <div className="flex items-center gap-1.5 w-10 font-black text-gray-400 group-hover:text-gray-600 transition-colors">
          <span>{stars}</span>
          <Star size={12} className="fill-current" />
        </div>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-sm" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-16 text-right text-[11px] font-black text-gray-400 tracking-tighter">
          {count.toLocaleString()} <span className="font-medium text-[9px] ml-0.5">Rev.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Logistics Command Center</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Empowering regional delivery heroes through precision data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsMultiSelect(!isMultiSelect);
              setSelectedRiderIds(new Set());
            }}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl transition-all font-black border uppercase text-[10px] tracking-widest ${isMultiSelect ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {isMultiSelect ? <CheckCircle2 size={16} /> : <CheckSquare size={16} />}
            <span>{isMultiSelect ? 'Exit Bulk Edit' : 'Multi-Select Mode'}</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-gray-200 font-black text-sm"
          >
            <UserPlus size={20} className="text-orange-500" />
            <span>Enlist New Personnel</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Fleet Capacity', value: riders.length, sub: 'Total Personnel', icon: <Users size={24} />, color: 'orange', trend: '+4 New' },
           { label: 'Duty Cycle', value: riders.filter(r => r.status === 'Available' || r.status === 'On Delivery').length, sub: 'Active Now', icon: <Zap size={24} />, color: 'green', trend: 'Live' },
           { label: 'Volume Today', value: '432', sub: 'Completed Drops', icon: <ShoppingBag size={24} />, color: 'blue', trend: '+12.4%' },
           // Fix: Explicitly type acc and r in reduce to resolve arithmetic operation errors.
           { label: 'Fleet Revenue', value: `₱${riders.reduce((acc: number, r: Rider) => acc + (Number(r.totalCommission) || 0), 0).toLocaleString()}`, sub: 'LTD Commission', icon: <PhilippinePeso size={24} />, color: 'purple', trend: 'Secured' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div className={`bg-${stat.color}-50 p-4 rounded-2xl text-${stat.color}-600 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors`}>
                    {stat.icon}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                    {stat.trend}
                 </span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1 relative z-10">{stat.value}</h3>
              <p className="text-gray-400 text-[11px] font-medium mt-1 relative z-10">{stat.sub}</p>
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Fleet Directory <span className="text-orange-500">.</span></h2>
          <div className="flex flex-wrap gap-4">
             <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                   type="text" 
                   placeholder="Search personnel directory..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-bold w-72 shadow-inner"
                />
             </div>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="px-6 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest cursor-pointer hover:border-orange-200 shadow-sm transition-all"
             >
                <option value="All">Global Fleet</option>
                <option value="Available">Available</option>
                <option value="On Delivery">En Route</option>
                <option value="Break">Off-duty</option>
                <option value="Offline">Invisible</option>
                <option value="Suspended">Restricted</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                {isMultiSelect && <th className="px-8 py-6 w-10">Pick</th>}
                <th className="px-8 py-6">Personnel Profile</th>
                <th className="px-8 py-6">Mode of Transport</th>
                <th className="px-8 py-6">Mission Status</th>
                <th className="px-8 py-6">Net Commissions</th>
                <th className="px-8 py-6">Success Analytics</th>
                <th className="px-8 py-6 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRiders.map((rider) => {
                const isSelected = selectedRiderIds.has(rider.id);
                return (
                  <tr 
                    key={rider.id} 
                    className={`hover:bg-gray-50/50 transition-all group ${rider.status === 'Suspended' ? 'bg-red-50/10' : ''} ${isSelected ? 'bg-orange-50/50' : ''} cursor-pointer`}
                    onClick={() => {
                      if(isMultiSelect) toggleRiderSelection(rider.id);
                      else handleOpenModal(rider);
                    }}
                  >
                    {isMultiSelect && (
                      <td className="px-8 py-6">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-200' : 'bg-white border-gray-200'}`}>
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative group-hover:scale-110 transition-transform">
                           <img src={rider.avatar} className={`w-14 h-14 rounded-[1.25rem] object-cover border-2 border-white shadow-md ${rider.status === 'Suspended' ? 'grayscale' : ''}`} alt="" />
                           <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm ${rider.status === 'Available' ? 'bg-green-500' : rider.status === 'On Delivery' ? 'bg-orange-500' : rider.status === 'Suspended' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-base leading-tight tracking-tight">{rider.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Phone size={10} className="text-gray-400" />
                             <p className="text-[11px] text-gray-400 font-bold">{rider.phone}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shadow-inner group-hover:bg-white group-hover:shadow-md transition-all">
                             {getVehicleIcon(rider.vehicle)}
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-gray-500">{rider.vehicle}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border self-start shadow-sm ${getStatusStyle(rider.status)}`}>
                           {rider.status}
                        </span>
                        {rider.availabilityDetail && (
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold italic tracking-tight">
                            <Clock size={12} className="text-orange-400" />
                            <span>{rider.availabilityDetail}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-gray-900 font-black text-base">
                             <PhilippinePeso size={14} className="text-orange-500" />
                             <span>{rider.totalCommission.toLocaleString()}</span>
                          </div>
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Accumulated Payout</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-1.5 text-gray-900">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-black">{rider.rating}</span>
                             </div>
                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Trust Index</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-900">
                             <Timer size={14} className="text-blue-500" />
                             <span className="text-sm font-black">{rider.avgDeliveryTime}m</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                         className="p-3 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                      >
                         <ArrowRight size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-7xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[95vh] border border-white/20">
            {/* Expanded Modal Header with Background Cover */}
            <div className="relative h-64 flex-shrink-0 group overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2000" 
                 className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-[2s]"
                 alt="Fleet Background"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
               
               <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-10">
                  <div className="flex items-center gap-8">
                     <div className="relative">
                        <img src={formData.avatar} className="w-40 h-40 rounded-[2.5rem] border-8 border-white/10 object-cover shadow-2xl backdrop-blur-sm" alt="Profile" />
                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-lg ${formData.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
                           {formData.status === 'Available' ? <CheckCircle2 size={20} className="text-white" /> : <Ban size={20} className="text-white" />}
                        </div>
                     </div>
                     <div className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-5xl font-black text-white tracking-tighter">{formData.name}</h3>
                           <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                              Personnel V.2
                           </div>
                        </div>
                        <div className="flex items-center gap-6 text-white/70 font-bold uppercase tracking-widest text-[11px]">
                           <span className="flex items-center gap-2 text-orange-400"><MapPin size={14} /> Region: Cordillera</span>
                           <span className="flex items-center gap-2"><Briefcase size={14} /> ID: {editingRider?.id || 'UNASSIGNED'}</span>
                           <span className="flex items-center gap-2"><Globe size={14} /> IP: 112.198.64.12</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                     <button className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all">
                        <MessageCircle size={24} />
                     </button>
                     <button className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all">
                        <Phone size={24} />
                     </button>
                     <button className="p-4 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white transition-all shadow-xl shadow-orange-500/30">
                        <Target size={24} />
                     </button>
                  </div>
               </div>

               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
               >
                  <X size={24} />
               </button>
            </div>
            
            <div className="p-10 overflow-y-auto bg-gray-50 flex-1">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Controls & Data */}
                  <div className="lg:col-span-4 space-y-10">
                     <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-8">
                           <Shield size={16} /> Administrative Portal
                        </h4>
                        
                        <div className="space-y-6">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Legal Designation</label>
                              <input 
                                 type="text" 
                                 value={formData.name}
                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                                 className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-black text-gray-800 text-lg"
                                 placeholder="Rider Name"
                              />
                           </div>

                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Network Identity</label>
                                 <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input 
                                       type="email" 
                                       value={formData.email}
                                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-bold text-gray-800"
                                       placeholder="Email"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Emergency Terminal</label>
                                 <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input 
                                       type="tel" 
                                       value={formData.phone}
                                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-bold text-gray-800"
                                       placeholder="Phone"
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* Structured Address Section - JUST LIKE RESTAURANT */}
                           <div className="space-y-4 pt-4 border-t border-gray-100">
                             <label className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] block px-1">Registered Home Base</label>
                             <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                {/* Region */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Region</label>
                                  <div className="relative">
                                    <select 
                                      name="region"
                                      onChange={handleLocationChange}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-bold outline-none transition-all"
                                    >
                                      <option value="">{loadingLocations.regions ? 'Scanning...' : 'Select Region'}</option>
                                      {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    {loadingLocations.regions && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                                  </div>
                                </div>

                                {/* Province */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Province / District</label>
                                  <div className="relative">
                                    <select 
                                      name="province"
                                      disabled={!provinces.length}
                                      onChange={handleLocationChange}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-bold outline-none transition-all disabled:opacity-50"
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
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City / Municipality</label>
                                  <div className="relative">
                                    <select 
                                      name="city"
                                      disabled={!cities.length}
                                      onChange={handleLocationChange}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-bold outline-none transition-all disabled:opacity-50"
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
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Barangay</label>
                                  <div className="relative">
                                    <select 
                                      name="barangay"
                                      disabled={!barangays.length}
                                      onChange={handleLocationChange}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none text-sm font-bold outline-none transition-all disabled:opacity-50"
                                    >
                                      <option value="">Select Barangay</option>
                                      {barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    {loadingLocations.barangays && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" size={14} />}
                                  </div>
                                </div>
                             </div>
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center italic">Calculated Address: {formData.address || 'Pending selection'}</p>
                           </div>

                           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl mt-8">
                              <div className="relative z-10">
                                 <div className="flex items-center justify-between mb-8">
                                    <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
                                       <CreditCard size={24} />
                                    </div>
                                    <span className="text-[9px] font-black bg-white/10 px-2.5 py-1 rounded-full text-white uppercase tracking-widest">Active Cycle</span>
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Commission</p>
                                 <h2 className="text-4xl font-black tracking-tight">₱{(formData.totalCommission || 0).toLocaleString()}</h2>
                                 <button className="w-full mt-8 py-3.5 bg-white text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                                    Release Settlement
                                 </button>
                              </div>
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                           </div>
                        </div>
                     </section>
                  </div>

                  {/* Right Analytics & Breakdown */}
                  <div className="lg:col-span-8 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Rating Distribution Section */}
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                           <div className="flex items-center justify-between mb-10">
                              <div>
                                 <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-2">
                                    <BadgeCheck size={16} /> Satisfaction Metrics
                                 </h4>
                                 <p className="text-xl font-black text-gray-900">User Experience Cloud</p>
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center gap-3">
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter">{formData.rating}</span>
                                    <div className="bg-yellow-50 p-2 rounded-xl text-yellow-600">
                                       <Star size={24} className="fill-current" />
                                    </div>
                                 </div>
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Weighted Performance</p>
                              </div>
                           </div>

                           <div className="space-y-5">
                              {([5, 4, 3, 2, 1] as const).map(stars => renderRatingBar(stars, formData.ratingDistribution?.[stars] || 0))}
                           </div>

                           <div className="mt-10 grid grid-cols-2 gap-4">
                              <div className="p-5 bg-green-50/50 border border-green-100 rounded-3xl text-center">
                                 <p className="text-xs font-black text-green-700 uppercase tracking-widest">Sentiment</p>
                                 <p className="text-xl font-black text-green-800 mt-1">98% Positive</p>
                              </div>
                              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl text-center">
                                 <p className="text-xs font-black text-blue-700 uppercase tracking-widest">Repeat Rate</p>
                                 <p className="text-xl font-black text-blue-800 mt-1">84% Retention</p>
                              </div>
                           </div>
                        </section>

                        {/* Performance Gauge Section */}
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                           <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-10">
                              <Activity size={16} /> Fleet Efficiency Data
                           </h4>
                           
                           <div className="space-y-10">
                              <div className="relative">
                                 <div className="flex justify-between items-end mb-3">
                                    <div>
                                       <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Mission Success Rate</p>
                                       <p className="text-[10px] text-gray-400 font-medium italic">Accuracy in order fulfillment</p>
                                    </div>
                                    <span className="text-2xl font-black text-green-600 tracking-tighter">{formData.successRate}%</span>
                                 </div>
                                 <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                       className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-[2s] shadow-lg" 
                                       style={{ width: `${formData.successRate}%` }}
                                    ></div>
                                 </div>
                              </div>

                              <div className="relative">
                                 <div className="flex justify-between items-end mb-3">
                                    <div>
                                       <p className="text-xs font-black text-gray-900 uppercase tracking-tight">System Attrition Impact</p>
                                       <p className="text-[10px] text-gray-400 font-medium italic">Impact of cancelled missions</p>
                                    </div>
                                    <span className="text-2xl font-black text-red-600 tracking-tighter">{formData.cancellationRate}%</span>
                                 </div>
                                 <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                       className="h-full bg-gradient-to-r from-red-400 to-rose-600 rounded-full transition-all duration-[2s] shadow-lg" 
                                       style={{ width: `${formData.cancellationRate}%` }}
                                    ></div>
                                 </div>
                                 <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                                    <AlertTriangle size={18} className="text-red-500" />
                                    <p className="text-[10px] text-red-700 font-bold leading-tight">Threshold: Account remains <span className="font-black">Active</span> while attrition is below 5.0%</p>
                                 </div>
                              </div>

                              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
                                 <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div>
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Velocity</p>
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{formData.avgDeliveryTime} Min</p>
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-200"></div>
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sorting</p>
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{formData.deliveries?.toLocaleString()}</p>
                                 </div>
                              </div>
                           </div>
                        </section>
                     </div>

                     {/* Recent Activity Ledger */}
                     <section className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                           <div>
                              <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
                                 <History size={16} /> Mission History Ledger
                              </h4>
                              <p className="text-base font-black text-gray-900">Recent Dispatch Sequence</p>
                           </div>
                           <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all flex items-center gap-2 shadow-sm">
                              Audit Full Trace <ArrowRight size={14} />
                           </button>
                        </div>
                        
                        <div className="p-0">
                           {formData.recentActivity && formData.recentActivity.length > 0 ? (
                              <div className="divide-y divide-gray-100">
                                 {formData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                       <div className="flex items-center gap-6">
                                          <div className={`p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-all ${activity.status === 'On Time' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                             <ShoppingBag size={24} />
                                          </div>
                                          <div>
                                             <p className="text-lg font-black text-gray-900 tracking-tight">Mission #{activity.orderId}</p>
                                             <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                   <Clock size={12} /> {activity.time}
                                                </span>
                                                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${activity.status === 'On Time' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                   {activity.status}
                                                </div>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-12">
                                          <div className="text-center">
                                             <div className="flex items-center gap-1 text-yellow-500 mb-0.5 justify-center">
                                                <Star size={16} className="fill-current" />
                                                <span className="text-sm font-black text-gray-900">{activity.rating.toFixed(1)}</span>
                                             </div>
                                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">CSAT Score</p>
                                          </div>
                                          <div className="text-right min-w-[120px]">
                                             <div className="flex items-center justify-end text-gray-900 font-black text-xl tracking-tight">
                                                <PhilippinePeso size={16} className="text-orange-500 mr-1" />
                                                <span>{activity.earnings.toFixed(2)}</span>
                                             </div>
                                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Payout Share</p>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="py-32 text-center">
                                 <History size={48} className="mx-auto text-gray-200 mb-6" />
                                 <p className="text-gray-400 font-black uppercase tracking-widest text-[11px]">No activity history cached for this node</p>
                              </div>
                           )}
                        </div>
                     </section>
                  </div>
               </div>
            </div>

            <div className="p-10 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-6">
               <div className="flex-1 flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all shadow-sm"
                  >
                     Discard Changes
                  </button>
                  {editingRider && (
                     <button 
                       onClick={() => handleToggleStatus(editingRider.id)}
                       className={`flex-1 py-4 border rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 ${formData.status === 'Suspended' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'}`}
                     >
                       {formData.status === 'Suspended' ? <><CheckCircle2 size={18} /> Restore Node</> : <><Ban size={18} /> Sever Connection</>}
                     </button>
                  )}
               </div>
               <button 
                  onClick={handleSaveRider}
                  disabled={!formData.name}
                  className="flex-[0.6] py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.25em] hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 group disabled:opacity-50"
               >
                  <Save size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>Commit Terminal Updates</span>
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DeliveryManagement;
