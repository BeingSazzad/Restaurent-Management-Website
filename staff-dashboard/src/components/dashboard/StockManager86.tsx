import React, { useState } from 'react';
import { Search, X, Check, AlertTriangle, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDishAvailability, restockAllDishes } from '../../store/slices/stockSlice';
import { formatCurrency } from '../../lib/utils';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';

export function StockManager86() {
  const dispatch = useAppDispatch();
  const { dishes } = useAppSelector((state) => state.stock);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');

  const soldOutCount = dishes.filter((d) => !d.isAvailable).length;

  const filteredDishes = dishes.filter((dish) => {
    if (categoryFilter !== 'all' && dish.category !== categoryFilter) return false;
    if (statusFilter === 'in_stock' && !dish.isAvailable) return false;
    if (statusFilter === 'sold_out' && dish.isAvailable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!dish.name.toLowerCase().includes(q) && !dish.categoryLabel.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="86 Inventory"
        description="Mark menu items as in stock or sold out."
        badge={
          <span className="text-xs text-stone-500 font-medium">
            ({dishes.length - soldOutCount} in stock · {soldOutCount} sold out)
          </span>
        }
        action={
          soldOutCount > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => dispatch(restockAllDishes())}
            >
              Restock All ({soldOutCount})
            </Button>
          ) : undefined
        }
      />

      {/* Standard Unified Toolbar Card (Equal h-10 height across controls) */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dish by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-11 pr-10 text-[13.5px] font-medium text-stone-900 placeholder:text-stone-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls: Category & Availability (Equal h-10 height) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Categories Segmented Control */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto overflow-y-hidden scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'biryani', label: 'Biryani' },
              { id: 'curries', label: 'Curries' },
              { id: 'grill', label: 'Grill' },
              { id: 'vegetarian', label: 'Vegetarian' },
              { id: 'breads', label: 'Breads' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === c.id
                    ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Status Segmented Control */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('in_stock')}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'in_stock'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStatusFilter('sold_out')}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'sold_out'
                  ? 'bg-white text-rose-700 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              Sold Out ({soldOutCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-2">
        {filteredDishes.map((dish) => {
          const inStock = dish.isAvailable;

          return (
            <div
              key={dish.id}
              className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                inStock
                  ? 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs'
                  : 'bg-rose-50/20 border-rose-200/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className={`w-11 h-11 rounded-lg object-cover shrink-0 ${
                    inStock ? '' : 'grayscale-[40%]'
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold text-xs sm:text-sm truncate leading-snug ${
                        inStock ? 'text-stone-900' : 'text-stone-400 line-through'
                      }`}
                    >
                      {dish.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#B84A22] shrink-0">
                      {formatCurrency(dish.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                    <span>{dish.categoryLabel} Station</span>
                    <span>·</span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        inStock ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          inStock ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {inStock ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(toggleDishAvailability(dish.id))}
                className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  inStock
                    ? 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700'
                    : 'bg-rose-600 hover:bg-emerald-600 text-white'
                }`}
              >
                {inStock ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>Sold Out</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
