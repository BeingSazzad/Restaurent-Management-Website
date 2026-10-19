import React, { useState, useRef, useEffect } from 'react';
import { DishItem } from '../../types/common.types';
import { INITIAL_DISHES } from '../../lib/constants';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  AlertCircle,
  X,
  Package,
  List,
  LayoutGrid,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination';

const MENU_STORAGE_KEY = 'amber_spice_menu_items';

const getStoredMenu = (): DishItem[] => {
  if (typeof window === 'undefined') return INITIAL_DISHES;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Backfill missing descriptions and stock values from INITIAL_DISHES
        return parsed.map((item: DishItem) => {
          const matchInitial = INITIAL_DISHES.find((init) => init.id === item.id);
          return {
            ...item,
            description:
              item.description && item.description.trim().length > 0
                ? item.description
                : matchInitial?.description ||
                  'Authentic heirloom recipe slow-cooked with freshly stone-ground spices and premium ingredients.',
            stockCount:
              item.stockCount !== undefined
                ? item.stockCount
                : matchInitial?.stockCount !== undefined
                ? matchInitial.stockCount
                : 15,
            lowStockThreshold: item.lowStockThreshold || matchInitial?.lowStockThreshold || 5,
          };
        });
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_DISHES;
};

const saveStoredMenu = (items: DishItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('amber_spice_menu_updated'));
  } catch {
    // ignore
  }
};

