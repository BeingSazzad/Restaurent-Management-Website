'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  syncMenuFromStorage,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
} from '@/redux/slices/menuSlice';
import { MenuItem, DishModifierGroup } from '@/Mockdata';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Flame,
  AlertCircle,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

const PRESET_IMAGES = [
  { label: 'Royal Biryani', url: '/images/amber_hero_dish.jpg' },
  { label: 'Heritage Curry', url: '/images/curry_dish.jpg' },
  { label: 'Tandoori Grill', url: '/images/grill_dish.jpg' },
  { label: 'Lamb Rogan Josh', url: '/images/curry_dish.jpg' },
  { label: 'Kebab Platter', url: '/images/grill_dish.jpg' },
];

const CATEGORIES_LIST: { id: MenuItem['category']; label: string }[] = [
  { id: 'biryani', label: 'Dum Biryani' },
  { id: 'curries', label: 'Main Curries' },
  { id: 'grill', label: 'Tandoori Grills' },
  { id: 'vegetarian', label: 'Vegetarian Specialties' },
  { id: 'breads', label: 'Clay Oven Breads' },
  { id: 'desserts', label: 'Royal Desserts' },
  { id: 'combos', label: 'Chef Platters & Combos' },
];

const ALLERGEN_OPTIONS = ['Gluten', 'Dairy', 'Tree Nuts', 'Peanuts', 'Mustard', 'Sesame Seeds', 'Eggs', 'Crustaceans'];
const DIETARY_OPTIONS: ('halal' | 'vegetarian' | 'vegan' | 'gluten-free')[] = [
  'halal',
  'vegetarian',
  'vegan',
  'gluten-free',
];

interface ModifierOptionItem {
  id: string;
  name: string;
  price: number;
}

