import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // This is a basic display profile for now.
  // In a full implementation, this would allow editing name, phone, password.

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-zinc-400 text-sm">View and manage your account details</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-4xl border-2 border-amber-500/30">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-zinc-400 mb-2">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300">
              <Shield size={12} className="text-amber-500" /> {user?.role}
            </span>
          </div>
        </div>

        <div className="p-8 text-zinc-400">
          <p className="mb-4">Profile editing functionality will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
