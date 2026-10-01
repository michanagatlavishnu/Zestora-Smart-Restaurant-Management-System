import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090B]";
  
  const variants = {
    primary: "bg-[#F59E0B] hover:bg-[#D97706] text-black shadow-lg shadow-[#F59E0B]/20 focus:ring-[#F59E0B]",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 focus:ring-zinc-700",
    outline: "bg-transparent hover:bg-white/5 text-[#F59E0B] border border-[#F59E0B]/50 focus:ring-[#F59E0B]",
    ghost: "bg-transparent hover:bg-white/5 text-zinc-300 focus:ring-zinc-700"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
