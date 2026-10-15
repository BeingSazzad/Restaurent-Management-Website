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
      className={`group flex flex-col justify-between bg-white border border-[#E5E5E5] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        !dish.isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[rgb(249,249,249)]">
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
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E5E5] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm z-10"
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
          {/* Dish Title: Bold 17px/18px Poppins */}
          <h3 className="font-semibold text-[16px] sm:text-[17px] text-[#1A130E] group-hover:text-[#B84A22] transition-colors leading-[23px] line-clamp-2 min-h-[46px]">
            {dish.name}
          </h3>

          {/* Dish Description: Clear 13px/14px Poppins with comfortable line height */}
          <p className="text-[13px] sm:text-[14px] text-[#555555] leading-[20px] sm:leading-[21px] line-clamp-2 min-h-[40px] mt-1.5 mb-3.5">
            {dish.description}
          </p>
        </div>

        {/* Price, Star Rating Pill & Add Button Row */}
        <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[18px] sm:text-[19px] text-[#1A130E] tracking-tight">
              €{dish.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[12px] font-semibold text-[#1A130E] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E5E5] shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#D49B37] text-[#D49B37]" />
              <span>{dish.rating}</span>
            </div>
          </div>

          {/* Sunset Orange Gradient Add Button */}
          <button
            disabled={!dish.isAvailable}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              dish.isAvailable
                ? 'bg-gradient-to-r from-[#FBA138] to-[#F15A24] hover:from-[#F59828] hover:to-[#E54E18] text-white shadow-sm hover:scale-105 active:scale-95'
                : 'bg-[#E5E5E5] text-[#999999] cursor-not-allowed'
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
