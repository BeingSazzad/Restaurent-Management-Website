import React, { useState, useRef } from 'react';
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
} from 'lucide-react';

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
  const [dishes, setDishes] = useState<DishItem[]>(() => getStoredMenu());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<DishItem['category']>('biryani');
  const [formPrice, setFormPrice] = useState<number>(14.5);
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
    const updated = dishes.map((d) => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d));
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

  return (
    <div className="space-y-6 text-[#1A130E]">
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#1A130E]">
            <span>Menu & Product Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#B84A22] font-semibold border border-orange-200/60">
              {dishes.length} Items
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add new menu items, upload food photography, adjust prices, and manage live stock.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dish by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-stone-200 focus:border-[#B84A22] rounded-xl pl-10 pr-4 text-xs text-[#1A130E] placeholder:text-stone-400 outline-none shadow-2xs transition-colors"
          />
        </div>

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
      </div>

      {/* Product Table List */}
      <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/90 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-stone-50/70 transition-colors group">
                  {/* Dish Info & Thumbnail */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0 max-w-md">
                        <div className="font-bold text-sm text-[#1A130E] truncate">
                          {dish.name}
                        </div>
                        <div className="text-xs text-stone-500 truncate line-clamp-1 mt-0.5">
                          {dish.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#B84A22] border border-orange-100/80">
                      {dish.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-sm text-[#1A130E]">
                    €{dish.price.toFixed(2)}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(dish.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                        dish.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80'
                      }`}
                      title="Click to toggle availability"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{dish.isAvailable ? 'In Stock' : '86 Sold Out'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(dish)}
                        className="h-8 px-3 rounded-lg border border-stone-200 hover:border-[#B84A22] hover:text-[#B84A22] text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors bg-white shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(dish.id, dish.name)}
                        className="h-8 w-8 rounded-lg border border-stone-200 hover:border-rose-500 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors bg-white shadow-2xs"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                {editingDish ? 'Edit Dish & Media' : 'Add New Restaurant Dish'}
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
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Dish Photography
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
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
                      className="h-9 px-4 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-800 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
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

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-9 px-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#B84A22] rounded-lg text-xs text-[#1A130E] outline-none"
                  />
                </div>
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
              </div>

              {/* Price & Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Price (€)</label>
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
    </div>
  );
}

export default ProductsPage;
