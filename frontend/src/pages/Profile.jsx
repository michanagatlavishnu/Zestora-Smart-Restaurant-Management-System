import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Save, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await axios.put('/auth/profile', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      });
      setUser(res.data.user);
      toast.success(res.data.message || 'Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setSavingPassword(true);
    try {
      const res = await axios.put('/auth/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully. Please login again.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Optionally force re-login
      setTimeout(() => logout(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
    setSavingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-zinc-400">View and manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-white/5 overflow-hidden h-fit"
        >
          <div className="p-8 flex flex-col items-center text-center border-b border-white/5 bg-white/[0.02]">
            <div className="w-28 h-28 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-5xl border-2 border-amber-500/30 mb-4 shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-zinc-400 mb-4">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 shadow-inner">
              <Shield size={14} className="text-amber-500" /> {user?.role}
            </span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-zinc-300">
              <Mail size={18} className="text-zinc-500" />
              <div className="text-sm">
                <p className="text-zinc-500 text-xs">Email</p>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <Phone size={18} className="text-zinc-500" />
              <div className="text-sm">
                <p className="text-zinc-500 text-xs">Phone</p>
                <p>{user?.phone || <span className="italic text-zinc-500">Not provided</span>}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Profile Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-white/5 overflow-hidden p-6 sm:p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-amber-500" /> Edit Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Change Password Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-white/5 overflow-hidden p-6 sm:p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={20} className="text-amber-500" /> Security
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="input-field pr-10"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      required
                      minLength={6}
                      className="input-field pr-10"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm New Password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="input-field"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={savingPassword} className="btn-primary flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 border-zinc-600">
                  <Lock size={18} />
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
