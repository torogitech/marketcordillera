
import React, { useState } from 'react';
import { User, UserRole, UserStatus, AuditLogEntry } from '../types';
import { USERS, MOCK_AUDIT_LOGS } from '../constants';
import { 
  Search, Plus, Shield, User as UserIcon, Lock, Bell, Mail, 
  Filter, CheckCircle2, XCircle, Clock, Trash2, Edit, Power, 
  X, Phone, UserPlus, Save, ListTodo, Activity, ArrowRight,
  ShieldCheck, Smartphone, Globe, AlertTriangle, Key, Eye, EyeOff,
  Camera, MapPin, Languages, Globe2, CreditCard
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'profile' | 'security' | 'notifications' | 'audit'>('profile');
  const [users, setUsers] = useState<User[]>(USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  
  // Security Tab States
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Current User Profile State (Alvin T.)
  const [profileData, setProfileData] = useState({
    name: 'Alvin T.',
    email: 'saiful.uiux@gmail.com',
    phone: '+63 912 345 6789',
    role: 'Administrator',
    bio: 'Lead System Architect for MarketCordillera Logistics. Managing regional restaurant and store data sync.',
    language: 'English (Philippines)',
    timezone: '(GMT+08:00) Manila, Baguio',
    avatar: 'https://picsum.photos/seed/u1/150'
  });

  const currentUser = USERS[0];

  const addAuditLog = (action: string, type: AuditLogEntry['type'], target: string) => {
    const newLog: AuditLogEntry = {
      id: `l${Date.now()}`,
      actor: { name: currentUser.name, avatar: currentUser.avatar },
      action,
      type,
      target,
      timestamp: 'Just now'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    // Basic logic for the team modal
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus: UserStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        addAuditLog(`Toggled status to ${nextStatus}`, 'Status', u.name);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete && window.confirm(`Are you sure you want to remove ${userToDelete.name} from the team?`)) {
      addAuditLog(`Removed staff account`, 'Delete', userToDelete.name);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Chef': return 'bg-orange-100 text-orange-700';
      case 'Cashier': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'Active': 
        return <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold"><CheckCircle2 size={12} className="mr-1.5"/>Active</span>;
      case 'Inactive': 
        return <span className="flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-semibold"><XCircle size={12} className="mr-1.5"/>Inactive</span>;
      case 'Invited': 
        return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full text-xs font-semibold"><Mail size={12} className="mr-1.5"/>Invited</span>;
    }
  };

  const getLogTypeBadge = (type: AuditLogEntry['type']) => {
    switch (type) {
      case 'Create': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Update': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Status': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Delete': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Security': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={18} /> },
    { id: 'users', label: 'Team & Permissions', icon: <Shield size={18} /> },
    { id: 'audit', label: 'Audit Log', icon: <ListTodo size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const renderProfileTab = () => (
    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
         <div className="relative pt-12 flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="relative group">
              <img src={profileData.avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" alt="Profile" />
              <button className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 pb-2">
               <h2 className="text-3xl font-black text-gray-900">{profileData.name}</h2>
               <p className="text-gray-500 font-bold flex items-center gap-2 mt-1">
                 <Shield size={16} className="text-orange-500" />
                 {profileData.role} • System Administrator
               </p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-100 flex items-center gap-2 mb-2">
               <Save size={18} />
               Save Changes
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Personal Information</h4>
               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
                    <input type="text" value={profileData.name} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-bold text-gray-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                    <input type="email" value={profileData.email} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-bold text-gray-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Phone Number</label>
                    <input type="tel" value={profileData.phone} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-bold text-gray-800" />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Region & Preferences</h4>
               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Bio / Designation</label>
                    <textarea rows={3} defaultValue={profileData.bio} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-medium text-gray-700 resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Language</label>
                      <div className="relative">
                        <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 text-sm font-bold text-gray-800 appearance-none">
                           <option>English (PH)</option>
                           <option>Tagalog</option>
                           <option>Ilocano</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Timezone</label>
                      <div className="relative">
                        <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 text-sm font-bold text-gray-800 appearance-none">
                           <option>UTC+08:00 (Manila)</option>
                           <option>UTC+00:00 (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div onClick={() => setActiveTab('security')} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-orange-200 transition-all cursor-pointer">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <div>
               <p className="font-black text-gray-900 leading-tight">Security Center</p>
               <p className="text-xs text-gray-400 mt-1">Manage passwords & 2FA</p>
            </div>
            <ArrowRight size={18} className="ml-auto text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
         </div>
         <div onClick={() => setActiveTab('notifications')} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-purple-200 transition-all cursor-pointer">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Bell size={24} />
            </div>
            <div>
               <p className="font-black text-gray-900 leading-tight">Notifications</p>
               <p className="text-xs text-gray-400 mt-1">Email & Push config</p>
            </div>
            <ArrowRight size={18} className="ml-auto text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
         </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Security Status Header */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-50 p-5 rounded-3xl text-emerald-600 relative">
            <ShieldCheck size={40} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white"></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Security Standing: Elite</h3>
            <p className="text-sm text-gray-500 font-medium max-w-sm">Your account is utilizing hardware-bound 2FA and encryption protocols.</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-[95%]"></div>
          </div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">95% Account Protection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Password Management */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-gray-900 flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-xl text-gray-600"><Key size={20} /></div>
              Access Credentials
            </h4>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">V.4.2.1-SEC</span>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Current Secret</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-bold transition-all"
                  defaultValue="••••••••••••"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1">New Administrative Password</label>
              <input 
                type="password" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-orange-50 font-bold transition-all"
                placeholder="Must be 12+ characters"
              />
            </div>
            <button className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 mt-2">
              Regenerate Account Key
            </button>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold">
               <Clock size={12} /> Last Rotation: Sept 12, 2024 (Baguio Main Hub)
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-gray-900 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Smartphone size={20} /></div>
              Multi-Factor Protocol
            </h4>
            <div 
              onClick={() => {
                setIs2FAEnabled(!is2FAEnabled);
                addAuditLog(`${!is2FAEnabled ? 'Enabled' : 'Disabled'} 2FA`, 'Security', 'Personal Account');
              }}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 relative shadow-inner ${is2FAEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 absolute top-1 ${is2FAEnabled ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
          
          <div className={`flex-1 flex flex-col justify-center p-8 rounded-[2rem] border-2 border-dashed transition-all ${is2FAEnabled ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' : 'bg-orange-50/50 border-orange-100 text-orange-700'}`}>
            <div className="text-center">
              {is2FAEnabled ? (
                <>
                  <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200/50">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <p className="font-black text-xl mb-1">MFA is Encrypted & Active</p>
                  <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest">Linked: iPhone 15 Pro • Baguio Auth</p>
                </>
              ) : (
                <>
                  <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200/50">
                    <AlertTriangle size={40} className="text-orange-500" />
                  </div>
                  <p className="font-black text-xl mb-1">Protection Compromised</p>
                  <p className="text-xs font-bold text-orange-600/60 uppercase tracking-widest">Enable to secure region data access</p>
                </>
              )}
            </div>
          </div>
          <button className="mt-8 text-sm font-black text-blue-500 hover:text-blue-600 hover:underline transition-all">
             Audit Linked Auth Devices (2)
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <h4 className="text-lg font-black text-gray-900 flex items-center gap-3">
            <Globe size={20} className="text-purple-500" />
            Regional Fleet Sessions
          </h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time presence monitoring</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { device: 'MacBook Pro 14"', browser: 'Admin Console • Baguio City Center', status: 'Primary Node', time: 'Active Now', ip: '112.198.64.12', icon: <Globe className="text-blue-500" /> },
            { device: 'iPhone 15 Pro', browser: 'MarketCordi Mobile • La Trinidad', status: 'Mobile Terminal', time: '8 mins ago', ip: '112.198.65.4', icon: <Smartphone className="text-orange-500" /> },
            { device: 'iPad Pro M2', browser: 'Inventory App • Itogon Logistics', status: 'Field Device', time: '2 days ago', ip: '104.28.156.11', icon: <Smartphone className="text-purple-500" /> },
          ].map((session, i) => (
            <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="bg-gray-100 p-4 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all">
                  {session.icon}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base">{session.device}</p>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">{session.browser}</p>
                  <p className="text-[10px] font-mono text-gray-300 mt-1">{session.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${session.status === 'Primary Node' ? 'text-emerald-500' : 'text-gray-400'}`}>{session.status}</p>
                    <p className="text-xs text-gray-500 font-bold mt-1">{session.time}</p>
                 </div>
                 {session.status !== 'Primary Node' && (
                    <button 
                      onClick={() => {
                        if(window.confirm('Revoke access for this terminal?')) {
                          addAuditLog('Revoked device session', 'Security', session.device);
                        }
                      }}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Forced Logout"
                    >
                      <XCircle size={22} />
                    </button>
                 )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100">
          <button className="text-red-500 text-xs font-black uppercase tracking-[0.2em] hover:text-red-600 transition-colors">
            Terminate all other cloud sessions
          </button>
        </div>
      </div>

      {/* Security Event Log */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-lg font-black text-gray-900 flex items-center gap-3">
            <Activity size={20} className="text-emerald-500" />
            Administrative Event Trace
          </h4>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Download TLS Audit</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">System Action</th>
                <th className="px-8 py-5">Access Point IP</th>
                <th className="px-8 py-5">Gate Status</th>
                <th className="px-8 py-5 text-right">Sequence Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { event: 'Root password rotated (Baguio Terminal)', ip: '112.198.64.12', status: 'Verified', time: '12h ago' },
                { event: 'Geo-fence triggered: Unauthorized IP', ip: '45.12.1.203', status: 'Blocked', time: '2 days ago' },
                { event: 'MFA Recovery Code generated', ip: '112.198.64.12', status: 'Success', time: 'Jan 15, 2024' },
                { event: 'System Integrity Check: 100%', ip: 'Cloud-Internal', status: 'Clean', time: 'Jan 10, 2024' },
              ].map((ev, i) => (
                <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-700 text-sm">{ev.event}</td>
                  <td className="px-8 py-5 text-gray-400 font-mono text-[11px] tracking-tight">{ev.ip}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ev.status === 'Blocked' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-gray-400 text-xs font-bold">{ev.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Settings <span className="text-orange-500">.</span></h1>
           <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Administrative Control Center</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
           <MapPin size={14} className="text-orange-500" />
           Baguio City Main Hub • Oct 2024
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Tab Navigation */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-8 p-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`${activeTab === tab.id ? 'text-orange-500' : 'text-gray-300 group-hover:text-gray-500'} transition-colors`}>
                  {tab.icon}
                </div>
                <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'profile' ? (
             renderProfileTab()
          ) : activeTab === 'users' ? (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Team Intelligence</h2>
                  <p className="text-sm text-gray-400 font-medium">Control regional hub personnel access.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-orange-100 font-black text-sm"
                >
                  <UserPlus size={18} />
                  <span>Onboard Personnel</span>
                </button>
              </div>

              {/* Filters */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search personnel directory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-50 font-medium text-sm shadow-sm transition-all"
                  />
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
                   <Filter size={18} className="text-gray-400" />
                   <select 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      className="text-gray-700 text-sm font-bold outline-none cursor-pointer"
                   >
                      <option value="All">All Tiers</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                   </select>
                </div>
              </div>

              {/* User List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/30 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <tr>
                      <th className="px-8 py-5">Personnel Profile</th>
                      <th className="px-8 py-5">Classification</th>
                      <th className="px-8 py-5">Node Status</th>
                      <th className="px-8 py-5">Last Broadcast</th>
                      <th className="px-8 py-5 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                            <div className="min-w-0">
                              <div className="font-black text-gray-900 text-base truncate">{user.name}</div>
                              <div className="text-xs text-gray-400 font-bold truncate">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center text-gray-500 text-xs font-bold">
                            <Clock size={14} className="mr-2 text-gray-300" />
                            {user.lastActive}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end items-center gap-1">
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2.5 rounded-xl transition-all ${user.status === 'Active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            >
                              <Power size={18} />
                            </button>
                            <button 
                              onClick={() => handleOpenModal(user)}
                              className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
          ) : activeTab === 'audit' ? (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
               <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Access Ledger</h2>
                    <p className="text-sm text-gray-400 font-medium">Verified sequence of administrative events.</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-3xl text-gray-900">
                     <Activity size={28} />
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/30 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                       <tr>
                         <th className="px-8 py-5">Origin Agent</th>
                         <th className="px-8 py-5">Action Sequence</th>
                         <th className="px-8 py-5">Target Node</th>
                         <th className="px-8 py-5">Broadcast Time</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {auditLogs.map((log) => (
                         <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <img src={log.actor.avatar} className="w-9 h-9 rounded-xl border-2 border-white shadow-sm" alt="" />
                                  <span className="text-sm font-black text-gray-900">{log.actor.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getLogTypeBadge(log.type)}`}>
                                     {log.type}
                                  </span>
                                  <span className="text-sm text-gray-600 font-medium">{log.action}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                  <ArrowRight size={14} className="text-orange-500" />
                                  <span className="bg-orange-50 px-2 py-1 rounded text-orange-700">{log.target}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-[11px] text-gray-400 font-black uppercase tracking-wider">
                               {log.timestamp}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
               
               <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                  <button className="text-orange-500 text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors">Retrieve archive logs</button>
               </div>
            </div>
          ) : activeTab === 'security' ? (
            renderSecurityTab()
          ) : (
            <div className="bg-white rounded-[3rem] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center animate-[fadeIn_0.2s_ease-out]">
                 <div className="w-24 h-24 bg-orange-50 text-orange-500 p-6 rounded-[2.5rem] mb-8 shadow-inner">
                    {tabs.find(t => t.id === activeTab)?.icon}
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
                 <p className="text-gray-400 font-medium max-w-sm">This administrative section is undergoing an integrity update. Connectivity will resume shortly.</p>
             </div>
          )}
        </div>
      </div>

      {/* Basic Edit Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
               <h3 className="text-xl font-black italic">Personnel Manager</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
                 <X size={20}/>
               </button>
            </div>
            <div className="p-10 text-center space-y-6">
               <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto">
                 <UserIcon size={32} />
               </div>
               <p className="text-gray-500 font-medium">To modify personnel data, please utilize the field terminal or contact regional HR hub for credential escalation.</p>
               <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all">
                 Acknowledge
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
      `}</style>
    </div>
  );
};

export default Settings;
