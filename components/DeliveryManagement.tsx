
import React, { useState } from 'react';
import { Rider, RiderStatus, VehicleType, RiderActivity } from '../types';
import { RIDERS } from '../constants';
// Added Ban to the list of icons imported from lucide-react
import { 
  Search, Plus, Bike, Truck, Car, Star, Phone, Mail, 
  Filter, CheckCircle2, XCircle, Clock, Trash2, Edit, Edit3,
  X, UserPlus, Save, Activity, ArrowUpRight, ArrowDownRight,
  TrendingUp, Users, MapPin, Shield, Info, Timer, Award,
  Target, AlertCircle, ShoppingBag, PhilippinePeso, History, ArrowRight,
  Wallet, TrendingDown, Briefcase, ThumbsUp, MessageCircle, Power, ShieldAlert,
  Ban
} from 'lucide-react';

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
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [isCustomAvailability, setIsCustomAvailability] = useState(false);

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
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

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
      // Check if current detail is custom
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
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRider = () => {
    if (editingRider) {
      setRiders(riders.map(r => r.id === editingRider.id ? { ...r, ...formData } as Rider : r));
    } else {
      const id = `ri${Date.now()}`;
      const newRider: Rider = {
        id,
        name: formData.name || 'New Rider',
        email: formData.email || '',
        phone: formData.phone || '',
        status: formData.status as RiderStatus,
        availabilityDetail: formData.availabilityDetail,
        vehicle: formData.vehicle as VehicleType,
        rating: formData.rating || 5.0,
        deliveries: formData.deliveries || 0,
        avgDeliveryTime: formData.avgDeliveryTime || 25,
        successRate: formData.successRate || 100,
        cancellationRate: formData.cancellationRate || 0,
        totalCommission: formData.totalCommission || 0,
        avatar: `https://picsum.photos/seed/${id}/150`,
        recentActivity: [],
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
      setRiders([newRider, ...riders]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRider = (id: string) => {
    const rider = riders.find(r => r.id === id);
    if (rider && window.confirm(`Are you sure you want to delete rider ${rider.name}?`)) {
      setRiders(riders.filter(r => r.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    const rider = riders.find(r => r.id === id);
    if (!rider) return;

    let nextStatus: RiderStatus;
    if (rider.status === 'Suspended') {
      nextStatus = 'Offline';
      if (window.confirm(`Re-activate ${rider.name}'s account? Status will be set to Offline.`)) {
        setRiders(riders.map(r => r.id === id ? { ...r, status: nextStatus } : r));
      }
    } else {
      nextStatus = 'Suspended';
      if (window.confirm(`Are you sure you want to suspend/deactivate ${rider.name}? They will not be able to accept orders.`)) {
        setRiders(riders.map(r => r.id === id ? { ...r, status: nextStatus } : r));
      }
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
    const total = Object.values(formData.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }).reduce((a, b) => a + b, 0) || 1;
    const percentage = (count / total) * 100;
    return (
      <div key={stars} className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1 w-8 font-bold text-gray-600">
          <span>{stars}</span>
          <Star size={12} className="fill-gray-400 text-gray-400" />
        </div>
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-12 text-right text-[11px] font-black text-gray-400">
          {count.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your logistics fleet and optimize delivery routes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-200 font-bold"
        >
          <UserPlus size={20} />
          <span>Onboard New Rider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                  <Users size={24} />
               </div>
               <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center">
                  <ArrowUpRight size={14} className="mr-1" /> +4
               </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Riders</p>
            <h3 className="text-2xl font-black text-gray-900">{riders.length}</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                  <Activity size={24} />
               </div>
               <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Real-time</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Active Now</p>
            <h3 className="text-2xl font-black text-gray-900">{riders.filter(r => r.status === 'Available' || r.status === 'On Delivery').length}</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <TrendingUp size={24} />
               </div>
               <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center">
                  <ArrowUpRight size={14} className="mr-1" /> +12%
               </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Deliveries Today</p>
            <h3 className="text-2xl font-black text-gray-900">432</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <PhilippinePeso size={24} />
               </div>
               <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center">
                  <ArrowUpRight size={14} className="mr-1" /> +8%
               </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Comm. Paid</p>
            <h3 className="text-2xl font-black text-gray-900">₱{riders.reduce((acc, r) => acc + r.totalCommission, 0).toLocaleString()}</h3>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Fleet Management</h2>
          <div className="flex flex-wrap gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                   type="text" 
                   placeholder="Search riders..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium w-64"
                />
             </div>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium cursor-pointer hover:bg-gray-100 shadow-sm"
             >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="On Delivery">On Delivery</option>
                <option value="Break">Break</option>
                <option value="Offline">Offline</option>
                <option value="Suspended">Suspended</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">Rider Details</th>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Status & Availability</th>
                <th className="px-6 py-5">Earnings (Commission)</th>
                <th className="px-6 py-5">Performance Metrics</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRiders.map((rider) => (
                <tr key={rider.id} className={`hover:bg-gray-50/50 transition-colors ${rider.status === 'Suspended' ? 'opacity-60 bg-red-50/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <img src={rider.avatar} className={`w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm ${rider.status === 'Suspended' ? 'grayscale' : ''}`} alt="" />
                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${rider.status === 'Available' ? 'bg-green-500' : rider.status === 'On Delivery' ? 'bg-orange-500' : rider.status === 'Suspended' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{rider.name}</p>
                        <p className="text-xs text-gray-500">{rider.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2 bg-gray-100 rounded-lg">
                           {getVehicleIcon(rider.vehicle)}
                        </div>
                        <span className="text-sm font-medium">{rider.vehicle}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border self-start ${getStatusStyle(rider.status)}`}>
                         {rider.status}
                      </span>
                      {rider.availabilityDetail && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium italic">
                          <Clock size={12} className="text-orange-400" />
                          <span>{rider.availabilityDetail}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                           <PhilippinePeso size={12} className="text-orange-500" />
                           <span className="text-sm font-black text-gray-900">{rider.totalCommission.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Lifetime</p>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5">
                              <Star size={12} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold text-gray-800">{rider.rating}</span>
                           </div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                              Rating
                           </p>
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5">
                              <Timer size={12} className="text-blue-500" />
                              <span className="text-sm font-bold text-gray-800">{rider.avgDeliveryTime}m</span>
                           </div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                              Avg Time
                           </p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                       <button 
                         onClick={() => handleToggleStatus(rider.id)}
                         title={rider.status === 'Suspended' ? 'Re-activate Account' : 'Suspend Account'}
                         className={`p-2 rounded-xl transition-all ${rider.status === 'Suspended' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                       >
                          {rider.status === 'Suspended' ? <CheckCircle2 size={18} /> : <Power size={18} />}
                       </button>
                       <button 
                         onClick={() => handleOpenModal(rider)}
                         className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                       >
                          <Edit size={18} />
                       </button>
                       <button 
                         onClick={() => handleDeleteRider(rider.id)}
                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[95vh]">
            <div className={`p-8 flex justify-between items-center text-white transition-colors duration-500 ${formData.status === 'Suspended' ? 'bg-red-600' : 'bg-gray-900'}`}>
               <div className="flex items-center gap-5">
                  <div className={`${formData.status === 'Suspended' ? 'bg-white text-red-600' : 'bg-orange-500 text-white'} p-4 rounded-2xl shadow-xl transition-colors`}>
                     {formData.status === 'Suspended' ? <ShieldAlert size={32} /> : editingRider ? <Award size={32} /> : <UserPlus size={32} />}
                  </div>
                  <div>
                     <h3 className="font-black text-2xl tracking-tight">
                       {formData.status === 'Suspended' ? 'Rider Account Suspended' : editingRider ? 'Rider Personnel Archive' : 'Onboard New Rider'}
                     </h3>
                     <p className={`text-xs mt-1 uppercase tracking-[0.2em] font-bold ${formData.status === 'Suspended' ? 'text-red-100' : 'text-gray-400'}`}>
                       Fleet Tracking ID: {editingRider?.id || 'PENDING GEN'} • REGION: Cordillera
                     </p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all text-white">
                  <X size={24} />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-12">
               {formData.status === 'Suspended' && (
                 <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-center gap-6 animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-red-100 p-4 rounded-2xl text-red-600 shadow-inner">
                       <ShieldAlert size={28} />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-red-800 font-black tracking-tight text-lg">Personnel Access Restricted</h4>
                       <p className="text-red-700/80 text-sm font-medium">This account has been flagged and suspended from the active logistics fleet. They cannot receive payouts or accept new orders until re-activated.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, status: 'Offline'})}
                      className="px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 text-sm flex items-center gap-2"
                    >
                       <CheckCircle2 size={18} /> Lift Suspension
                    </button>
                 </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-5 space-y-10">
                     <section>
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                           <Users size={16} /> Personal Identification
                        </h4>
                        
                        <div className="space-y-5">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Rider Full Name</label>
                              <input 
                                 type="text" 
                                 value={formData.name}
                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                                 className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-bold text-gray-800"
                                 placeholder="e.g. John Dela Cruz"
                              />
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Email Address</label>
                                 <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input 
                                       type="email" 
                                       value={formData.email}
                                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                                       placeholder="john@marketcordi.ph"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Phone</label>
                                 <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input 
                                       type="tel" 
                                       value={formData.phone}
                                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                                       placeholder="+63"
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Fleet Details & Availability</label>
                              <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vehicle</label>
                                       <select 
                                          value={formData.vehicle}
                                          onChange={(e) => setFormData({...formData, vehicle: e.target.value as any})}
                                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold text-gray-800"
                                       >
                                          <option value="Motorcycle">Motorcycle</option>
                                          <option value="Bicycle">Bicycle</option>
                                          <option value="Car">Car</option>
                                       </select>
                                    </div>
                                    <div className="space-y-1.5">
                                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Status</label>
                                       <select 
                                          value={formData.status}
                                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold text-gray-800"
                                       >
                                          <option value="Available">Available</option>
                                          <option value="On Delivery">On Delivery</option>
                                          <option value="Offline">Offline</option>
                                          <option value="Break">Break</option>
                                          <option value="Suspended">Suspended</option>
                                       </select>
                                    </div>
                                 </div>
                                 
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Availability Details</label>
                                    <div className="space-y-3">
                                       <select 
                                          value={isCustomAvailability ? 'Custom' : formData.availabilityDetail || ''}
                                          onChange={(e) => {
                                             const val = e.target.value;
                                             if (val === 'Custom') {
                                                setIsCustomAvailability(true);
                                                setFormData({...formData, availabilityDetail: ''});
                                             } else {
                                                setIsCustomAvailability(false);
                                                setFormData({...formData, availabilityDetail: val});
                                             }
                                          }}
                                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-medium text-gray-800"
                                       >
                                          <option value="">No specific detail</option>
                                          {AVAILABILITY_OPTIONS.map(opt => (
                                             <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                          <option value="Custom">Custom Text...</option>
                                       </select>
                                       
                                       {(isCustomAvailability || (formData.availabilityDetail && !AVAILABILITY_OPTIONS.includes(formData.availabilityDetail))) && (
                                          <div className="animate-[fadeIn_0.2s_ease-out] relative">
                                             <Edit3 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                                             <input 
                                                type="text"
                                                value={formData.availabilityDetail}
                                                onChange={(e) => setFormData({...formData, availabilityDetail: e.target.value})}
                                                placeholder="Enter custom availability status..."
                                                className="w-full pl-9 pr-4 py-3 bg-white border border-orange-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-50 text-sm font-medium text-gray-800 italic"
                                             />
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>

                     <section className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
                        <div className="relative z-10">
                           <div className="flex items-center justify-between mb-10">
                              <div className="bg-orange-500 p-4 rounded-3xl shadow-lg shadow-orange-500/20">
                                 <Wallet size={32} className="text-white" />
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Fiscal Cycle: OCT 2024</p>
                                 <span className="bg-green-500/20 text-green-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-500/30">Cleared for Payout</span>
                              </div>
                           </div>

                           <div className="space-y-2 mb-10">
                              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Accrued Commission</p>
                              <div className="flex items-end gap-3">
                                 <h2 className="text-6xl font-black tracking-tighter">₱{(formData.totalCommission || 0).toLocaleString()}</h2>
                                 <div className="flex flex-col items-center mb-2">
                                    <span className="text-green-400 font-black flex items-center text-sm">
                                       <ArrowUpRight size={20} /> 14.2%
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                              <div>
                                 <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Balance</p>
                                 <p className="text-2xl font-black">₱3,240.00</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Next Settlement</p>
                                 <p className="text-2xl font-black">Oct 30</p>
                              </div>
                           </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]"></div>
                        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]"></div>
                     </section>
                  </div>

                  <div className="lg:col-span-7 space-y-10">
                     <section>
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                           <TrendingUp size={16} /> Efficiency Index
                        </h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                           <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 hover:bg-orange-100 transition-all cursor-default text-center text-orange-600">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm w-fit mb-4 mx-auto">
                                 <Star size={20} className="fill-orange-500" />
                              </div>
                              <p className="text-3xl font-black text-gray-900 tracking-tight">{formData.rating}</p>
                              <p className="text-[10px] font-bold mt-1 uppercase tracking-widest">Global Rating</p>
                           </div>
                           
                           <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 hover:bg-blue-100 transition-all cursor-default text-center text-blue-600">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm w-fit mb-4 mx-auto">
                                 <Timer size={20} />
                              </div>
                              <p className="text-3xl font-black text-gray-900 tracking-tight">{formData.avgDeliveryTime}m</p>
                              <p className="text-[10px] font-bold mt-1 uppercase tracking-widest">Avg. Velocity</p>
                           </div>
                           
                           <div className="bg-green-50 p-6 rounded-[2.5rem] border border-green-100 hover:bg-green-100 transition-all cursor-default text-center text-green-600">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm w-fit mb-4 mx-auto">
                                 <Target size={20} />
                              </div>
                              <p className="text-3xl font-black text-gray-900 tracking-tight">{formData.successRate}%</p>
                              <p className="text-[10px] font-bold mt-1 uppercase tracking-widest">Fulfillment</p>
                           </div>

                           <div className="bg-purple-50 p-6 rounded-[2.5rem] border border-purple-100 hover:bg-purple-100 transition-all cursor-default text-center text-purple-600">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm w-fit mb-4 mx-auto">
                                 <Briefcase size={20} />
                              </div>
                              <p className="text-3xl font-black text-gray-900 tracking-tight">{formData.deliveries?.toLocaleString()}</p>
                              <p className="text-[10px] font-bold mt-1 uppercase tracking-widest">Total Jobs</p>
                           </div>
                        </div>
                     </section>

                     <section className="bg-gray-50 border border-gray-200 rounded-[3rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                              <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-2">
                                 <ThumbsUp size={16} /> Customer Satisfaction Analysis
                              </h4>
                              <p className="text-lg font-bold text-gray-900">Feedback Distribution</p>
                           </div>
                           <div className="text-right">
                              <p className="text-3xl font-black text-gray-900">{formData.rating}</p>
                              <div className="flex text-yellow-500 gap-0.5 justify-end">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= Math.round(formData.rating || 0) ? 'fill-yellow-500' : 'text-gray-200'} />)}
                              </div>
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              {([5, 4, 3, 2, 1] as const).map(stars => renderRatingBar(stars, formData.ratingDistribution?.[stars] || 0))}
                           </div>
                           
                           <div className="flex flex-col justify-center gap-4">
                              <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                                 <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                    <ThumbsUp size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900">Top Performer</p>
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Rider is consistently rated <span className="font-bold text-orange-600">above 4.5 stars</span> in 92% of orders.</p>
                                 </div>
                              </div>
                              <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <MessageCircle size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900">Positive Mentions</p>
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Most common feedback tags: <span className="italic">"Friendly"</span>, <span className="italic">"Polite"</span>, <span className="italic">"Fast Handling"</span>.</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>

                     <section className="bg-white border-2 border-orange-100 rounded-[3rem] p-10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                           <div>
                              <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">Health Index</h5>
                              <p className="text-xl font-black text-gray-900">Performance Standing</p>
                           </div>
                           <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${(formData.cancellationRate || 0) < 2 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {(formData.cancellationRate || 0) < 2 ? 'Excellent' : 'Under Review'}
                           </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order Fulfillment Reliabilty</span>
                                 <span className="text-sm font-black text-gray-900">{formData.successRate}%</span>
                              </div>
                              <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-green-500 rounded-full transition-all duration-1000 shadow-sm" 
                                    style={{ width: `${formData.successRate}%` }}
                                 ></div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Job Rejection / Cancellation Impact</span>
                                 <span className="text-sm font-black text-red-600">{formData.cancellationRate}%</span>
                              </div>
                              <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-red-500 rounded-full transition-all duration-1000 shadow-sm" 
                                    style={{ width: `${formData.cancellationRate}%` }}
                                 ></div>
                              </div>
                           </div>
                        </div>
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                     </section>
                  </div>
               </div>

               <div className="space-y-6 pt-12 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                     <div>
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-1">
                           <History size={18} /> Personnel Activity Log
                        </h4>
                        <p className="text-sm text-gray-500 font-medium">Detailed historical breakdown of recent delivery commissions</p>
                     </div>
                     <button className="text-[11px] font-black text-gray-400 hover:text-orange-500 uppercase tracking-widest transition-all flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-2xl hover:bg-white shadow-sm bg-gray-50">
                        Export Full PDF History <ArrowRight size={14} />
                     </button>
                  </div>

                  {formData.recentActivity && formData.recentActivity.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {formData.recentActivity.map((activity) => (
                           <div key={activity.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-7 flex items-center justify-between gap-6 group hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/5 transition-all cursor-default">
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-3xl ${activity.status === 'On Time' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 shadow-inner shadow-red-500/10'}`}>
                                    <ShoppingBag size={24} />
                                 </div>
                                 <div>
                                    <p className="text-base font-black text-gray-900 leading-tight">Order {activity.orderId}</p>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{activity.time}</p>
                                 </div>
                              </div>

                              <div className="flex items-center gap-8">
                                 <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-0.5">
                                       <Star size={16} className="fill-yellow-500" />
                                       <span className="text-sm font-black text-gray-900">{activity.rating.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Review Score</p>
                                 </div>

                                 <div className="text-right min-w-[100px]">
                                    <div className="flex items-center justify-end text-gray-900 font-black text-lg">
                                       <PhilippinePeso size={16} className="mr-1 text-orange-500" />
                                       <span>{activity.earnings.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Earnings Comm.</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="py-24 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                        <div className="bg-white p-6 rounded-full shadow-sm inline-block mb-6 text-gray-300">
                           <History size={48} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900">No Transaction Data Available</h3>
                        <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-2 font-bold">New personnel activity will populate here in real-time.</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
               {editingRider && (
                  <button 
                    onClick={() => handleToggleStatus(editingRider.id)}
                    className={`flex-1 py-4 border rounded-[1.5rem] font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${formData.status === 'Suspended' ? 'bg-white border-green-200 text-green-600 hover:bg-green-50' : 'bg-white border-red-200 text-red-600 hover:bg-red-50'}`}
                  >
                    {formData.status === 'Suspended' ? (
                      <><CheckCircle2 size={20} /> Activate Account</>
                    ) : (
                      // Fixed missing 'Ban' icon import from lucide-react
                      <><Ban size={20} /> Suspend Personnel</>
                    )}
                  </button>
               )}
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-[1.5rem] font-bold hover:bg-gray-100 transition-all shadow-sm"
               >
                  Discard Changes
               </button>
               <button 
                  onClick={handleSaveRider}
                  disabled={!formData.name || !formData.phone}
                  className="flex-[1.5] py-4 bg-orange-500 text-white rounded-[1.5rem] font-black hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  <Save size={24} />
                  <span>{editingRider ? 'Commit Profile Updates' : 'Complete Fleet Enrollment'}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
