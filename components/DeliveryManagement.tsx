
import React, { useState } from 'react';
import { Rider, RiderStatus, VehicleType } from '../types';
import { RIDERS } from '../constants';
import { 
  Search, Plus, Bike, Truck, Car, Star, Phone, Mail, 
  Filter, CheckCircle2, XCircle, Clock, Trash2, Edit, 
  X, UserPlus, Save, Activity, ArrowUpRight, ArrowDownRight,
  TrendingUp, Users, MapPin, Shield, Info, Timer, Award,
  Target, AlertCircle
} from 'lucide-react';

const DeliveryManagement: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>(RIDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RiderStatus | 'All'>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);

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
    cancellationRate: 0
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
    } else {
      setEditingRider(null);
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
        cancellationRate: 0
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
        avatar: `https://picsum.photos/seed/${id}/150`
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

  const getStatusStyle = (status: RiderStatus) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Delivery': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Break': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Offline': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVehicleIcon = (vehicle: VehicleType) => {
    switch (vehicle) {
      case 'Motorcycle': return <Bike size={16} />;
      case 'Bicycle': return <Bike size={16} />;
      case 'Car': return <Car size={16} />;
    }
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                  <Activity size={24} />
               </div>
               <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Real-time</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Active Now</p>
            <h3 className="text-2xl font-black text-gray-900">{riders.filter(r => r.status === 'Available' || r.status === 'On Delivery').length}</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <Star size={24} />
               </div>
               <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg flex items-center">
                  Top Rated
               </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Avg Rider Rating</p>
            <h3 className="text-2xl font-black text-gray-900">4.82</h3>
         </div>
      </div>

      {/* Fleet Management Table */}
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
               className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium cursor-pointer hover:bg-gray-100"
             >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="On Delivery">On Delivery</option>
                <option value="Break">Break</option>
                <option value="Offline">Offline</option>
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
                <th className="px-6 py-5">Performance Metrics</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRiders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <img src={rider.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" alt="" />
                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${rider.status === 'Available' ? 'bg-green-500' : rider.status === 'On Delivery' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
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
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5">
                              <Target size={12} className="text-green-500" />
                              <span className="text-sm font-bold text-gray-800">{rider.successRate}%</span>
                           </div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                              Success
                           </p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
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
              {filteredRiders.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                         <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-4">
                            <Activity size={48} />
                         </div>
                         <h3 className="text-lg font-bold text-gray-900">No riders found</h3>
                         <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or searching for another name.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding / Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[95vh]">
            <div className="bg-gray-900 p-8 flex justify-between items-center text-white">
               <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                     {editingRider ? <Award size={24} /> : <UserPlus size={24} />}
                  </div>
                  <div>
                     <h3 className="font-bold text-xl">{editingRider ? 'Rider Profile' : 'Onboard New Rider'}</h3>
                     <p className="text-xs text-gray-400 mt-0.5">Fleet ID: {editingRider?.id || 'Pending Generation'}</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all">
                  <X size={20} />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={14} /> Basic Information
                     </h4>
                     
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Rider Full Name</label>
                           <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                              placeholder="e.g. John Dela Cruz"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Email Address</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                              <input 
                                 type="email" 
                                 value={formData.email}
                                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                                 placeholder="john@marketcordi.ph"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Phone</label>
                              <input 
                                 type="tel" 
                                 value={formData.phone}
                                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                                 placeholder="+63"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Vehicle</label>
                              <select 
                                 value={formData.vehicle}
                                 onChange={(e) => setFormData({...formData, vehicle: e.target.value as any})}
                                 className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800 cursor-pointer appearance-none"
                              >
                                 <option value="Motorcycle">Motorcycle</option>
                                 <option value="Bicycle">Bicycle</option>
                                 <option value="Car">Car</option>
                              </select>
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Status & Details</label>
                           <div className="flex gap-2">
                              <select 
                                 value={formData.status}
                                 onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                 className="w-1/3 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800 cursor-pointer appearance-none"
                              >
                                 <option value="Available">Available</option>
                                 <option value="On Delivery">On Delivery</option>
                                 <option value="Offline">Offline</option>
                                 <option value="Break">Break</option>
                              </select>
                              <input 
                                 type="text"
                                 value={formData.availabilityDetail}
                                 onChange={(e) => setFormData({...formData, availabilityDetail: e.target.value})}
                                 placeholder="e.g. Back at 5 PM"
                                 className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all font-medium text-gray-800"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Performance Metrics Section */}
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <TrendingUp size={14} /> Performance Metrics
                     </h4>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-orange-50/50 p-5 rounded-[2rem] border border-orange-100/50">
                           <div className="flex items-center gap-2 text-orange-600 mb-2">
                              <Star size={18} className="fill-orange-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Rating</span>
                           </div>
                           <p className="text-2xl font-black text-gray-900">{formData.rating}</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Customer Satisfaction</p>
                        </div>
                        
                        <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100/50">
                           <div className="flex items-center gap-2 text-blue-600 mb-2">
                              <Timer size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Efficiency</span>
                           </div>
                           <p className="text-2xl font-black text-gray-900">{formData.avgDeliveryTime}m</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Avg Delivery Time</p>
                        </div>
                        
                        <div className="bg-green-50/50 p-5 rounded-[2rem] border border-green-100/50">
                           <div className="flex items-center gap-2 text-green-600 mb-2">
                              <CheckCircle2 size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Reliability</span>
                           </div>
                           <p className="text-2xl font-black text-gray-900">{formData.successRate}%</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Success Rate</p>
                        </div>

                        <div className="bg-purple-50/50 p-5 rounded-[2rem] border border-purple-100/50">
                           <div className="flex items-center gap-2 text-purple-600 mb-2">
                              <Award size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                           </div>
                           <p className="text-2xl font-black text-gray-900">{formData.deliveries?.toLocaleString()}</p>
                           <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Job History</p>
                        </div>
                     </div>

                     <div className="bg-gray-900 p-6 rounded-[2rem] text-white relative overflow-hidden">
                        <div className="relative z-10">
                           <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Live Dispatch Summary</h5>
                           <div className="flex items-end justify-between">
                              <div className="space-y-1">
                                 <p className="text-3xl font-black">{formData.cancellationRate}%</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cancellation Rate</p>
                              </div>
                              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${(formData.cancellationRate || 0) < 2 ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                 {(formData.cancellationRate || 0) < 2 ? 'Excellent Standing' : 'Needs Review'}
                              </div>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-sm"
               >
                  Discard Changes
               </button>
               <button 
                  onClick={handleSaveRider}
                  disabled={!formData.name || !formData.phone}
                  className="flex-[1.5] py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  <Save size={20} />
                  <span>{editingRider ? 'Apply Updates' : 'Complete Onboarding'}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
