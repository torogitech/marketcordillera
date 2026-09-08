import React, { useState, useRef, useMemo } from 'react';
import { 
  Megaphone, Plus, Search, Filter, MoreVertical, 
  BarChart3, Eye, MousePointer2, Calendar, 
  PhilippinePeso, CheckCircle2, Clock, X, 
  Edit3, Trash2, LayoutGrid, List, AlertCircle,
  Smartphone, Rocket, Store, Utensils, Info, 
  TrendingUp, Play, Pause, Save, Upload,
  MonitorPlay, ShieldCheck, ChevronRight, ToggleLeft as ToggleIcon
} from 'lucide-react';
import { Ad, AdStatus, AdTarget } from '../types';
import { STORES, RESTAURANTS } from '../constants';

interface AdsManagerProps {
  ads: Ad[];
  onUpdateAds: (ads: Ad[]) => void;
}

const AdsManager: React.FC<AdsManagerProps> = ({ ads, onUpdateAds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdStatus | 'All'>('All');
  const [activeCategory, setActiveCategory] = useState<AdTarget | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ad.status === statusFilter;
      const matchesCategory = activeCategory === 'All' || ad.targetType === activeCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [ads, searchTerm, statusFilter, activeCategory]);

  const getStatusStyle = (status: AdStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Paused': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Ended': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const handleOpenModal = (ad?: Ad) => {
    if (ad) {
      setEditingAd(ad);
    } else {
      setEditingAd({
        title: '',
        description: '',
        targetType: 'Restaurant',
        targetId: RESTAURANTS[0]?.id || '',
        image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800',
        status: 'Scheduled',
        reach: 0,
        clicks: 0,
        budget: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAd = () => {
    if (editingAd?.id) {
      onUpdateAds(ads.map(a => a.id === editingAd.id ? { ...a, ...editingAd } as Ad : a));
    } else {
      const newAd: Ad = {
        ...editingAd as Ad,
        id: `ad${Date.now()}`,
        reach: 0,
        clicks: 0
      };
      onUpdateAds([newAd, ...ads]);
    }
    setIsModalOpen(false);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingAd) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingAd({
          ...editingAd,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDisplayStatus = (id: string) => {
    onUpdateAds(ads.map(ad => {
      if (ad.id === id) {
        const nextStatus: AdStatus = ad.status === 'Active' ? 'Paused' : 'Active';
        return { ...ad, status: nextStatus };
      }
      return ad;
    }));
  };

  const deleteAd = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement? All analytics will be lost.')) {
      onUpdateAds(ads.filter(a => a.id !== id));
    }
  };

  const stats = useMemo(() => {
    const reach = ads.reduce((acc, ad) => acc + ad.reach, 0);
    const clicks = ads.reduce((acc, ad) => acc + ad.clicks, 0);
    const ctr = reach > 0 ? (clicks / reach) * 100 : 0;
    return { reach, clicks, ctr };
  }, [ads]);

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3 italic">
             <div className="bg-orange-500 p-2 rounded-2xl text-white shadow-lg shadow-orange-200">
                <Megaphone size={28} />
             </div>
             Ads Manager <span className="text-orange-500">.</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-bold uppercase tracking-widest">Regional Promotion Protocol • V.4.0</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-gray-200 transition-all flex items-center justify-center gap-4 group"
        >
          <Plus size={20} className="text-orange-500 group-hover:scale-125 transition-transform" />
          Initialize Campaign
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Network Reach', value: stats.reach.toLocaleString(), sub: 'Mobile Impress.', icon: <Eye size={24} />, color: 'blue' },
           { label: 'Direct Traffic', value: stats.clicks.toLocaleString(), sub: 'CTA Engagement', icon: <MousePointer2 size={24} />, color: 'orange' },
           { label: 'Conversion CTR', value: `${stats.ctr.toFixed(2)}%`, sub: 'Efficiency Index', icon: <TrendingUp size={24} />, color: 'green' },
           { label: 'Live Signals', value: ads.filter(a => a.status === 'Active').length, sub: 'Active Broadcasts', icon: <Smartphone size={24} />, color: 'purple' }
         ].map((stat, i) => (
           <div key={i} className={`bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative`}>
              <div className={`bg-${stat.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-6 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors shadow-sm`}>
                {stat.icon}
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              <p className="text-gray-400 text-[11px] font-bold mt-1 italic opacity-60">{stat.sub}</p>
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl`}></div>
           </div>
         ))}
      </div>

      {/* Campaign Registry with Categorization */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-gray-50/30">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-gray-900 italic tracking-tight pr-6 border-r border-gray-200">Campaign Registry</h2>
              <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                {(['All', 'Restaurant', 'Store'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat === 'All' ? 'Global Fleet' : `${cat}s`}
                  </button>
                ))}
              </div>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search campaigns..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-bold w-64 shadow-sm"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-6 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest cursor-pointer hover:border-orange-200 transition-all shadow-sm"
              >
                 <option value="All">All Operations</option>
                 <option value="Active">Broadcast Live</option>
                 <option value="Scheduled">In Queue</option>
                 <option value="Paused">Manual Standby</option>
                 <option value="Ended">Archived</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black border-b border-gray-100">
              <tr>
                <th className="px-10 py-6">Creative Asset & Target Node</th>
                <th className="px-8 py-6">Mission Status</th>
                <th className="px-8 py-6">Display Switch</th>
                <th className="px-8 py-6">Mobile Data</th>
                <th className="px-8 py-6">Campaign Allocation</th>
                <th className="px-10 py-6 text-right">Ops Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                       <div className="relative">
                          <img src={ad.image} className="w-24 h-16 rounded-2xl object-cover shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500" alt="" />
                          <div className={`absolute -top-2 -right-2 p-1.5 rounded-lg shadow-lg border border-white text-white ${ad.targetType === 'Restaurant' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                             {ad.targetType === 'Restaurant' ? <Utensils size={10} /> : <Store size={10} />}
                          </div>
                       </div>
                       <div>
                         <p className="font-black text-gray-900 text-lg leading-tight tracking-tight italic">{ad.title}</p>
                         <div className="flex items-center gap-3 mt-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border bg-white ${ad.targetType === 'Restaurant' ? 'text-indigo-600 border-indigo-100' : 'text-emerald-600 border-emerald-100'}`}>
                               Target: {ad.targetType}
                            </span>
                            <span className="text-[10px] text-gray-300 font-mono">NODE_REF: {ad.targetId}</span>
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1.5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border self-start shadow-sm ${getStatusStyle(ad.status)}`}>
                          {ad.status === 'Active' ? <Play size={10} className="fill-current" /> : ad.status === 'Paused' ? <Pause size={10} className="fill-current" /> : <Clock size={10} />}
                          {ad.status}
                       </span>
                       <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase">
                          <Calendar size={10} /> {ad.startDate} — {ad.endDate}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div 
                      onClick={() => toggleDisplayStatus(ad.id)}
                      className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-500 relative shadow-inner ${ad.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${ad.status === 'Active' ? 'translate-x-7' : 'translate-x-0'}`} />
                      <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] font-black uppercase pointer-events-none select-none">
                         <span className={ad.status === 'Active' ? 'opacity-100 text-white' : 'opacity-0'}>ON</span>
                         <span className={ad.status !== 'Active' ? 'opacity-100 text-gray-400' : 'opacity-0'}>OFF</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="text-center bg-gray-50 p-2 rounded-xl group-hover:bg-white transition-colors border border-gray-100/50">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Impress</p>
                          <p className="text-xs font-black text-gray-900">{ad.reach.toLocaleString()}</p>
                       </div>
                       <div className="text-center bg-orange-50/30 p-2 rounded-xl group-hover:bg-orange-50 transition-colors border border-orange-100/30">
                          <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-0.5">Clicks</p>
                          <p className="text-xs font-black text-orange-600">{ad.clicks.toLocaleString()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-1 text-gray-900 font-black text-lg tracking-tighter">
                          <PhilippinePeso size={16} className="text-orange-500" />
                          <span>{ad.budget.toLocaleString()}</span>
                       </div>
                       <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                          <div className="bg-orange-500 h-full w-[45%] rounded-full shadow-sm"></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                       <button 
                         onClick={() => handleOpenModal(ad)}
                         className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all"
                         title="Update Registry"
                       >
                          <Edit3 size={18} />
                       </button>
                       <button 
                         onClick={() => deleteAd(ad.id)}
                         className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:shadow-lg transition-all"
                         title="Sever Link"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAds.length === 0 && (
            <div className="py-40 text-center animate-[fadeIn_0.5s_ease-out]">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-inner">
                  <Megaphone size={48} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">No promotional signals detected</h3>
               <p className="text-gray-400 font-medium mt-2 max-w-sm mx-auto">Initialize a new campaign or adjust your categorization filters to monitor fleet activity.</p>
               <button 
                  onClick={() => handleOpenModal()}
                  className="mt-10 px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-gray-200"
               >
                 Start New Network Mission
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Entity Categorization refinement */}
      {isModalOpen && editingAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[95vh] border border-white/20">
            <div className="bg-gray-900 p-12 flex justify-between items-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>
               <div className="flex items-center gap-8 relative z-10">
                  <div className="bg-orange-500 p-6 rounded-[2.5rem] shadow-2xl shadow-orange-500/30 ring-8 ring-white/5">
                    <Megaphone size={40} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter italic">{editingAd.id ? 'Edit Campaign' : 'Initialize Mission'}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-black mt-2">Regional Push Protocol • Security Level: Admin</p>
                  </div>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all border border-white/10"
               >
                  <X size={28} />
               </button>
            </div>

            <div className="p-12 overflow-y-auto bg-gray-50/50 flex-1">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-10">
                     <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative">
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                           <ShieldCheck size={16} /> Identity & Content
                        </h4>
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Mission Headline</label>
                              <input 
                                type="text"
                                value={editingAd.title}
                                onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-black text-gray-900 text-xl italic"
                                placeholder="Catchy, high-impact title..."
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Broadcast Details</label>
                              <textarea 
                                rows={4}
                                value={editingAd.description}
                                onChange={(e) => setEditingAd({...editingAd, description: e.target.value})}
                                className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-bold text-gray-700 resize-none leading-relaxed shadow-inner"
                                placeholder="Tell the region why they should click..."
                              />
                           </div>
                        </div>
                     </section>

                     <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                           <Rocket size={16} /> Target Categorization
                        </h4>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Entity Classification</label>
                              <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                 <button 
                                    onClick={() => setEditingAd({...editingAd, targetType: 'Restaurant', targetId: RESTAURANTS[0].id})}
                                    className={`py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all text-[9px] font-black uppercase tracking-widest ${editingAd.targetType === 'Restaurant' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                                 >
                                    <Utensils size={18} />
                                    Restaurants
                                 </button>
                                 <button 
                                    onClick={() => setEditingAd({...editingAd, targetType: 'Store', targetId: STORES[0].id})}
                                    className={`py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all text-[9px] font-black uppercase tracking-widest ${editingAd.targetType === 'Store' ? 'bg-white text-emerald-600 shadow-md border border-emerald-100' : 'text-gray-400 hover:text-gray-600'}`}
                                 >
                                    <Store size={18} />
                                    Retail Stores
                                 </button>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Linked Terminal</label>
                              <div className="relative group">
                                 <select 
                                   value={editingAd.targetId}
                                   onChange={(e) => setEditingAd({...editingAd, targetId: e.target.value})}
                                   className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 text-sm outline-none appearance-none group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-blue-50 transition-all cursor-pointer"
                                 >
                                    {editingAd.targetType === 'Restaurant' 
                                      ? RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                                      : STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                    }
                                 </select>
                                 <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none rotate-90" size={20} />
                              </div>
                           </div>
                           <div className="col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Fleet Allocation (₱)</label>
                              <div className="relative group">
                                 <PhilippinePeso className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={22} />
                                 <input 
                                   type="number"
                                   value={editingAd.budget}
                                   onChange={(e) => setEditingAd({...editingAd, budget: Number(e.target.value)})}
                                   className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none font-black text-gray-900 text-2xl transition-all focus:bg-white focus:ring-4 focus:ring-orange-50 shadow-inner"
                                   placeholder="0"
                                 />
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">Min: 500</div>
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>

                  <div className="lg:col-span-5 space-y-10">
                     <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h4 className="text-[11px] font-black text-purple-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                           <MonitorPlay size={16} /> Asset Visualization
                        </h4>
                        <div 
                          onClick={handleImageUploadClick}
                          className="relative aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer bg-gray-100 border-8 border-white shadow-2xl"
                        >
                           <img src={editingAd.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all bg-black/40 backdrop-blur-sm">
                              <Upload size={48} className="text-white mb-4 animate-bounce" />
                              <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Upload High-Res Meta</p>
                           </div>
                           <input 
                             type="file"
                             ref={fileInputRef}
                             className="hidden"
                             accept="image/*"
                             onChange={handleImageChange}
                           />
                        </div>
                        <div className="mt-8 flex items-start gap-4 p-5 bg-purple-50 border border-purple-100 rounded-3xl">
                           <span className="text-purple-600 flex-shrink-0"><Info size={20}/></span>
                           <p className="text-[10px] text-purple-800 font-bold leading-relaxed uppercase tracking-wider">
                              Assets must pass <span className="font-black">Regional Compliance Check</span>. 16:9 aspect ratio optimized for Mossy Market Mobile terminals.
                           </p>
                        </div>
                     </section>

                     <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                           <Calendar size={16} /> Deployment Sequence
                        </h4>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Mission Launch</label>
                              <div className="relative group">
                                 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                 <input 
                                   type="date"
                                   value={editingAd.startDate}
                                   onChange={(e) => setEditingAd({...editingAd, startDate: e.target.value})}
                                   className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Sequence Termination</label>
                              <div className="relative group">
                                 <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                                 <input 
                                   type="date"
                                   value={editingAd.endDate}
                                   onChange={(e) => setEditingAd({...editingAd, endDate: e.target.value})}
                                   className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
                                 />
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
               </div>
            </div>

            <div className="p-12 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-8">
               <div className="flex-1 flex gap-6">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-white border border-gray-200 text-gray-600 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                  >
                     Abort Update
                  </button>
                  {editingAd.id && (
                    <button 
                      onClick={() => toggleDisplayStatus(editingAd.id!)}
                      className={`flex-1 py-5 border rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 ${editingAd.status === 'Active' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}
                    >
                       {editingAd.status === 'Active' ? <><Pause size={18} /> Emergency Pause</> : <><Play size={18} /> Force Broadcast</>}
                    </button>
                  )}
               </div>
               <button 
                  onClick={handleSaveAd}
                  disabled={!editingAd.title}
                  className="flex-[1.5] py-5 bg-gray-900 text-white rounded-[1.75rem] font-black uppercase text-[12px] tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-gray-300 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 group"
               >
                  <Save size={24} className="text-orange-500 group-hover:scale-125 transition-transform" />
                  {editingAd.id ? 'Authorize Terminal Commit' : 'Authorize Regional Launch'}
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdsManager;