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

const PRESET_IMAGES = [
  { label: 'Royal Biryani', url: '/images/amber_hero_dish.jpg' },
  { label: 'Heritage Curry', url: '/images/curry_dish.jpg' },
  { label: 'Tandoori Grill', url: '/images/grill_dish.jpg' },
  { label: 'Lamb Rogan Josh', url: '/images/curry_dish.jpg' },
  { label: 'Kebab Platter', url: '/images/grill_dish.jpg' },
];

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
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>Menu & Product Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F15A24]/10 text-[#F15A24] font-semibold">
              {dishes.length} Items
            </span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Add new menu items, upload food photography, adjust prices, and manage live stock.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
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
            className="w-full h-10 bg-[#1C1612] border border-stone-800 focus:border-[#F15A24] rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-stone-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'biryani', 'curries', 'grill', 'vegetarian', 'breads', 'desserts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors capitalize border ${
                selectedCategory === cat
                  ? 'bg-[#F15A24] text-white border-[#F15A24]'
                  : 'bg-[#1C1612] border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-[#1C1612] border border-stone-800/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between group hover:border-stone-700 transition-all"
          >
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-stone-900 border border-stone-800">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold">
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
                <span className="text-[11px] font-bold text-[#F15A24] uppercase tracking-wider block">
                  {dish.category}
                </span>
                <h3 className="font-bold text-sm text-white line-clamp-1">{dish.name}</h3>
                <p className="text-xs text-stone-400 line-clamp-2">{dish.description}</p>
              </div>
            </div>

            <div className="pt-3.5 mt-3 border-t border-stone-800/80 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(dish)}
                className="h-8 px-3 rounded-lg border border-stone-750 hover:border-[#F15A24] hover:text-[#F15A24] text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(dish.id, dish.name)}
                className="h-8 w-8 rounded-lg border border-stone-750 hover:border-rose-500 hover:text-rose-400 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                title="Remove dish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="bg-[#1C1612] border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
          <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-white">No dishes match your filter criteria</h4>
          <p className="text-xs text-stone-500 mt-1">Try another search keyword.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1612] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-stone-750 shadow-2xl text-white">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-[#1C1612]/95 backdrop-blur-xs z-10">
              <h3 className="font-bold text-base">
                {editingDish ? 'Edit Dish & Media' : 'Add New Restaurant Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Photo Upload */}
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                  Dish Photography
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-800 border border-stone-750 shrink-0">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
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
                      className="h-8 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F15A24]" />
                      <span>Upload from Device</span>
                    </button>
                    <input
                      type="text"
                      placeholder="Or enter image URL..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full h-8 px-2.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white outline-none"
                    />
                    {uploadNotice && (
                      <span className="text-[11px] text-emerald-400 block">{uploadNotice}</span>
                    )}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-stone-400 block mb-1">Preset image shortcuts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormImage(p.url)}
                        className="px-2 py-0.5 rounded text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-9 px-3 bg-stone-900 border border-stone-750 focus:border-[#F15A24] rounded-lg text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-9 px-3 bg-stone-900 border border-stone-750 focus:border-[#F15A24] rounded-lg text-xs text-white outline-none cursor-pointer"
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
                <label className="block text-xs font-bold text-stone-300 mb-1">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-stone-900 border border-stone-750 focus:border-[#F15A24] rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-stone-900 border border-stone-750 focus:border-[#F15A24] rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-750 hover:bg-stone-800 text-xs text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F15A24] hover:bg-[#d94e1c] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 cursor-pointer transition-colors"
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
