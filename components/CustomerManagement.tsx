
import React, { useState } from 'react';
import { Customer, MembershipTier, CustomerStatus, CustomerType } from '../types';
import { CUSTOMERS } from '../constants';
import { 
  Search, Plus, Users, Star, PhilippinePeso, 
  TrendingUp, Mail, Phone, MapPin, MoreVertical, 
  Trash2, Edit, ChevronRight, Filter, Download,
  CheckCircle2, XCircle, Ban, MessageSquare, Award, X,
  Utensils, Store, Bike, User
} from 'lucide-react';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<MembershipTier | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'All'>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    tier: 'Regular',
    status: 'Active',
    type: 'Regular',
    totalSpent: 0,
    orderCount: 0
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'All' || customer.tier === tierFilter;
    const matchesType = typeFilter === 'All' || customer.type === typeFilter;
    return matchesSearch && matchesTier && matchesType;
  });

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        tier: 'Regular', 
        status: 'Active', 
        type: 'Regular',
        totalSpent: 0, 
        orderCount: 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } as Customer : c));
    } else {
      const id = `c${Date.now()}`;
      const newCustomer: Customer = {
        id,
        name: formData.name || 'New Customer',
        email: formData.email || '',
        phone: formData.phone || '',
        tier: formData.tier as MembershipTier,
        status: formData.status as CustomerStatus,
        type: formData.type as CustomerType,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' }),
        lastOrderDate: 'Never',
        totalSpent: 0,
        orderCount: 0,
        avatar: `https://picsum.photos/seed/${id}/150`
      };
      setCustomers([newCustomer, ...customers]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Delete this customer profile? This action cannot be undone.')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const getTierStyle = (tier: MembershipTier) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100';
      case 'Silver': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Bronze': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getTypeInfo = (type: CustomerType) => {
    switch (type) {
      case 'Restaurant Owner': 
        return { 
          icon: <Utensils size={12} />, 
          color: 'bg-indigo-50 text-indigo-700 border-indigo-100' 
        };
      case 'Store Owner': 
        return { 
          icon: <Store size={12} />, 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100' 
        };
      case 'Delivery Rider': 
        return { 
          icon: <Bike size={12} />, 
          color: 'bg-orange-50 text-orange-700 border-orange-100' 
        };
      default: 
        return { 
          icon: <User size={12} />, 
          color: 'bg-gray-50 text-gray-700 border-gray-100' 
        };
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Network</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage loyalty programs and customer relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm">
            <Download size={18} />
            <span>Export Data</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-200 font-black text-sm"
          >
            <Plus size={20} />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Users size={24} />
               </div>
               <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Clients</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{customers.length.toLocaleString()}</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600">
                  <Award size={24} />
               </div>
               <span className="text-xs font-black text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">VIP</span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Gold Members</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{customers.filter(c => c.tier === 'Gold').length}</h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                  <PhilippinePeso size={24} />
               </div>
               <span className="text-xs font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">LTV</span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Avg Lifetime Value</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
               ₱{(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <TrendingUp size={24} />
               </div>
               <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">+5.4%</span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Growth Rate</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">24.8%</h3>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Merchant Directory</h2>
          
          <div className="flex flex-wrap gap-4">
             {/* Search */}
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                   type="text" 
                   placeholder="Search name or email..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium w-64 shadow-inner"
                />
             </div>

             {/* Type Filter */}
             <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-inner">
                <button 
                  onClick={() => setTypeFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${typeFilter === 'All' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  All Types
                </button>
                {(['Restaurant Owner', 'Store Owner', 'Delivery Rider', 'Regular'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${typeFilter === type ? 'bg-white text-orange-600 shadow-sm border border-orange-100' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {type.split(' ')[0]}
                  </button>
                ))}
             </div>

             {/* Tier Filter */}
             <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-inner">
               <button 
                 onClick={() => setTierFilter('All')}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${tierFilter === 'All' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 All Tiers
               </button>
               {['Gold', 'Silver', 'Bronze'].map(tier => (
                 <button 
                   key={tier}
                   onClick={() => setTierFilter(tier as MembershipTier)}
                   className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${tierFilter === tier ? 'bg-white text-orange-600 shadow-sm border border-orange-100' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {tier}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-6 py-5">Profile</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Membership Tier</th>
                <th className="px-6 py-5">Activity Metrics</th>
                <th className="px-6 py-5">Financial Summary</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => {
                const typeInfo = getTypeInfo(customer.type);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={customer.avatar} className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm" alt="" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{customer.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${typeInfo.color}`}>
                         {typeInfo.icon}
                         {customer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTierStyle(customer.tier)}`}>
                         {customer.tier === 'Gold' && <Award size={12} className="fill-yellow-500" />}
                         {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-800">{customer.orderCount} Orders</p>
                        <p className="text-[10px] text-gray-400 font-medium">Last order: {customer.lastOrderDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-orange-600">
                           <PhilippinePeso size={12} className="font-bold" />
                           <span className="text-sm font-black tracking-tight">{customer.totalSpent.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Lifetime spend</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${customer.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                         <button 
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                           title="Send Message"
                         >
                            <MessageSquare size={18} />
                         </button>
                         <button 
                           onClick={() => handleOpenModal(customer)}
                           className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                           title="Edit Profile"
                         >
                            <Edit size={18} />
                         </button>
                         <button 
                           onClick={() => handleDeleteCustomer(customer.id)}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                           title="Block Customer"
                         >
                            <Ban size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
            <div className="bg-gray-900 p-8 flex justify-between items-center text-white">
               <div className="flex items-center gap-5">
                  <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-xl shadow-orange-500/30">
                     <Users size={32} />
                  </div>
                  <div>
                     <h3 className="font-black text-2xl tracking-tight">{editingCustomer ? 'Update Profile' : 'New Customer Profile'}</h3>
                     <p className="text-xs text-gray-400 mt-1 uppercase tracking-[0.2em] font-bold">Account Registration • Cordillera Region</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all text-white">
                  <X size={24} />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Full Name</label>
                     <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-bold text-gray-800"
                        placeholder="e.g. Juan De Leon"
                     />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Email Address</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-medium text-gray-800"
                              placeholder="juan@email.com"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Phone</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                              type="tel" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-medium text-gray-800"
                              placeholder="+63"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Customer Classification</label>
                     <div className="grid grid-cols-2 gap-3">
                        {(['Regular', 'Restaurant Owner', 'Store Owner', 'Delivery Rider'] as CustomerType[]).map((type) => (
                           <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({...formData, type})}
                              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold ${
                                 formData.type === type 
                                 ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-100' 
                                 : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                           >
                              <div className={`${formData.type === type ? 'text-orange-500' : 'text-gray-400'}`}>
                                 {getTypeInfo(type).icon}
                              </div>
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Membership Tier</label>
                        <select 
                           value={formData.tier}
                           onChange={(e) => setFormData({...formData, tier: e.target.value as any})}
                           className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 text-sm font-bold text-gray-800 cursor-pointer"
                        >
                           <option value="Regular">Regular</option>
                           <option value="Bronze">Bronze</option>
                           <option value="Silver">Silver</option>
                           <option value="Gold">Gold Member</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Account Status</label>
                        <select 
                           value={formData.status}
                           onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                           className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 text-sm font-bold text-gray-800 cursor-pointer"
                        >
                           <option value="Active">Active Profile</option>
                           <option value="Inactive">Inactive / Resting</option>
                           <option value="Blocked">Blocked / Flagged</option>
                        </select>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Billing Address</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                           type="text" 
                           className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-medium text-gray-800"
                           placeholder="Street, City, Province"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-[1.5rem] font-bold hover:bg-gray-100 transition-all shadow-sm"
               >
                  Discard Changes
               </button>
               <button 
                  onClick={handleSaveCustomer}
                  disabled={!formData.name || !formData.email}
                  className="flex-[1.5] py-4 bg-orange-500 text-white rounded-[1.5rem] font-black hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  <Plus size={24} />
                  <span>{editingCustomer ? 'Commit Profile Updates' : 'Establish Profile'}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
