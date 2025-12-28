
import React, { useState } from 'react';
import { User, UserRole, UserStatus, AuditLogEntry } from '../types';
import { USERS, MOCK_AUDIT_LOGS } from '../constants';
import { 
  Search, Plus, Shield, User as UserIcon, Lock, Bell, Mail, 
  Filter, CheckCircle2, XCircle, Clock, Trash2, Edit, Power, 
  X, Phone, UserPlus, Save, ListTodo, Activity, ArrowRight
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'profile' | 'security' | 'notifications' | 'audit'>('users');
  const [users, setUsers] = useState<User[]>(USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User Form State
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Staff',
    status: 'Active',
    phone: ''
  });

  const currentUser = USERS[0]; // Assuming Alvin T. is the current user

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
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Staff', status: 'Active', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
      addAuditLog(`Updated profile details`, 'Update', formData.name || 'User');
    } else {
      // Add new
      const id = `u${Date.now()}`;
      const newUser: User = {
        id,
        name: formData.name || 'New User',
        email: formData.email || '',
        role: formData.role as UserRole,
        status: formData.status as UserStatus,
        lastActive: 'Never',
        phone: formData.phone,
        avatar: `https://picsum.photos/seed/${id}/150`
      };
      setUsers([newUser, ...users]);
      addAuditLog(`Created new staff account`, 'Create', newUser.name);
    }
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

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your back-office preferences and manage your team.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8 p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'users' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">User Management</h2>
                  <p className="text-sm text-gray-500">Add, edit, or deactivate staff accounts.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-200 text-sm font-bold"
                >
                  <UserPlus size={18} />
                  <span>Invite New Staff</span>
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 text-sm shadow-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                   <Filter size={18} className="text-gray-400" />
                   <select 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 outline-none cursor-pointer shadow-sm min-w-[140px]"
                   >
                      <option value="All">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Chef">Chef</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Staff">Staff</option>
                   </select>
                </div>
              </div>

              {/* User List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.1em] font-bold">
                    <tr>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Login</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 text-sm truncate">{user.name}</div>
                              <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock size={12} className="mr-1.5 text-gray-400" />
                            {user.lastActive}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center space-x-1">
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                              className={`p-2 rounded-lg transition-colors ${user.status === 'Active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                            >
                              <Power size={16} />
                            </button>
                            <button 
                              onClick={() => handleOpenModal(user)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                               <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-gray-900 font-bold">No results found</h3>
                            <p className="text-gray-500 text-sm mt-1">We couldn't find any users matching your criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'audit' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">System Activity Audit</h2>
                    <p className="text-sm text-gray-500">A detailed log of all back-office administrative actions.</p>
                  </div>
                  <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                     <Activity size={24} />
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.1em] font-bold">
                       <tr>
                         <th className="px-6 py-4">Performed By</th>
                         <th className="px-6 py-4">Action</th>
                         <th className="px-6 py-4">Target Entity</th>
                         <th className="px-6 py-4">Timestamp</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {auditLogs.map((log) => (
                         <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <img src={log.actor.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="" />
                                  <span className="text-sm font-semibold text-gray-800">{log.actor.name}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getLogTypeBadge(log.type)}`}>
                                     {log.type}
                                  </span>
                                  <span className="text-sm text-gray-600">{log.action}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                  <ArrowRight size={14} className="text-gray-300" />
                                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{log.target}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                               {log.timestamp}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
               
               <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors">Load Older Entries</button>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-20 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-orange-50 text-orange-500 p-6 rounded-3xl mb-6">
                    {tabs.find(t => t.id === activeTab)?.icon}
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
                 <p className="text-gray-500 max-w-sm">This section is being updated with the latest security protocols. Please come back soon!</p>
             </div>
          )}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                     {editingUser ? <Edit size={20}/> : <UserPlus size={20}/>}
                  </div>
                  <h3 className="font-bold text-gray-900">{editingUser ? 'Edit Team Member' : 'Invite New Staff'}</h3>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                 <X size={20}/>
               </button>
            </div>
            
            <div className="p-8 space-y-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                     <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                     <input 
                        type="text" 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-all"
                        placeholder="e.g. Michael Jordan"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                     <input 
                        type="email" 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-all"
                        placeholder="staff@restaurant.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Contact Number</label>
                  <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                     <input 
                        type="tel" 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-sm font-medium bg-gray-50 focus:bg-white transition-all"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Assigned Role</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-sm font-medium bg-gray-50 focus:bg-white cursor-pointer transition-all"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                      >
                         <option value="Admin">Admin</option>
                         <option value="Manager">Manager</option>
                         <option value="Cashier">Cashier</option>
                         <option value="Chef">Chef</option>
                         <option value="Waiter">Waiter</option>
                         <option value="Staff">Staff</option>
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">User Status</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none text-sm font-medium bg-gray-50 focus:bg-white cursor-pointer transition-all"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      >
                         <option value="Active">Active</option>
                         <option value="Inactive">Inactive</option>
                         <option value="Invited">Invited</option>
                      </select>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white transition-all text-sm"
               >
                  Cancel
               </button>
               <button 
                  onClick={handleSaveUser}
                  disabled={!formData.name || !formData.email}
                  className="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all text-sm disabled:opacity-50 shadow-lg shadow-orange-200 flex items-center space-x-2"
               >
                  <Save size={18}/>
                  <span>{editingUser ? 'Update Profile' : 'Send Invitation'}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
