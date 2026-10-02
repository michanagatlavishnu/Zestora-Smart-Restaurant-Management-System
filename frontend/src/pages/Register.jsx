import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    const success = await register(formData);
    if (success) {
      navigate('/order');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-zinc-400">Join ZESTORA as a customer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
          <input
            type="text"
            name="name"
            required
            className="input-field"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="input-field"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            className="input-field"
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            required
            className="input-field"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="input-field"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-6"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-8 text-center text-zinc-400 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