export function ProductsPage() {
  const [dishes, setDishes] = useState<DishItem[]>(() => getStoredMenu());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [viewingDish, setViewingDish] = useState<DishItem | null>(null);

  // Sync menu state when updated from Inventory & 86 kill-switch or other tabs
  useEffect(() => {
    const handleSync = () => {
      setDishes(getStoredMenu());
    };
    window.addEventListener('amber_spice_menu_updated', handleSync);
    return () => window.removeEventListener('amber_spice_menu_updated', handleSync);
  }, []);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<DishItem['category']>('biryani');
  const [formPrice, setFormPrice] = useState<number>(14.5);
  const [formStockCount, setFormStockCount] = useState<number>(20);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState<number>(5);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/images/amber_hero_dish.jpg');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View Mode: 'table' (default) or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditingDish(null);
    setFormName('');
    setFormCategory('biryani');
    setFormPrice(14.5);
    setFormStockCount(20);
    setFormLowStockThreshold(5);
    setFormDescription('');
    setFormImage('/images/amber_hero_dish.jpg');
    setFormIsAvailable(true);
    setUploadNotice(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dish: DishItem) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category);
    setFormPrice(dish.price);
    setFormStockCount(dish.stockCount !== undefined ? dish.stockCount : 15);
    setFormLowStockThreshold(dish.lowStockThreshold !== undefined ? dish.lowStockThreshold : 5);
    setFormDescription(dish.description || '');
    setFormImage(dish.image);
    setFormIsAvailable(dish.isAvailable);
    setUploadNotice(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
        setUploadNotice('✓ Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedStock = Math.max(0, parseInt(formStockCount.toString(), 10) || 0);
    const parsedThreshold = Math.max(1, parseInt(formLowStockThreshold.toString(), 10) || 5);
    const isAvail = parsedStock > 0 ? formIsAvailable : false;

    const dishPayload: DishItem = {
      id: editingDish ? editingDish.id : `dish-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      categoryLabel: formCategory.toUpperCase(),
      description:
        formDescription.trim() ||
        'Authentic heirloom recipe prepared fresh daily with stone-ground spices and fresh local produce.',
      price: Number(formPrice) || 12.0,
      stockCount: parsedStock,
      lowStockThreshold: parsedThreshold,
      image: formImage.trim() || '/images/amber_hero_dish.jpg',
      isAvailable: isAvail,
      recipe: editingDish?.recipe,
    };

    let updated: DishItem[];
    if (editingDish) {
      updated = dishes.map((d) => (d.id === dishPayload.id ? dishPayload : d));
    } else {
      updated = [dishPayload, ...dishes];
    }

    setDishes(updated);
    saveStoredMenu(updated);
    setIsModalOpen(false);

    // If currently viewing this dish, update the preview modal too
    if (viewingDish && viewingDish.id === dishPayload.id) {
      setViewingDish(dishPayload);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete dish "${name}" from restaurant menu?`)) {
      const updated = dishes.filter((d) => d.id !== id);
      setDishes(updated);
      saveStoredMenu(updated);
      if (viewingDish && viewingDish.id === id) {
        setViewingDish(null);
      }
    }
  };

  const toggleAvailability = (id: string) => {
    const updated = dishes.map((d) => {
      if (d.id === id) {
        const nextAvail = !d.isAvailable;
        return {
          ...d,
          isAvailable: nextAvail,
          stockCount: nextAvail ? (d.stockCount && d.stockCount > 0 ? d.stockCount : 15) : 0,
        };
      }
      return d;
    });
    setDishes(updated);
    saveStoredMenu(updated);
    if (viewingDish && viewingDish.id === id) {
      const target = updated.find((d) => d.id === id);
      if (target) setViewingDish(target);
    }
  };

  // Filtered Dishes
  const filteredDishes = dishes.filter((dish) => {
    const matchCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      dish.name.toLowerCase().includes(q) ||
      dish.category.toLowerCase().includes(q) ||
      (dish.description && dish.description.toLowerCase().includes(q));

    return matchCategory && matchSearch;
  });

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Analytics KPI counts
  const totalDishesCount = dishes.length;
  const inStockCount = dishes.filter((d) => d.isAvailable && (d.stockCount || 0) > 0).length;
  const lowStockCount = dishes.filter(
    (d) => d.isAvailable && (d.stockCount || 0) > 0 && (d.stockCount || 0) <= (d.lowStockThreshold || 5)
  ).length;
  const soldOutCount = dishes.filter((d) => !d.isAvailable || (d.stockCount || 0) === 0).length;

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'biryani':
        return 'bg-amber-50 text-amber-800 border-amber-200/70';
      case 'curries':
        return 'bg-orange-50 text-[#B84A22] border-orange-200/70';
      case 'grill':
        return 'bg-rose-50 text-rose-700 border-rose-200/70';
      case 'vegetarian':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/70';
      case 'breads':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'desserts':
        return 'bg-purple-50 text-purple-700 border-purple-200/70';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* ================= 1. HEADER ================= */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-[#1A130E]">
              Menu &amp; Products
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#B84A22] font-bold border border-orange-200/60">
              {dishes.length} Items
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Customer-facing menu dishes, real-time portion inventory, and culinary descriptions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* ================= 2. GLANCEABLE KPI METRIC STRIP ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Dishes */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Total Menu Dishes
            </span>
            <span className="text-2xl font-extrabold text-stone-900 mt-0.5 block">
              {totalDishesCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Active In Stock */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              Active in Stock
            </span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">
              {inStockCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              Low Stock Warning
            </span>
            <span className="text-2xl font-extrabold text-amber-700 mt-0.5 block">
              {lowStockCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Sold Out / 86'd */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 block">
              Sold Out / 86&apos;d
            </span>
            <span className="text-2xl font-extrabold text-rose-600 mt-0.5 block">
              {soldOutCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= 3. FILTER, SEARCH & VIEW SWITCHER ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by dish name, category, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-stone-200 focus:border-[#B84A22] rounded-xl pl-10 pr-4 text-xs text-[#1A130E] placeholder:text-stone-400 outline-none shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'biryani', 'curries', 'grill', 'vegetarian', 'breads', 'desserts'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors capitalize border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#B84A22] to-[#FBA138] text-white border-transparent shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4. PRODUCTS LIST: TABLE OR GRID ================= */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 min-w-[280px]">Dish &amp; Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4">Batch Stock</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[190px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[13px]">
                {paginatedDishes.map((dish) => {
                  const isLowStock =
                    dish.isAvailable &&
                    (dish.stockCount || 0) > 0 &&
                    (dish.stockCount || 0) <= (dish.lowStockThreshold || 5);
                  const isSoldOut = !dish.isAvailable || (dish.stockCount || 0) === 0;

                  return (
                    <tr
                      key={dish.id}
                      className="hover:bg-orange-50/20 transition-colors group"
                    >
                      {/* Dish Thumbnail + Title + Rich Description */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setViewingDish(dish)}
                            className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-2xs group-hover:border-[#B84A22]/50 transition-colors cursor-pointer relative"
                            title="Click to view details"
                          >
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                              }}
                            />
                          </button>
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => setViewingDish(dish)}
                              className="font-bold text-stone-900 text-[13px] hover:text-[#B84A22] text-left block truncate cursor-pointer transition-colors"
                              title="Click to inspect dish"
                            >
                              {dish.name}
                            </button>
                            <p className="text-[11.5px] text-stone-500 line-clamp-1 max-w-sm mt-0.5 leading-snug">
                              {dish.description ||
                                'Authentic recipe prepared with freshly stone-ground spices.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider border ${getCategoryBadgeClass(
                            dish.category
                          )}`}
                        >
                          {dish.category}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-extrabold text-stone-900 text-xs sm:text-[13px]">
                          €{dish.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Batch Stock Indicator with Low Stock Alert */}
                      <td className="py-3.5 px-4">
                        {isSoldOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            0 portions (Sold Out)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/70">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            {dish.stockCount} portions (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {dish.stockCount} portions
                          </span>
                        )}
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(dish.id)}
                          className={`px-3 py-1 rounded-lg text-[10.5px] font-bold shadow-2xs cursor-pointer transition-all ${
                            dish.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle availability"
                        >
                          {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>

                      {/* Actions: View | Edit | Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => setViewingDish(dish)}
                            className="h-7 px-2.5 rounded-lg border border-stone-200 hover:border-stone-800 hover:bg-stone-50 text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="Inspect product details and recipe"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-500" />
                            <span>View</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(dish)}
                            className="h-7 px-2.5 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] hover:bg-orange-50/50 text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="Edit dish and stock"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(dish.id, dish.name)}
                            className="h-7 w-7 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 text-stone-400 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedDishes.map((dish) => {
            const isLowStock =
              dish.isAvailable &&
              (dish.stockCount || 0) > 0 &&
              (dish.stockCount || 0) <= (dish.lowStockThreshold || 5);
            const isSoldOut = !dish.isAvailable || (dish.stockCount || 0) === 0;

            return (
              <div
                key={dish.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between group hover:border-[#B84A22]/40 transition-all"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#1A130E] border border-stone-200/90 shadow-xs text-[11px] font-extrabold">
                        €{dish.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => toggleAvailability(dish.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs cursor-pointer transition-all ${
                          dish.isAvailable
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block border ${getCategoryBadgeClass(
                        dish.category
                      )}`}
                    >
                      {dish.category}
                    </span>
                    <h3
                      onClick={() => setViewingDish(dish)}
                      className="font-bold text-sm text-[#1A130E] line-clamp-1 hover:text-[#B84A22] cursor-pointer transition-colors"
                      title="Inspect dish details"
                    >
                      {dish.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {dish.description ||
                        'Authentic recipe prepared fresh daily with stone-ground spices.'}
                    </p>
                  </div>

                  {/* Portions Remaining Indicator */}
                  <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-stone-100">
                    <span className="text-stone-400 font-medium">Batch Stock:</span>
                    {isSoldOut ? (
                      <span className="text-rose-600 font-bold">0 portions (Sold Out)</span>
                    ) : isLowStock ? (
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {dish.stockCount} portions (Low)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        {dish.stockCount} portions remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons: View | Edit | Delete */}
                <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setViewingDish(dish)}
                    className="h-8 px-2.5 rounded-lg border border-stone-200 hover:border-stone-800 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => openEditModal(dish)}
                    className="h-8 px-2.5 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id, dish.name)}
                    className="h-8 w-8 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                    title="Remove dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 5. PAGINATION ================= */}
      {filteredDishes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredDishes.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )}

      {filteredDishes.length === 0 && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center text-stone-500 shadow-2xs">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-[#1A130E]">No dishes match your filter criteria</h4>
          <p className="text-xs text-stone-400 mt-1">Try another search keyword or clear category filter.</p>
        </div>
      )}

      {/* ================= 6. DISH QUICK VIEW MODAL ================= */}
      {viewingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-stone-200 shadow-2xl text-[#1A130E]">
            {/* Modal Image Header */}
            <div className="relative h-56 bg-stone-100">
              <img
                src={viewingDish.image}
                alt={viewingDish.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <button
                onClick={() => setViewingDish(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center cursor-pointer shadow-md transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider mb-1.5 inline-block border ${getCategoryBadgeClass(
                      viewingDish.category
                    )}`}
                  >
                    {viewingDish.category}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
                    {viewingDish.name}
                  </h3>
                </div>
                <span className="text-xl font-extrabold bg-white/95 text-stone-900 px-3 py-1 rounded-xl shadow-md shrink-0">
                  €{viewingDish.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Culinary Description */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Culinary Description
                </span>
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
                  {viewingDish.description ||
                    'Authentic heirloom recipe slow-cooked with freshly stone-ground spices, caramelized onions, and royal herbs.'}
                </p>
              </div>

              {/* Real-time Inventory & Stock Gauge */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#B84A22]" />
                    <span className="text-xs font-bold text-stone-800">
                      Live Shift Batch Inventory
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      viewingDish.isAvailable && (viewingDish.stockCount || 0) > 0
                        ? (viewingDish.stockCount || 0) <= (viewingDish.lowStockThreshold || 5)
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {viewingDish.isAvailable && (viewingDish.stockCount || 0) > 0
                      ? `${viewingDish.stockCount} Portions Ready`
                      : '0 Portions (Sold Out)'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      (viewingDish.stockCount || 0) <= (viewingDish.lowStockThreshold || 5)
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((viewingDish.stockCount || 0) /
                            Math.max(viewingDish.stockCount || 1, 30)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Threshold alert: &le; {viewingDish.lowStockThreshold || 5} portions</span>
                  <span>
                    Status:{' '}
                    <strong
                      className={viewingDish.isAvailable ? 'text-emerald-700' : 'text-rose-600'}
                    >
                      {viewingDish.isAvailable ? 'Customer Orderable' : 'Unavailable in Storefront'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Recipe / Raw Ingredients (if available) */}
              {viewingDish.recipe && viewingDish.recipe.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Key Ingredients Per Portion
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingDish.recipe.map((ing, i) => (
                      <div
                        key={i}
                        className="text-xs p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-stone-700 truncate">{ing.name}</span>
                        <span className="font-mono text-stone-500 shrink-0">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Action Controls */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    toggleAvailability(viewingDish.id);
                  }}
                  className={`h-9 px-3.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    viewingDish.isAvailable
                      ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {viewingDish.isAvailable ? 'Mark as Sold Out (86)' : 'Restock Dish'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dishToEdit = viewingDish;
                    setViewingDish(null);
                    openEditModal(dishToEdit);
                  }}
                  className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl text-[#1A130E]">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <h3 className="font-bold text-base text-[#1A130E]">
                  {editingDish ? 'Edit Product & Stock' : 'Add New Menu Product'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Set customer pricing, portion stock, and culinary description.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Section 1: Photo Upload */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  Dish Photography
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs group relative cursor-pointer"
                  >
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Upload className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-9 px-3.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#B84A22]" />
                      <span>Upload from Device</span>
                    </button>
                    <p className="text-[11px] text-stone-400">
                      Recommended: high-resolution landscape photo (JPG/PNG under 5MB).
                    </p>
                    {uploadNotice && (
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        {uploadNotice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Basic Info (Name, Category, Price) */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dish Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Chicken Dum Biryani"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none shadow-2xs transition-colors font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none cursor-pointer shadow-2xs transition-colors font-medium"
                    >
                      <option value="biryani">Dum Biryani</option>
                      <option value="curries">Curries</option>
                      <option value="grill">Grill</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="breads">Breads</option>
                      <option value="desserts">Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Selling Price (€) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.5"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 px-3.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none shadow-2xs transition-colors font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Batch Stock & Inventory Controls */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#B84A22]">
                  <Package className="w-4 h-4" />
                  <span>Batch Stock &amp; Portion Availability</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Initial Batch Stock (Portions) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formStockCount}
                      onChange={(e) => setFormStockCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full h-10 px-3.5 bg-white border border-stone-200 focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none shadow-2xs font-semibold"
                    />
                    <span className="text-[10.5px] text-stone-500 mt-1 block">
                      Number of ready-to-serve portions in the kitchen prep line.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Low Stock Threshold Alert
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formLowStockThreshold}
                      onChange={(e) => setFormLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                      className="w-full h-10 px-3.5 bg-white border border-stone-200 focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none shadow-2xs font-semibold"
                    />
                    <span className="text-[10.5px] text-stone-500 mt-1 block">
                      Alerts kitchen expo when remaining portions fall to this level.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Culinary Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Culinary Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10.5px] text-stone-400">
                    {formDescription.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the dish flavors, cut of meat, spice marinade, and authentic preparation technique..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-xl text-xs text-[#1A130E] outline-none shadow-2xs transition-colors leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  {editingDish ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
