import React, { useState, useEffect } from 'react';
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
  Plus,
  Box,
  Layers,
  TrendingDown,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  toggleDishAvailability,
  restockAllDishes,
  adjustRawStock,
  restockRawToPar,
  addRawIngredient,
  syncStockFromStorage,
} from '../../store/slices/stockSlice';
import { RawIngredientItem } from '../../types/common.types';
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

const getIngredientCategoryBadge = (cat: string) => {
  switch (cat) {
    case 'protein':
      return { label: 'Meat & Poultry', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' };
    case 'dairy':
      return { label: 'Dairy & Fats', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' };
    case 'grain':
      return { label: 'Grains & Dry Goods', bg: 'bg-orange-50 text-orange-700 border-orange-200/80' };
    case 'spice_produce':
      return { label: 'Spices & Produce', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
    case 'packaging':
      return { label: 'Packaging & Supplies', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
    case 'beverage':
      return { label: 'Beverages & Syrups', bg: 'bg-blue-50 text-blue-700 border-blue-200/80' };
    default:
      return { label: 'General Stock', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
  }
};

export function StockManager86() {
  const dispatch = useAppDispatch();
  const { dishes, rawIngredients } = useAppSelector((state) => state.stock);

  // Sync on mount or when storage updates
  useEffect(() => {
    const handleSync = () => dispatch(syncStockFromStorage());
    window.addEventListener('amber_spice_menu_updated', handleSync);
    window.addEventListener('amber_spice_raw_updated', handleSync);
    return () => {
      window.removeEventListener('amber_spice_menu_updated', handleSync);
      window.removeEventListener('amber_spice_raw_updated', handleSync);
    };
  }, [dispatch]);

  // Main Section Tab: 'dishes_86' | 'raw_inventory'
  const [activeInventoryTab, setActiveInventoryTab] = useState<'dishes_86' | 'raw_inventory'>('dishes_86');

  // Dish Tab Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Raw Inventory Filters
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const [rawCategoryFilter, setRawCategoryFilter] = useState('all');
  const [rawStatusFilter, setRawStatusFilter] = useState<'all' | 'healthy' | 'low_stock' | 'out_of_stock'>('all');

  // Add Raw Ingredient Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngCat, setNewIngCat] = useState<RawIngredientItem['category']>('protein');
  const [newIngStock, setNewIngStock] = useState<number>(10);
  const [newIngPar, setNewIngPar] = useState<number>(15);
  const [newIngUnit, setNewIngUnit] = useState('kg');
  const [newIngCost, setNewIngCost] = useState<number>(5.5);
  const [newIngSupplier, setNewIngSupplier] = useState('');

  // Counts
  const soldOutCount = dishes.filter((d) => !d.isAvailable).length;
  const lowStockRawCount = rawIngredients.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const outOfStockRawCount = rawIngredients.filter((i) => i.status === 'out_of_stock').length;

  // Filtered Dishes
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

  // Filtered Raw Ingredients
  const filteredRaw = rawIngredients.filter((item) => {
    if (rawCategoryFilter !== 'all' && item.category !== rawCategoryFilter) return false;
    if (rawStatusFilter !== 'all' && item.status !== rawStatusFilter) return false;
    if (rawSearchQuery.trim()) {
      const q = rawSearchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.supplier.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;

    const newItem: RawIngredientItem = {
      id: `ing-${Date.now()}`,
      name: newIngName.trim(),
      category: newIngCat,
      categoryLabel: getIngredientCategoryBadge(newIngCat).label,
      currentStock: Number(newIngStock) || 0,
      parLevel: Number(newIngPar) || 1,
      unit: newIngUnit.trim() || 'kg',
      unitCost: Number(newIngCost) || 0,
      supplier: newIngSupplier.trim() || 'Dublin Wholesale Supplies',
      lastRestocked: new Date().toISOString().split('T')[0],
      status: Number(newIngStock) <= 0 ? 'out_of_stock' : Number(newIngStock) <= Number(newIngPar) ? 'low_stock' : 'healthy',
    };

    dispatch(addRawIngredient(newItem));
    setIsAddModalOpen(false);
    setNewIngName('');
    setNewIngSupplier('');
  };

  return (
    <div className="space-y-5 text-[#1A130E]">
      {/* Page Header */}
      <PageHeader
        title="Inventory & 86"
        description="Stock levels, ingredient par counts, and 86 availability."
        action={
          activeInventoryTab === 'dishes_86' && soldOutCount > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => dispatch(restockAllDishes())}
            >
              Restock All ({soldOutCount})
            </Button>
          ) : activeInventoryTab === 'raw_inventory' ? (
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Ingredient
            </Button>
          ) : undefined
        }
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Menu Dishes Metric */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Menu Items
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{dishes.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {dishes.length - soldOutCount} active · {soldOutCount} 86&apos;d
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* 86 Dishes Metric */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between shadow-2xs transition-colors ${
            soldOutCount > 0 ? 'bg-rose-50/50 border-rose-200/80' : 'bg-white border-stone-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Sold Out (86)
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${soldOutCount > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
              {soldOutCount}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Unavailable on menu</p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              soldOutCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-stone-100 text-stone-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Raw Ingredients Metric */}
        <div
          className={`border rounded-2xl p-4 flex items-center justify-between shadow-2xs transition-colors ${
            lowStockRawCount > 0 ? 'bg-amber-50/50 border-amber-200/80' : 'bg-white border-stone-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Low Stock
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${lowStockRawCount > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
              {lowStockRawCount}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {outOfStockRawCount > 0 ? `${outOfStockRawCount} out of stock` : 'Below par level'}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              lowStockRawCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Raw Inventory Tracked Metric */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Ingredients
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{rawIngredients.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {rawIngredients.length - lowStockRawCount} healthy stock
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Box className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveInventoryTab('dishes_86')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeInventoryTab === 'dishes_86'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Menu Dishes (86 List)</span>
          {soldOutCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
              {soldOutCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveInventoryTab('raw_inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeInventoryTab === 'raw_inventory'
              ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Raw Ingredients &amp; Supplies</span>
          {lowStockRawCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {lowStockRawCount}
            </span>
          )}
        </button>
      </div>

      {/* ================= SECTION 1: MENU DISHES 86 MANAGEMENT ================= */}
      {activeInventoryTab === 'dishes_86' && (
        <div className="space-y-4">
          {/* Unified Toolbar (Search, Filter Tabs, View Switcher) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dish by name or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-11 pr-10 text-[13px] font-medium text-stone-900 placeholder:text-stone-400 transition-all outline-none"
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
              {/* Categories */}
              <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto scrollbar-none">
                {[
                  { id: 'all', label: 'All Stations' },
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
                  86&apos;d ({soldOutCount})
                </button>
              </div>

              {/* View Switcher: Table List vs Grid Cards */}
              <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 shrink-0">
                <button
                  onClick={() => setViewMode('table')}
                  className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table View */}
          {filteredDishes.length > 0 && viewMode === 'table' && (
            <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200/90 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold">Dish &amp; Station</th>
                      <th className="py-3.5 px-4 font-semibold">Prep Station</th>
                      <th className="py-3.5 px-4 font-semibold">Menu Price</th>
                      <th className="py-3.5 px-4 font-semibold">Availability Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Instant 86 Kill-Switch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredDishes.map((dish) => {
                      const inStock = dish.isAvailable;
                      const station = getStationBadge(dish.category);

                      return (
                        <tr
                          key={dish.id}
                          className={`transition-colors ${
                            inStock ? 'hover:bg-amber-50/20 bg-white' : 'bg-rose-50/25 hover:bg-rose-50/45'
                          }`}
                        >
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

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${station.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${station.dot}`} />
                              {station.label}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-stone-900 text-[13.5px]">
                              {formatCurrency(dish.price)}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {inStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Available Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                86&apos;d / Sold Out
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => dispatch(toggleDishAvailability(dish.id))}
                              className={`h-9 px-3.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                                inStock
                                  ? 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-700 border border-stone-200/90'
                                  : 'bg-rose-600 hover:bg-emerald-600 text-white shadow-2xs'
                              }`}
                            >
                              {inStock ? (
                                <>
                                  <AlertOctagon className="w-3.5 h-3.5 text-stone-500 group-hover:text-rose-600" />
                                  <span>Mark 86 (Out of Stock)</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Restock Dish</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cards View */}
          {filteredDishes.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDishes.map((dish) => {
                const inStock = dish.isAvailable;
                const station = getStationBadge(dish.category);
                return (
                  <div
                    key={dish.id}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3 transition-colors ${
                      inStock ? 'border-stone-200/90' : 'border-rose-200/80 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className={`w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200/80 ${
                          inStock ? '' : 'grayscale-[40%] opacity-80'
                        }`}
                      />
                      <div className="min-w-0">
                        <h4
                          className={`font-semibold text-xs sm:text-sm truncate leading-snug ${
                            inStock ? 'text-stone-900' : 'text-stone-400 line-through'
                          }`}
                        >
                          {dish.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                          <span className="font-bold text-[#B84A22]">{formatCurrency(dish.price)}</span>
                          <span>·</span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${station.badge}`}>
                            {station.label}
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
                      {inStock ? '86 Dish' : 'Restock'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 2: RAW INGREDIENTS & STOCK CONTROL ================= */}
      {activeInventoryTab === 'raw_inventory' && (
        <div className="space-y-4">
          {/* Raw Inventory Toolbar */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search raw material or supplier..."
                value={rawSearchQuery}
                onChange={(e) => setRawSearchQuery(e.target.value)}
                className="w-full h-10 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/10 rounded-xl pl-11 pr-10 text-[13px] font-medium text-stone-900 placeholder:text-stone-400 transition-all outline-none"
              />
              {rawSearchQuery && (
                <button
                  onClick={() => setRawSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Segmented */}
              <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto scrollbar-none">
                {[
                  { id: 'all', label: 'All Raw Goods' },
                  { id: 'protein', label: 'Meat & Poultry' },
                  { id: 'dairy', label: 'Dairy & Fats' },
                  { id: 'grain', label: 'Grains & Dry' },
                  { id: 'spice_produce', label: 'Spices & Veg' },
                  { id: 'packaging', label: 'Packaging' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setRawCategoryFilter(c.id)}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      rawCategoryFilter === c.id
                        ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
                <button
                  onClick={() => setRawStatusFilter('all')}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    rawStatusFilter === 'all'
                      ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setRawStatusFilter('healthy')}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    rawStatusFilter === 'healthy'
                      ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                  }`}
                >
                  Healthy
                </button>
                <button
                  onClick={() => setRawStatusFilter('low_stock')}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    rawStatusFilter === 'low_stock'
                      ? 'bg-white text-amber-700 font-semibold shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                  }`}
                >
                  Low Stock
                </button>
                <button
                  onClick={() => setRawStatusFilter('out_of_stock')}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    rawStatusFilter === 'out_of_stock'
                      ? 'bg-white text-rose-700 font-semibold shadow-xs border border-stone-200/60'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
                  }`}
                >
                  Out of Stock
                </button>
              </div>
            </div>
          </div>

          {/* Raw Materials Table */}
          <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200/90 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Ingredient &amp; Category</th>
                    <th className="py-3.5 px-4 font-semibold">Stock vs Par Level</th>
                    <th className="py-3.5 px-4 font-semibold">Health Status</th>
                    <th className="py-3.5 px-4 font-semibold">Unit Cost / Value</th>
                    <th className="py-3.5 px-4 font-semibold">Supplier</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredRaw.map((item) => {
                    const badge = getIngredientCategoryBadge(item.category);
                    const percent = Math.min(100, Math.round((item.currentStock / item.parLevel) * 100));

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 min-w-[140px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-stone-900">
                                {item.currentStock} {item.unit}
                              </span>
                              <span className="text-stone-400">
                                Par: {item.parLevel} {item.unit}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  item.status === 'out_of_stock'
                                    ? 'bg-rose-500 w-0'
                                    : item.status === 'low_stock'
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.status === 'healthy' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Healthy Stock
                            </span>
                          )}
                          {item.status === 'low_stock' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                              Below Par (Low)
                            </span>
                          )}
                          {item.status === 'out_of_stock' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                              Out of Stock
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-stone-900">
                            {formatCurrency(item.unitCost)} / {item.unit}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Val: {formatCurrency(item.currentStock * item.unitCost)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-stone-800">{item.supplier}</div>
                          <div className="text-[10px] text-stone-400">Restocked: {item.lastRestocked}</div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => dispatch(adjustRawStock({ id: item.id, delta: -1 }))}
                              disabled={item.currentStock <= 0}
                              className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
                              title="Deduct 1 unit"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => dispatch(adjustRawStock({ id: item.id, delta: 1 }))}
                              className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer text-xs transition-colors"
                              title="Add 1 unit"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => dispatch(adjustRawStock({ id: item.id, delta: 5 }))}
                              className="h-8 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center justify-center cursor-pointer text-xs transition-colors"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                            {item.status !== 'healthy' && (
                              <button
                                onClick={() => dispatch(restockRawToPar(item.id))}
                                className="h-8 px-2.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#B84A22] font-semibold flex items-center gap-1 cursor-pointer text-xs transition-colors"
                                title="Restock to 150% Par"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Restock</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Raw Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Add Raw Material / Supply</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIngredient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Strands, Basmati Rice, Takeaway Bowls"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newIngCat}
                    onChange={(e) => setNewIngCat(e.target.value as RawIngredientItem['category'])}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                  >
                    <option value="protein">Meat &amp; Poultry</option>
                    <option value="dairy">Dairy &amp; Fats</option>
                    <option value="grain">Grains &amp; Dry Goods</option>
                    <option value="spice_produce">Spices &amp; Produce</option>
                    <option value="packaging">Packaging &amp; Supplies</option>
                    <option value="beverage">Beverages &amp; Syrups</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, L, pcs, bags, cans"
                    value={newIngUnit}
                    onChange={(e) => setNewIngUnit(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Current Count</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newIngStock}
                    onChange={(e) => setNewIngStock(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Par Level (Min)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={newIngPar}
                    onChange={(e) => setNewIngPar(parseFloat(e.target.value) || 1)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit Cost (€)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newIngCost}
                    onChange={(e) => setNewIngCost(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Supplier / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dublin Halal Foods Ltd"
                  value={newIngSupplier}
                  onChange={(e) => setNewIngSupplier(e.target.value)}
                  className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#F15A24] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Save Material
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
