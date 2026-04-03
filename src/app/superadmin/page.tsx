"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Plus, Edit, Trash2, LayoutDashboard, Database, TrendingUp, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('users'); // Set default to users
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState('cms_user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New User Form State
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    const savedRole = localStorage.getItem('admin_role');
    if (auth === 'true' && savedRole === 'superadmin') {
      setIsAuthorized(true);
      setRole(savedRole);
      fetchAllData(savedRole);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllData = async (currentRole: string) => {
    setLoading(true);
    try {
      const promises = [
        fetch('/api/properties').then(r => r.json()),
        fetch('/api/leads').then(r => r.json())
      ];
      
      if (currentRole === 'superadmin') {
        promises.push(fetch('/api/users').then(r => r.json()));
      }

      const results = await Promise.all(promises);
      setProperties(results[0]);
      setLeads(results[1]);
      if (currentRole === 'superadmin') setUsers(results[2]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success && data.role === 'superadmin') {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_role', data.role);
        setIsAuthorized(true);
        setRole(data.role);
        fetchAllData(data.role);
      } else if (data.success) {
        alert('Access Denied: You are not a Super Admin.');
      } else {
        alert(data.error || 'Invalid Credentials');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([data, ...users]);
        setNewUser({ username: '', password: '' });
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData(role);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 text-left">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Master Console</h1>
            <p className="text-blue-200 text-center mb-8 text-sm">Super Admin access required</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Username (e.g. superadmin)" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 mt-2">
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1628] font-sans text-left">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10 text-orange-500" /> Executive Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-left">Master control center for Digital Broker.</p>
          </div>
          <div className="flex gap-4">
             {/* Tabs removed for Super Admin view */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0a1628]">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Assets</p>
                <p className="text-3xl font-black text-left">{properties.length}</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 text-left">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Total Leads</p>
                <p className="text-3xl font-black text-left">{leads.length}</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 text-left">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <TrendingUp className="w-7 h-7 text-left" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Active ROI</p>
                <p className="text-3xl font-black text-left">8.4%</p>
              </div>
           </div>
        </div>

        {/* Users Table */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-left p-8">
             <h3 className="text-xl font-bold text-[#0a1628] mb-6">CMS Users Management</h3>
             <div className="flex gap-4 mb-8 bg-gray-50 p-6 rounded-2xl">
               <input 
                  type="text" 
                  placeholder="New Username" 
                  className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none w-1/3 text-gray-800"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
               />
               <input 
                  type="password" 
                  placeholder="New Password" 
                  className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none w-1/3 text-gray-800"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
               />
               <button 
                  onClick={handleCreateUser}
                  disabled={creatingUser || !newUser.username || !newUser.password}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-2 font-bold text-sm transition-colors disabled:opacity-50"
               >
                 {creatingUser ? 'Creating...' : 'Add User'}
               </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                     <th className="px-4 py-5">Username</th>
                     <th className="px-4 py-5">Role</th>
                     <th className="px-4 py-5 font-medium">Created Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {users.map((u: any) => (
                     <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-4 py-6 font-bold">{u.username}</td>
                       <td className="px-4 py-6">
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           {u.role.replace('_', ' ')}
                         </span>
                       </td>
                       <td className="px-4 py-6 text-gray-400 text-xs">
                         {new Date(u.createdAt).toLocaleDateString()}
                       </td>
                     </tr>
                   ))}
                   {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-sm">
                          No CMS users generated yet. Create one above to get started. 
                        </td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
      </div>
    </div>
  );
}
