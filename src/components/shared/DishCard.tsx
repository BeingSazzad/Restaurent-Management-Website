'use client';

import React from 'react';
import { MenuItem } from '../../Mockdata';
import { Star, Plus, AlertCircle, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';

interface DishCardProps {
  dish: MenuItem;
  onSelect: (dish: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelect }) => {
  const dispatch = useAppDispatch();
  const favoriteDishIds = useAppSelector((state) => state.favorites.favoriteDishIds);
  const isFavorite = favoriteDishIds.includes(dish.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(dish.id));
  };

  return (
    <div
      onClick={() => dish.isAvailable && onSelect(dish)}
      className={`amber-card overflow-hidden group flex flex-col justify-between bg-white border border-[#EBE2D7] rounded-2xl transition-all duration-300 hover:shadow-lg ${
        !dish.isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F3ECE2]">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Bestseller Badge */}
        {dish.isBestSeller && (
          <div className="absolute top-3 left-3 bg-[#B84A22] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide z-10">
            Bestseller
          </div>
        )}

        {/* Wishlist / Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#EBE2D7] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'fill-[#B84A22] text-[#B84A22]'
                : 'text-[#747474] hover:text-[#B84A22]'
            }`}
          />
        </button>

        {/* Sold out overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-[#B84A22] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5" /> Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Body & Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Title: Standard 16px Poppins, 2-line wrapping with min-height for row alignment */}
          <h3 className="font-semibold text-[16px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-[22px] line-clamp-2 min-h-[44px]">
            {dish.name}
          </h3>

          {/* Dish Description: Standard 13px Poppins, comfortable leading, 2-line clamp */}
          <p className="text-[13px] text-[#747474] leading-[19px] line-clamp-2 min-h-[38px] mt-1.5 mb-3.5">
            {dish.description}
          </p>
        </div>

        {/* Price, Star Rating Pill & Add Button Row */}
        <div className="pt-3 border-t border-[#F0E8DE] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[17px] text-[#1A130E] tracking-tight">
              €{dish.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#5A5048] bg-[#FAF6EF] px-2 py-0.5 rounded-full border border-[#EBE2D7]">
              <Star className="w-3 h-3 fill-[#D49B37] text-[#D49B37]" />
              <span>{dish.rating}</span>
            </div>
          </div>

          {/* Circular Terracotta Add Button with Ergonomic Touch Target */}
          <button
            disabled={!dish.isAvailable}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              dish.isAvailable
                ? 'bg-[#B84A22] hover:bg-[#9E3E1B] text-white shadow-sm hover:scale-110 active:scale-95'
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
