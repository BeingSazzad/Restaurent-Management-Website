'use client';

import React from 'react';
import { MenuItem } from '../../Mockdata';
import { Star, Plus, AlertCircle } from 'lucide-react';

interface DishCardProps {
  dish: MenuItem;
  onSelect: (dish: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelect }) => {
  return (
    <div
      onClick={() => dish.isAvailable && onSelect(dish)}
      className={`amber-card overflow-hidden group flex flex-col justify-between ${
        !dish.isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3ECE2]">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Bestseller Badge */}
        {dish.isBestSeller && (
          <div className="absolute top-3 left-3 bg-[#B84A22] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            Bestseller
          </div>
        )}

        {/* Sold out overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-[#B84A22] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-sm text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-snug line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-xs text-[#786960] line-clamp-2 mt-1 mb-3">
            {dish.description}
          </p>
        </div>

        {/* Price, Star Rating & Circular Add Button */}
        <div className="pt-2 border-t border-[#EBE2D7]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#1A130E]">
              €{dish.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#B84A22]">
              <Star className="w-3 h-3 fill-[#D49B37] text-[#D49B37]" />
              <span>{dish.rating}</span>
            </div>
          </div>

          {/* Circular Terracotta Add Button (Matching Image) */}
          <button
            disabled={!dish.isAvailable}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              dish.isAvailable
                ? 'bg-[#B84A22] hover:bg-[#9E3E1B] text-white shadow-sm hover:scale-105'
                : 'bg-[#E0D7CC] text-[#786960] cursor-not-allowed'
            }`}
            aria-label={`Add ${dish.name} to order`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
