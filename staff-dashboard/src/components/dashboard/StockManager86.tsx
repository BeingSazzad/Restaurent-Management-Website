import React, { useState } from 'react';
import {
  Search,
  X,
  Check,
  AlertTriangle,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDishAvailability, restockAllDishes } from '../../store/slices/stockSlice';
import { formatCurrency } from '../../lib/utils';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';

const getStationBadge = (category: string) => {
  switch (category.toLowerCase()) {
    case 'biryani':
      return {
        label: 'Biryani Station',
        badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
        dot: 'bg-amber-500',
      };
    case 'curries':
      return {
        label: 'Curries Station',
        badge: 'bg-orange-50 text-orange-800 border-orange-200/80',
        dot: 'bg-orange-500',
      };
    case 'grill':
      return {
        label: 'Grill Station',
        badge: 'bg-rose-50 text-rose-800 border-rose-200/80',
        dot: 'bg-rose-500',
      };
    case 'vegetarian':
      return {
        label: 'Veg Station',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dot: 'bg-emerald-500',
      };
    case 'breads':
      return {
        label: 'Breads Station',
        badge: 'bg-stone-100 text-stone-700 border-stone-200',
        dot: 'bg-stone-500',
      };
    default:
      return {
        label: `${category} Station`,
        badge: 'bg-stone-100 text-stone-700 border-stone-200',
        dot: 'bg-stone-400',
      };
  }
};

export function StockManager86() {
  const dispatch = useAppDispatch();
  const { dishes } = useAppSelector((state) => state.stock);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
        description="Standard kitchen inventory & live menu item 86 management."
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

      {/* KPI Stats Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Menu Items
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{dishes.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              In Stock (Active)
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">
              {dishes.length - soldOutCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`border rounded-2xl p-3.5 flex items-center justify-between shadow-2xs transition-colors ${
            soldOutCount > 0 ? 'bg-rose-50/50 border-rose-200/80' : 'bg-white border-stone-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              86&apos;d (Sold Out)
            </p>
            <p
              className={`text-2xl font-bold mt-0.5 ${
                soldOutCount > 0 ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {soldOutCount}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              soldOutCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-stone-100 text-stone-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standard Unified Toolbar (Search, Filter Tabs, View Switcher) */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dish by name or station..."
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

        {/* Filter Controls: Category, Availability, & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
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
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('in_stock')}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'in_stock'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStatusFilter('sold_out')}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'sold_out'
                  ? 'bg-white text-rose-700 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              Sold Out ({soldOutCount})
            </button>
          </div>

          {/* View Switcher: Table List (default) vs Grid Cards */}
          <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
              title="Table View (Standard)"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredDishes.length === 0 && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center text-stone-400 shadow-2xs">
          <Search className="w-8 h-8 text-stone-300 mx-auto mb-2.5" />
          <h4 className="font-semibold text-sm text-stone-800">No dishes found</h4>
          <p className="text-xs text-stone-500 mt-1">
            No items match &quot;{searchQuery}&quot; with selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
            className="mt-3 text-xs text-[#F15A24] hover:underline font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Primary Standard Table View */}
      {filteredDishes.length > 0 && viewMode === 'table' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/90 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Dish & Details</th>
                  <th className="py-3.5 px-4 font-semibold">Kitchen Station</th>
                  <th className="py-3.5 px-4 font-semibold">Unit Price</th>
                  <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Instant 86 Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredDishes.map((dish) => {
                  const inStock = dish.isAvailable;
                  const station = getStationBadge(dish.category);

                  return (
                    <tr
                      key={dish.id}
                      className={`group transition-colors ${
                        inStock
                          ? 'hover:bg-amber-50/20 bg-white'
                          : 'bg-rose-50/25 hover:bg-rose-50/45'
                      }`}
                    >
                      {/* Dish & Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className={`w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200/80 ${
                              inStock ? '' : 'grayscale-[40%] opacity-80'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`font-semibold text-sm truncate leading-snug ${
                                  inStock ? 'text-stone-900' : 'text-stone-400 line-through'
                                }`}
                              >
                                {dish.name}
                              </h4>
                              {!inStock && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-100/80 px-1.5 py-0.5 rounded-md">
                                  86&apos;d
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1 max-w-sm">
                              {dish.description || `${dish.categoryLabel} kitchen prep item`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kitchen Station */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${station.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${station.dot}`} />
                          {station.label}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-stone-900 text-[13.5px]">
                          {formatCurrency(dish.price)}
                        </span>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {inStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            86&apos;d (Sold Out)
                          </span>
                        )}
                      </td>

                      {/* Instant 86 Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={inStock}
                            onClick={() => dispatch(toggleDishAvailability(dish.id))}
                            className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              inStock
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-stone-300 hover:bg-rose-400'
                            }`}
                            title={
                              inStock
                                ? 'Click to 86 item (out of stock)'
                                : 'Click to restore item to In Stock'
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                                inStock ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            >
                              {inStock ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <X className="w-3 h-3 text-stone-400" />
                              )}
                            </span>
                          </button>

                          {/* Action Button */}
                          <button
                            onClick={() => dispatch(toggleDishAvailability(dish.id))}
                            className={`h-7.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              inStock
                                ? 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 hover:border-rose-200 border border-stone-200/60'
                                : 'bg-rose-600 hover:bg-emerald-600 text-white shadow-2xs'
                            }`}
                          >
                            {inStock ? (
                              <>
                                <AlertTriangle className="w-3 h-3 text-stone-400 group-hover:text-rose-600" />
                                <span>86 Item</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                <span>Restock</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary Breakdown */}
          <div className="bg-stone-50/70 border-t border-stone-200/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
            <div>
              Showing <span className="font-semibold text-stone-700">{filteredDishes.length}</span> of{' '}
              <span className="font-semibold text-stone-700">{dishes.length}</span> items
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <strong className="text-stone-700">{dishes.length - soldOutCount}</strong> In Stock
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <strong className="text-stone-700">{soldOutCount}</strong> 86&apos;d
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Optional Grid Cards View */}
      {filteredDishes.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
          {filteredDishes.map((dish) => {
            const inStock = dish.isAvailable;
            const station = getStationBadge(dish.category);

            return (
              <div
                key={dish.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                  inStock
                    ? 'bg-white border-stone-200/90 hover:border-stone-300'
                    : 'bg-rose-50/20 border-rose-200/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className={`w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200/80 ${
                      inStock ? '' : 'grayscale-[40%]'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80';
                    }}
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
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${station.badge}`}>
                        {station.label}
                      </span>
                      <span>·</span>
                      <span
                        className={`inline-flex items-center gap-1 font-medium text-xs ${
                          inStock ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inStock ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {inStock ? 'In Stock' : '86 Sold Out'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(toggleDishAvailability(dish.id))}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    inStock
                      ? 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 border border-stone-200/80'
                      : 'bg-rose-600 hover:bg-emerald-600 text-white shadow-2xs'
                  }`}
                >
                  {inStock ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-white" />
                      <span>86&apos;d</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
