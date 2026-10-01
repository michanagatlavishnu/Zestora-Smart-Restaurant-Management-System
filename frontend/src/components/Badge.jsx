import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border border-white/10",
    primary: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
