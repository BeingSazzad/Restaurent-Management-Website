import React, { useState, useRef } from 'react';
import { DishItem } from '../../types/common.types';
import { INITIAL_DISHES } from '../../lib/constants';
import { useAppSelector } from '../../store/hooks';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  AlertCircle,
  X,
  ChefHat,
  Package,
  List,
  LayoutGrid,
} from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination';

const MENU_STORAGE_KEY = 'amber_spice_menu_items';

const getStoredMenu = (): DishItem[] => {
  if (typeof window === 'undefined') return INITIAL_DISHES;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
  const { rawIngredients } = useAppSelector((state) => state.stock);
  const [dishes, setDishes] = useState<DishItem[]>(() => getStoredMenu());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [recipeDish, setRecipeDish] = useState<DishItem | null>(null);

  const calculateDishCost = (dish: DishItem) => {
    if (dish.recipe && dish.recipe.length > 0) {
      const total = dish.recipe.reduce((sum, r) => {
        const raw = rawIngredients.find((i) => i.id === r.ingredientId);
        const unitCost = raw ? raw.unitCost : 4.0;
        return sum + r.quantity * unitCost;
      }, 0);
      return Math.round(total * 100) / 100;
    }
    return Math.round(dish.price * 0.24 * 100) / 100;
  };

  // Sync menu state when updated from Inventory & 86 kill-switch or other tabs
  React.useEffect(() => {
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
  const [formStockCount, setFormStockCount] = useState<number>(15);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/images/amber_hero_dish.jpg');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingDish(null);
    setFormName('');
    setFormCategory('biryani');
    setFormPrice(14.5);
    setFormStockCount(15);
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
    setFormStockCount(dish.stockCount !== undefined ? dish.stockCount : 12);
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

    const dishPayload: DishItem = {
      id: editingDish ? editingDish.id : `dish-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      categoryLabel: formCategory.toUpperCase(),
      description: formDescription.trim() || 'Authentic heirloom recipe prepared with stone-ground spices.',
      price: Number(formPrice) || 12.0,
      stockCount: editingDish ? (editingDish.stockCount ?? 20) : 20,
      lowStockThreshold: 5,
      image: formImage.trim() || '/images/amber_hero_dish.jpg',
      isAvailable: formIsAvailable,
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
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete dish "${name}" from restaurant menu?`)) {
      const updated = dishes.filter((d) => d.id !== id);
      setDishes(updated);
      saveStoredMenu(updated);
    }
  };

  const toggleAvailability = (id: string) => {
    const updated = dishes.map((d) => {
      if (d.id === id) {
        const nextAvail = !d.isAvailable;
        return {
          ...d,
          isAvailable: nextAvail,
          stockCount: nextAvail ? (d.stockCount && d.stockCount > 0 ? d.stockCount : 12) : 0,
        };
      }
      return d;
    });
    setDishes(updated);
    saveStoredMenu(updated);
  };

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

  // View Mode: 'table' (default) or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#1A130E]">
            <span>Menu &amp; Products</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#B84A22] font-semibold border border-orange-200/60">
              {dishes.length} Items
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Customer-facing menu dishes, pricing, categories, and live availability.
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

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-stone-200 focus:border-[#B84A22] rounded-xl pl-10 pr-4 text-xs text-[#1A130E] placeholder:text-stone-400 outline-none shadow-2xs transition-colors"
          />
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

      {/* Dish List: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4">Cost &amp; Margin</th>
                  <th className="py-3 px-4">Batch Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[13px]">
                {paginatedDishes.map((dish) => {
                  const foodCost = calculateDishCost(dish);
                  const marginPercent = Math.round(((dish.price - foodCost) / dish.price) * 100);

                  return (
                    <tr key={dish.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Dish Image + Name + Description */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200/80 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 text-xs block truncate">
                              {dish.name}
                            </span>
                            <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {dish.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold text-[#B84A22] bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                          {dish.category}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-stone-900 text-xs">
                          €{dish.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Food Cost & Margin */}
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <span className="font-semibold text-stone-700">€{foodCost.toFixed(2)}</span>
                          <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {marginPercent}% margin
                          </span>
                        </div>
                      </td>

                      {/* Batch Stock */}
                      <td className="py-3 px-4">
                        {dish.isAvailable && (dish.stockCount || 0) > 0 ? (
                          <span
                            className={`text-xs font-semibold ${
                              (dish.stockCount || 0) <= (dish.lowStockThreshold || 5)
                                ? 'text-amber-600'
                                : 'text-stone-700'
                            }`}
                          >
                            {dish.stockCount} portions
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-rose-600">0 portions</span>
                        )}
                      </td>

                      {/* Availability Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(dish.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer transition-all ${
                            dish.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle availability"
                        >
                          {dish.isAvailable ? 'In Stock' : '86 Sold Out'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRecipeDish(dish)}
                            className="h-7 px-2 rounded-lg border border-stone-200 hover:border-amber-600 hover:text-amber-700 text-stone-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="Recipe Ingredients & BOM"
                          >
                            <ChefHat className="w-3 h-3 text-stone-500" />
                            <span>BOM</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(dish)}
                            className="h-7 px-2 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(dish.id, dish.name)}
                            className="h-7 w-7 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                            title="Remove dish"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedDishes.map((dish) => {
            const foodCost = calculateDishCost(dish);
            const marginPercent = Math.round(((dish.price - foodCost) / dish.price) * 100);

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
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#1A130E] border border-stone-200/90 shadow-xs text-[11px] font-bold">
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
                        {dish.isAvailable ? 'In Stock' : '86 Sold Out'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <span className="text-[11px] font-bold text-[#B84A22] uppercase tracking-wider block">
                      {dish.category}
                    </span>
                    <h3 className="font-bold text-sm text-[#1A130E] line-clamp-1">{dish.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{dish.description}</p>
                  </div>

                  {/* Portions Remaining Indicator */}
                  <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-stone-100">
                    <span className="text-stone-400 font-medium">Batch Stock:</span>
                    {dish.isAvailable && (dish.stockCount || 0) > 0 ? (
                      <span
                        className={
                          (dish.stockCount || 0) <= (dish.lowStockThreshold || 5)
                            ? 'text-amber-600 font-bold'
                            : 'text-emerald-700 font-bold'
                        }
                      >
                        {dish.stockCount} portions remaining
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold">86&apos;d (0 portions)</span>
                    )}
                  </div>

                  {/* BOM Food Cost & Margin Indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 mt-1 border-t border-stone-100">
                    <span className="text-stone-400 font-medium">Portion Cost:</span>
                    <span className="font-bold text-stone-800">
                      €{foodCost.toFixed(2)}{' '}
                      <span className="text-emerald-700 font-extrabold">({marginPercent}% margin)</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setRecipeDish(dish)}
                    className="h-8 px-2.5 rounded-lg border border-stone-200 hover:border-amber-600 hover:text-amber-700 text-stone-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    title="View Recipe Ingredients & BOM"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-stone-500" />
                    <span>Recipe BOM</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(dish)}
                      className="h-8 px-3 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id, dish.name)}
                      className="h-8 w-8 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
          <p className="text-xs text-stone-400 mt-1">Try another search keyword.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl text-[#1A130E]">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <h3 className="font-bold text-base text-[#1A130E]">
                {editingDish ? 'Edit Dish' : 'Add Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Photo Upload */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  Dish Image
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs group relative cursor-pointer"
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
                      <Upload className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
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
                      className="h-8 px-3.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#B84A22]" />
                      <span>Upload from Device</span>
                    </button>
                    {uploadNotice && (
                      <span className="text-[11px] text-emerald-600 font-semibold block">{uploadNotice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Chicken Dum Biryani"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none cursor-pointer"
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe BOM Modal */}
      {recipeDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl text-[#1A130E] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#B84A22] flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A130E]">{recipeDish.name}</h3>
                  <p className="text-[11px] text-stone-500">Portion Bill of Materials (BOM) &amp; Depletion</p>
                </div>
              </div>
              <button
                onClick={() => setRecipeDish(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Margin Summary Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-center">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Menu Price</span>
                <span className="text-sm font-extrabold text-stone-900">€{recipeDish.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Food Cost</span>
                <span className="text-sm font-extrabold text-amber-700">€{calculateDishCost(recipeDish).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Gross Margin</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {Math.round(((recipeDish.price - calculateDishCost(recipeDish)) / recipeDish.price) * 100)}%
                </span>
              </div>
            </div>

            {/* Ingredients Breakdown Table */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                Raw Ingredients Consumed Per Portion
              </span>
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Ingredient</th>
                      <th className="py-2.5 px-3 text-right">Portion Measure</th>
                      <th className="py-2.5 px-3 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(recipeDish.recipe && recipeDish.recipe.length > 0
                      ? recipeDish.recipe
                      : [
                          { ingredientId: 'ing-01', name: 'Fresh Protein / Base Veg', quantity: 0.25, unit: 'kg' },
                          { ingredientId: 'ing-03', name: 'Pure Ghee & Butter', quantity: 0.04, unit: 'kg' },
                          { ingredientId: 'ing-05', name: 'Stone-Ground Spices', quantity: 0.015, unit: 'kg' },
                          { ingredientId: 'ing-06', name: 'Eco Takeaway Container', quantity: 1, unit: 'pcs' },
                        ]
                    ).map((item, idx) => {
                      const raw = rawIngredients.find((r) => r.id === item.ingredientId);
                      const unitCost = raw ? raw.unitCost : 4.0;
                      const itemCost = Math.round(item.quantity * unitCost * 100) / 100;

                      return (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 font-semibold text-stone-900">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-right text-stone-600 font-mono">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                            €{itemCost.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 leading-relaxed">
              💡 <strong>Kitchen Automation:</strong> When an order with this dish is prepared and marked <em>Ready</em> or <em>Completed</em>, these ingredients are automatically depleted from live raw stock.
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setRecipeDish(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
              >
                Close BOM View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
