import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glass rounded-xl overflow-hidden shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
