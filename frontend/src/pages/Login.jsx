import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userResult = await login(email, password);
    if (userResult) {
      if (['ADMIN', 'MANAGER'].includes(userResult.role)) navigate('/dashboard');
      else if (userResult.role === 'CASHIER') navigate('/billing');
      else if (userResult.role === 'WAITER') navigate('/pos');
      else if (userResult.role === 'KITCHEN') navigate('/kitchen');
      else if (userResult.role === 'CUSTOMER') navigate('/order');
      else navigate('/');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl border-white/10"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-zinc-400">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
          <input
            type="email"
            required
            className="input-field"
            placeholder="admin@zestora.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="input-field pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/20" />
            <span className="text-zinc-400">Remember me</span>
          </label>
          <a href="#" className="text-amber-500 hover:text-amber-400 transition-colors">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 mt-4"
        >
          {loading ? 'Signing in...' : (
            <>
              Sign In <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-zinc-400 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
          Register here
        </Link>
      </p>
      
    </motion.div>
  );
};

export default Login;
