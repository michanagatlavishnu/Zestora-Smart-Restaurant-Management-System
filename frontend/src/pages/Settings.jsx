import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Store, Receipt, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    restaurant_name: '',
    address: '',
    phone: '',
    email: '',
    gst_percentage: '',
    service_charge_percentage: '',
    currency: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/settings');
        setSettings(res.data);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-zinc-400 text-sm">Configure restaurant details and system preferences</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-64 shrink-0 flex flex-col gap-2">
          <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'general' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'glass hover:bg-white/5 text-zinc-300'}`}>
            <Store size={18} /> General Info
          </button>
          <button onClick={() => setActiveTab('billing')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'billing' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'glass hover:bg-white/5 text-zinc-300'}`}>
            <Receipt size={18} /> Billing & Taxes
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'notifications' ? 'bg-amber-500 text-zinc-950 font-semibold' : 'glass hover:bg-white/5 text-zinc-300'}`}>
            <Bell size={18} /> Notifications
          </button>
        </div>

        <div className="flex-1 glass rounded-2xl border border-white/5 p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            
            {activeTab === 'general' && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">Restaurant Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Restaurant Name</label>
                    <input type="text" name="restaurant_name" value={settings.restaurant_name} onChange={handleChange} className="input-field" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
                    <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Contact Email</label>
                    <input type="email" name="email" value={settings.email} onChange={handleChange} className="input-field" />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Address</label>
                    <textarea name="address" value={settings.address} onChange={handleChange} className="input-field min-h-[100px] resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">Billing & Taxation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Currency (Symbol/Code)</label>
                    <input type="text" name="currency" value={settings.currency} onChange={handleChange} className="input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">GST Percentage (%)</label>
                    <input type="number" step="0.01" name="gst_percentage" value={settings.gst_percentage} onChange={handleChange} className="input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Service Charge (%)</label>
                    <input type="number" step="0.01" name="service_charge_percentage" value={settings.service_charge_percentage} onChange={handleChange} className="input-field" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 flex-1 text-zinc-400">
                 <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">Notification Preferences</h3>
                 <p>Notification settings will be implemented in a future update.</p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary w-auto flex items-center gap-2 px-8">
                {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
