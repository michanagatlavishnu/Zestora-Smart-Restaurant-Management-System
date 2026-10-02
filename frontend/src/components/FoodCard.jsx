import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { getFoodImage } from '../utils/foodImages';
import toast from 'react-hot-toast';
import { Clock, Flame, Star, ThumbsUp, Utensils } from 'lucide-react';

const FoodCard = ({ item, onAdd }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = getFoodImage(item.name);

  const [quantity, setQuantity] = useState(1);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd({ ...item, quantity });
    toast.success(`${quantity} ${item.name} added to cart`);
    setQuantity(1);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col h-full shadow-lg relative bg-white/5"
    >
      <div className="relative h-48 w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
        {(!imgSrc || imgError) ? (
          <div className="flex flex-col items-center justify-center text-zinc-600 opacity-50">
            <Utensils size={48} className="mb-2" />
            <span className="text-xs font-semibold tracking-wider uppercase">No Image</span>
          </div>
        ) : (
          <img 
            src={imgSrc} 
            alt={item.name}
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_popular && (
            <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
              <Star size={12} fill="currentColor" /> Popular
            </span>
          )}
          {item.is_recommended && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
              <ThumbsUp size={12} /> Recommended
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          {item.is_veg !== undefined && (
             <div className="w-6 h-6 bg-white rounded flex items-center justify-center p-1 shadow">
               <div className={`w-3 h-3 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></div>
             </div>
          )}
        </div>
        
        <div className="absolute bottom-2 left-2 flex gap-2">
          {item.prep_time && (
            <span className="bg-black/70 backdrop-blur-md text-zinc-200 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
              <Clock size={12} /> {item.prep_time}m
            </span>
          )}
          {item.is_spicy && (
            <span className="bg-red-500/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
              <Flame size={12} /> Spicy
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{item.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-[#F59E0B]">₹{item.price ? Number(item.price).toFixed(2) : '0.00'}</span>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-2 py-1">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }} 
                className="text-zinc-300 hover:text-white px-2 py-1 text-lg font-bold"
              >
                -
              </button>
              <span className="text-white font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(quantity + 1); }} 
                className="text-zinc-300 hover:text-white px-2 py-1 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
          <Button variant="outline" onClick={handleAdd} className="w-full">
            ADD TO CART
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