export const ProductManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector((state) => state.menu.items);

  useEffect(() => {
    dispatch(syncMenuFromStorage());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuItem['category']>('biryani');
  const [formPrice, setFormPrice] = useState<number>(14.5);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/images/amber_hero_dish.jpg');
  const [formPrepTime, setFormPrepTime] = useState('20 min');
  const [formSpiceLevel, setFormSpiceLevel] = useState<number>(2);
  const [formDietary, setFormDietary] = useState<('halal' | 'vegetarian' | 'vegan' | 'gluten-free')[]>(['halal']);
  const [formAllergens, setFormAllergens] = useState<string[]>(['Dairy']);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  // Portion Sizes & Accompaniments State (Modifier Groups)
  const [formPortionGroupName, setFormPortionGroupName] = useState('Portion Size');
  const [formPortions, setFormPortions] = useState<ModifierOptionItem[]>([
    { id: 'opt-reg', name: 'Standard Handi Portion (1 Person)', price: 0 },
    { id: 'opt-large', name: 'Large Handi Feast (with extra drumstick)', price: 3.5 },
  ]);
  const [formAccompanimentsGroupName, setFormAccompanimentsGroupName] = useState('Complimentary Accompaniments');
  const [formMaxAccompaniments, setFormMaxAccompaniments] = useState<number>(3);
  const [formAccompaniments, setFormAccompaniments] = useState<ModifierOptionItem[]>([
    { id: 'opt-raita', name: 'Pomegranate Mint Raita', price: 1.5 },
    { id: 'opt-salan', name: 'Spiced Mirchi Salan Gravy', price: 2.0 },
    { id: 'opt-egg', name: 'Boiled Spiced Egg Topping', price: 1.2 },
  ]);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleAddPortion = () => {
    setFormPortions((prev) => [
      ...prev,
      { id: `opt-portion-${Date.now()}`, name: '', price: 0 },
    ]);
  };

  const handleUpdatePortion = (index: number, field: 'name' | 'price', value: string | number) => {
    setFormPortions((prev) => {
      const copy = [...prev];
      if (field === 'name') {
        copy[index] = { ...copy[index], name: value as string };
      } else {
        copy[index] = { ...copy[index], price: parseFloat(value as string) || 0 };
      }
      return copy;
    });
  };

  const handleRemovePortion = (index: number) => {
    if (formPortions.length <= 1) {
      alert('A dish must have at least one portion size option (e.g. Standard Portion).');
      return;
    }
    setFormPortions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAccompaniment = () => {
    setFormAccompaniments((prev) => [
      ...prev,
      { id: `opt-acc-${Date.now()}`, name: '', price: 1.5 },
    ]);
  };

  const handleUpdateAccompaniment = (index: number, field: 'name' | 'price', value: string | number) => {
    setFormAccompaniments((prev) => {
      const copy = [...prev];
      if (field === 'name') {
        copy[index] = { ...copy[index], name: value as string };
      } else {
        copy[index] = { ...copy[index], price: parseFloat(value as string) || 0 };
      }
      return copy;
    });
  };

  const handleRemoveAccompaniment = (index: number) => {
    setFormAccompaniments((prev) => prev.filter((_, i) => i !== index));
  };

  const openAddModal = () => {
    setEditingDish(null);
    setFormName('');
    setFormCategory('biryani');
    setFormPrice(14.5);
    setFormDescription('');
    setFormImage('/images/amber_hero_dish.jpg');
    setFormPrepTime('20 min');
    setFormSpiceLevel(2);
    setFormDietary(['halal']);
    setFormAllergens(['Dairy']);
    setFormIsBestSeller(false);
    setFormIsAvailable(true);
    setUploadNotice(null);

    setFormPortionGroupName('Portion Size');
    setFormPortions([
      { id: 'opt-reg', name: 'Standard Handi Portion (1 Person)', price: 0 },
      { id: 'opt-large', name: 'Large Handi Feast (with extra drumstick)', price: 3.5 },
    ]);
    setFormAccompanimentsGroupName('Complimentary Accompaniments');
    setFormMaxAccompaniments(3);
    setFormAccompaniments([
      { id: 'opt-raita', name: 'Pomegranate Mint Raita', price: 1.5 },
      { id: 'opt-salan', name: 'Spiced Mirchi Salan Gravy', price: 2.0 },
      { id: 'opt-egg', name: 'Boiled Spiced Egg Topping', price: 1.2 },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category);
    setFormPrice(dish.price);
    setFormDescription(dish.description);
    setFormImage(dish.image);
    setFormPrepTime(dish.prepTime || '20 min');
    setFormSpiceLevel(dish.spiceLevel || 1);
    setFormDietary(dish.dietary || ['halal']);
    setFormAllergens(dish.allergens || []);
    setFormIsBestSeller(!!dish.isBestSeller);
    setFormIsAvailable(dish.isAvailable);
    setUploadNotice(null);

    // Extract Portion Size group
    const portionGroup = dish.modifierGroups?.find(
      (g) =>
        g.id.toLowerCase().includes('portion') ||
        g.name.toLowerCase().includes('portion') ||
        g.maxSelect === 1
    );

    if (portionGroup && portionGroup.options && portionGroup.options.length > 0) {
      setFormPortionGroupName(portionGroup.name || 'Portion Size');
      setFormPortions(
        portionGroup.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
        }))
      );
    } else {
      setFormPortionGroupName('Portion Size');
      setFormPortions([
        { id: 'opt-reg', name: 'Standard Handi Portion (1 Person)', price: 0 },
        { id: 'opt-large', name: 'Large Handi Feast (with extra drumstick)', price: 3.5 },
      ]);
    }

    // Extract Accompaniments group
    const sidesGroup = dish.modifierGroups?.find(
      (g) =>
        g !== portionGroup &&
        (g.id.toLowerCase().includes('side') ||
          g.name.toLowerCase().includes('accompaniment') ||
          g.name.toLowerCase().includes('sides') ||
          g.maxSelect > 1)
    );

    if (sidesGroup && sidesGroup.options && sidesGroup.options.length > 0) {
      setFormAccompanimentsGroupName(sidesGroup.name || 'Complimentary Accompaniments');
      setFormMaxAccompaniments(sidesGroup.maxSelect || 3);
      setFormAccompaniments(
        sidesGroup.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
        }))
      );
    } else {
      setFormAccompanimentsGroupName('Complimentary Accompaniments');
      setFormMaxAccompaniments(3);
      setFormAccompaniments([
        { id: 'opt-raita', name: 'Pomegranate Mint Raita', price: 1.5 },
        { id: 'opt-salan', name: 'Spiced Mirchi Salan Gravy', price: 2.0 },
        { id: 'opt-egg', name: 'Boiled Spiced Egg Topping', price: 1.2 },
      ]);
    }

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
        setUploadNotice('✓ Image uploaded and preview active!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a product name');
      return;
    }

    const categoryObj = CATEGORIES_LIST.find((c) => c.id === formCategory);
    const categoryLabel = categoryObj ? categoryObj.label : 'Specialties';

    // Build Modifier Groups
    const cleanedPortions = formPortions
      .filter((p) => p.name.trim().length > 0)
      .map((p, idx) => ({
        id: p.id || `portion-${Date.now()}-${idx}`,
        name: p.name.trim(),
        price: Number(p.price) || 0,
      }));

    const cleanedAccompaniments = formAccompaniments
      .filter((a) => a.name.trim().length > 0)
      .map((a, idx) => ({
        id: a.id || `acc-${Date.now()}-${idx}`,
        name: a.name.trim(),
        price: Number(a.price) || 0,
      }));

    const modifierGroups: DishModifierGroup[] = [];

    if (cleanedPortions.length > 0) {
      modifierGroups.push({
        id: 'portion',
        name: formPortionGroupName.trim() || 'Portion Size',
        required: true,
        maxSelect: 1,
        options: cleanedPortions,
      });
    }

    if (cleanedAccompaniments.length > 0) {
      modifierGroups.push({
        id: 'sides',
        name: formAccompanimentsGroupName.trim() || 'Complimentary Accompaniments',
        required: false,
        maxSelect: Number(formMaxAccompaniments) || 3,
        options: cleanedAccompaniments,
      });
    }

    const dishPayload: MenuItem = {
      id: editingDish ? editingDish.id : `dish-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      categoryLabel,
      description: formDescription.trim() || 'Prepared fresh with heirloom recipes and stone-ground spices.',
      price: Number(formPrice) || 12.0,
      image: formImage.trim() || '/images/amber_hero_dish.jpg',
      rating: editingDish ? editingDish.rating : 4.9,
      reviewCount: editingDish ? editingDish.reviewCount : 24,
      prepTime: formPrepTime.trim() || '20 min',
      allergens: formAllergens,
      dietary: formDietary,
      isBestSeller: formIsBestSeller,
      isAvailable: formIsAvailable,
      modifierGroups,
    };

    if (editingDish) {
      dispatch(updateMenuItem(dishPayload));
    } else {
      dispatch(addMenuItem(dishPayload));
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the active menu?`)) {
      dispatch(deleteMenuItem(id));
    }
  };

  const filteredDishes = menuItems.filter((dish) => {
    const matchCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A130E] flex items-center gap-2">
            <span>Product & Menu Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F15A24] font-semibold">
              {menuItems.length} Products
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload new dishes, update pricing, change food photos, and manage live storefront inventory.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FBA138] hover:from-[#d94e1c] hover:to-[#e89228] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by dish name, category, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 shadow-2xs outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-[#F15A24] text-white border-[#F15A24] shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {CATEGORIES_LIST.map((cat) => {
            const count = menuItems.filter((m) => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#F15A24] text-white border-[#F15A24]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dish Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white border border-stone-200/90 hover:border-stone-300 rounded-2xl p-4 shadow-2xs flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Image & Quick Badges */}
              <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold">
                    €{dish.price.toFixed(2)}
                  </span>
                  {dish.isBestSeller && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#F15A24] text-white text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => dispatch(toggleItemAvailability(dish.id))}
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

              {/* Title & Category */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#F15A24] uppercase tracking-wider">
                    {dish.category}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">{dish.prepTime || '20 min'}</span>
                </div>
                <h3 className="font-bold text-sm text-[#1A130E] leading-snug line-clamp-1">{dish.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{dish.description}</p>
              </div>

              {/* Dietary / Allergens */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-[10px] text-stone-600">
                {dish.dietary?.map((diet) => (
                  <span key={diet} className="px-2 py-0.5 rounded-md bg-stone-100 font-semibold capitalize">
                    {diet}
                  </span>
                ))}
                {dish.allergens && dish.allergens.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">
                    Contains: {dish.allergens.join(', ')}
                  </span>
                )}
              </div>

              {/* Portions & Addons Customization Badges */}
              <div className="flex items-center gap-1.5 pt-2 text-[10.5px] text-stone-500 font-medium flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#F15A24] border border-orange-100 font-semibold">
                  <UtensilsCrossed className="w-3 h-3" />
                  {dish.modifierGroups?.[0]?.options?.length || 1} Portion Sizes
                </span>
                {dish.modifierGroups && dish.modifierGroups.length > 1 && dish.modifierGroups[1]?.options?.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    +{dish.modifierGroups[1].options.length} Accompaniments
                  </span>
                )}
              </div>
            </div>

            {/* Row Actions */}
            <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
                <span>Spice:</span>
                <span className="text-orange-600 flex items-center">
                  {[...Array(dish.spiceLevel || 1)].map((_, i) => (
                    <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(dish)}
                  className="h-8 px-3 rounded-lg border border-stone-200 hover:border-[#F15A24] hover:text-[#F15A24] text-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(dish.id, dish.name)}
                  className="h-8 w-8 rounded-lg border border-stone-200 hover:border-rose-400 hover:text-rose-600 text-stone-400 flex items-center justify-center cursor-pointer transition-colors"
                  title="Remove dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredDishes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredDishes.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[6, 12, 24]}
        />
      )}

      {filteredDishes.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-[#1A130E]">No dishes match your filters</h4>
          <p className="text-xs text-stone-400 mt-1">Try another search keyword or switch categories.</p>
        </div>
      )}

      {/* ================= ADD / EDIT DISH MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <h3 className="font-extrabold text-lg text-[#1A130E]">
                  {editingDish ? 'Edit Dish & Media' : 'Add New Restaurant Dish'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update photo, name, category, pricing, portions, and accompaniments.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
              {/* SECTION: PHOTO UPLOAD */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Product Photo / Image Upload
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview */}
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 relative group">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/amber_hero_dish.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* File Picker Trigger */}
                    <div className="flex items-center gap-2">
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
                        className="h-9 px-3.5 rounded-xl bg-white border border-stone-300 hover:border-[#F15A24] text-xs font-semibold text-stone-800 shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#F15A24]" />
                        <span>Upload from Computer / Phone</span>
                      </button>
                    </div>

                    {/* Or URL input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Or enter direct image URL (https://... or /images/...)"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full h-9 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl px-3 text-xs text-stone-800 placeholder:text-stone-400 outline-none"
                      />
                    </div>

                    {uploadNotice && (
                      <p className="text-[11px] font-semibold text-emerald-600">{uploadNotice}</p>
                    )}

                    {/* Preset Badges */}
                    <div className="pt-1">
                      <span className="text-[10px] text-stone-500 font-semibold block mb-1">
                        Or select from restaurant photo presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setFormImage(p.url)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white border border-stone-200 hover:border-[#F15A24] text-stone-700 cursor-pointer"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dish Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dish Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Kashmiri Lamb Rogan Josh"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none cursor-pointer"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Prep Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">€</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                      className="w-full h-10 pl-7 pr-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 15-20 min"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Spice Level (0 - 3)</label>
                  <select
                    value={formSpiceLevel}
                    onChange={(e) => setFormSpiceLevel(parseInt(e.target.value))}
                    className="w-full h-10 px-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none cursor-pointer"
                  >
                    <option value={0}>0 — Mild / Non-Spicy</option>
                    <option value={1}>1 — Gentle Spice</option>
                    <option value={2}>2 — Medium Handi Spice</option>
                    <option value={3}>3 — Royal Hot & Fiery</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the heirloom marinade, cooking technique, cut of meat or rich sauce..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 focus:border-[#F15A24] rounded-xl text-xs text-stone-800 outline-none"
                />
              </div>

              {/* ================= SECTION: PORTION SIZES & ACCOMPANIMENTS ================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-white border border-stone-200 space-y-5">
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center shrink-0 border border-orange-100">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1A130E]">
                        Portion Sizes & Customization Add-ons
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Configure the exact options, serving sizes, and add-on prices displayed in the customer ordering modal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- 1. Portion Sizes Group (Required · Single Selection) --- */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-stone-800">
                        Portion Size Variations
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F15A24]">
                        Required · Select 1
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPortion}
                      className="text-[11px] font-bold text-[#F15A24] hover:text-[#d94e1c] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Portion Tier</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formPortions.map((portion, index) => (
                      <div
                        key={portion.id || index}
                        className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs"
                      >
                        <span className="text-[11px] font-bold text-stone-400 w-5 text-center">
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Standard Handi Portion (1 Person)"
                            value={portion.name}
                            onChange={(e) => handleUpdatePortion(index, 'name', e.target.value)}
                            className="w-full h-8 px-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-lg text-xs text-stone-800 outline-none"
                          />
                        </div>
                        <div className="w-28 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400">
                            +€
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            value={portion.price}
                            onChange={(e) => handleUpdatePortion(index, 'price', e.target.value)}
                            className="w-full h-8 pl-8 pr-2 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-lg text-xs text-stone-800 font-bold outline-none text-right"
                          />
                        </div>
                        {formPortions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePortion(index)}
                            className="w-8 h-8 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                            title="Remove portion option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10.5px] text-stone-400 italic">
                    💡 Tip: Set the first option to €0.00 for the base serving. Larger feasts or upgraded portions add the extra charge to the dish price.
                  </p>
                </div>

                {/* --- 2. Complimentary Accompaniments & Add-ons Group (Optional · Multi-Selection) --- */}
                <div className="space-y-3 pt-3 border-t border-stone-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="text-xs font-bold text-stone-800">
                        Complimentary Accompaniments & Add-ons
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        Optional · Multi-Select
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <span className="text-[11px] font-medium">Max select:</span>
                        <select
                          value={formMaxAccompaniments}
                          onChange={(e) => setFormMaxAccompaniments(parseInt(e.target.value) || 3)}
                          className="h-7 px-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 outline-none cursor-pointer"
                        >
                          <option value={1}>1 option</option>
                          <option value={2}>2 options</option>
                          <option value={3}>3 options</option>
                          <option value={4}>4 options</option>
                          <option value={5}>5 options</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddAccompaniment}
                        className="text-[11px] font-bold text-[#F15A24] hover:text-[#d94e1c] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Side/Accompaniment</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {formAccompaniments.map((acc, index) => (
                      <div
                        key={acc.id || index}
                        className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs"
                      >
                        <span className="text-[11px] font-bold text-stone-400 w-5 text-center">
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pomegranate Mint Raita, Spiced Mirchi Salan Gravy"
                            value={acc.name}
                            onChange={(e) => handleUpdateAccompaniment(index, 'name', e.target.value)}
                            className="w-full h-8 px-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-lg text-xs text-stone-800 outline-none"
                          />
                        </div>
                        <div className="w-28 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400">
                            +€
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            value={acc.price}
                            onChange={(e) => handleUpdateAccompaniment(index, 'price', e.target.value)}
                            className="w-full h-8 pl-8 pr-2 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-lg text-xs text-stone-800 font-bold outline-none text-right"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccompaniment(index)}
                          className="w-8 h-8 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove accompaniment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary / Calculation Box */}
                  <div className="mt-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-stone-600 font-medium">
                      Customer Modal Live Price Calculation:
                    </span>
                    <span className="font-bold text-[#1A130E]">
                      Base €{(Number(formPrice) || 0).toFixed(2)} + Portions (+€0 to +€{(Math.max(0, ...formPortions.map((p) => p.price || 0))).toFixed(2)}) + Add-ons
                    </span>
                  </div>
                </div>
              </div>

              {/* Dietary Tags Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Dietary Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((diet) => {
                    const isChecked = formDietary.includes(diet);
                    return (
                      <label
                        key={diet}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormDietary([...formDietary, diet]);
                            } else {
                              setFormDietary(formDietary.filter((d) => d !== diet));
                            }
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="capitalize">{diet}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Allergens Present</label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((alg) => {
                    const isChecked = formAllergens.includes(alg);
                    return (
                      <label
                        key={alg}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium cursor-pointer flex items-center gap-1 transition-colors ${
                          isChecked
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormAllergens([...formAllergens, alg]);
                            } else {
                              setFormAllergens(formAllergens.filter((a) => a !== alg));
                            }
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>{alg}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Switches: Bestseller & Availability */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="rounded text-[#F15A24] focus:ring-[#F15A24]"
                  />
                  <span className="text-xs font-bold text-stone-800">Mark as Bestseller ★</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-stone-800">In Stock for Ordering</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F15A24] hover:bg-[#d94e1c] text-white text-xs font-bold shadow-md shadow-[#F15A24]/20 cursor-pointer transition-colors"
                >
                  {editingDish ? 'Save Changes' : 'Create & Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
