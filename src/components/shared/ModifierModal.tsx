'use client';

import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, MENU_ITEMS } from '../../Mockdata';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface ModifierModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

function getInitialModifiers(dish: MenuItem | null) {
  const initial: {
    [groupId: string]: { optionId: string; name: string; price: number }[];
  } = {};

  if (dish?.modifierGroups) {
    dish.modifierGroups.forEach((group) => {
      if (group.required && group.maxSelect === 1 && group.options.length > 0) {
        initial[group.id] = [
          {
            optionId: group.options[0].id,
            name: group.options[0].name,
            price: group.options[0].price,
          },
        ];
      } else {
        initial[group.id] = [];
      }
    });
  }

  return initial;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({ dish, onClose }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState(() => getInitialModifiers(dish));
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedPairingIds, setAddedPairingIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (dish) {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedModifiers(getInitialModifiers(dish));
      setAddedPairingIds([]);
    }
  }, [dish?.id]);

  const pairedItems = useMemo(() => {
    if (!dish) return [];
    if (dish.suggestedPairingIds && dish.suggestedPairingIds.length > 0) {
      return MENU_ITEMS.filter((m) => dish.suggestedPairingIds?.includes(m.id));
    }
    // Fallback: suggest 2 popular complements (e.g. naan and dessert)
    return MENU_ITEMS.filter((m) => m.id !== dish.id && (m.category === 'breads' || m.category === 'desserts')).slice(0, 2);
  }, [dish]);

  const handleAddPairing = (pair: MenuItem) => {
    dispatch(
      addToCart({
        cartItemId: `${pair.id}-${Date.now()}`,
        dish: pair,
        quantity: 1,
        selectedModifiers: [],
        totalPrice: pair.price,
      })
    );
    setAddedPairingIds((prev) => [...prev, pair.id]);
  };

  if (!dish) return null;

  const handleToggleOption = (
    groupId: string,
    option: { id: string; name: string; price: number },
    maxSelect: number
  ) => {
    const current = selectedModifiers[groupId] || [];
    const exists = current.some((o) => o.optionId === option.id);

    if (maxSelect === 1) {
      setSelectedModifiers({
        ...selectedModifiers,
        [groupId]: [{ optionId: option.id, name: option.name, price: option.price }],
      });
    } else {
      if (exists) {
        setSelectedModifiers({
          ...selectedModifiers,
          [groupId]: current.filter((o) => o.optionId !== option.id),
        });
      } else {
        if (current.length < maxSelect) {
          setSelectedModifiers({
            ...selectedModifiers,
            [groupId]: [
              ...current,
              { optionId: option.id, name: option.name, price: option.price },
            ],
          });
        }
      }
    }
  };

  const modifiersCost = Object.values(selectedModifiers)
    .flat()
    .reduce((sum, opt) => sum + opt.price, 0);

  const unitTotal = dish.price + modifiersCost;
  const grandTotal = unitTotal * quantity;

  const isRequiredSatisfied =
    dish.modifierGroups?.every((group) => {
      if (!group.required) return true;
      return (selectedModifiers[group.id] || []).length > 0;
    }) ?? true;

  const handleAddToCart = () => {
    if (!isRequiredSatisfied) return;

    const flattenedModifiers = Object.entries(selectedModifiers).flatMap(
      ([groupId, options]) => {
        const group = dish.modifierGroups?.find((g) => g.id === groupId);
        return options.map((opt) => ({
          groupName: group?.name || 'Customization',
          optionName: opt.name,
          price: opt.price,
        }));
      }
    );

    const cartItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity,
      selectedModifiers: flattenedModifiers,
      specialInstructions: specialInstructions.trim() || undefined,
      totalPrice: grandTotal,
    };

    dispatch(addToCart(cartItem));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#EBEBEB] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header with Food Image & Close Button */}
        <div className="relative aspect-[16/9] w-full bg-[rgb(249,249,249)] shrink-0 overflow-hidden">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1A130E] backdrop-blur-md flex items-center justify-center transition-all shadow-md z-10 hover:scale-105"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-[13px] sm:text-[14px]">
          {/* Dish Header Info (Title, Price, Description, Badges) */}
          <div className="border-b border-[#E5E5E5] pb-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A130E] leading-tight">
                {dish.name}
              </h2>
              <span className="text-[20px] font-bold text-[#1A130E] shrink-0">
                €{dish.price.toFixed(2)}
              </span>
            </div>

            <p className="text-[13px] sm:text-[14px] text-[#555555] leading-relaxed mb-3">
              {dish.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              {dish.dietary.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] text-[#B84A22] border border-[#E5E5E5] font-semibold capitalize"
                >
                  {d}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] text-[#747474] border border-[#E5E5E5]">
                ⏱ {dish.prepTime}
              </span>
            </div>
          </div>

          {/* Modifier Groups */}
          {dish.modifierGroups?.map((group) => {
            const currentSelected = selectedModifiers[group.id] || [];
            return (
              <div key={group.id} className="border-b border-[#E5E5E5] pb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h3 className="font-bold text-[14px] text-[#1A130E]">{group.name}</h3>
                    <p className="text-[12px] text-[#747474]">
                      {group.maxSelect === 1 ? 'Select 1 option' : `Choose up to ${group.maxSelect} options`}
                    </p>
                  </div>
                  {group.required && (
                    <span className="text-[10px] bg-orange-50 text-[#F15A24] px-2.5 py-0.5 rounded-full font-bold border border-orange-200">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = currentSelected.some((o) => o.optionId === option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleToggleOption(group.id, option, group.maxSelect)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border text-[13px] ${
                          isSelected
                            ? 'bg-orange-50/40 border-[#F15A24] text-[#1A130E] font-semibold'
                            : 'bg-white border-[#E5E5E5] hover:border-[#F15A24] text-[#3D3D3D]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-[#F15A24] border-[#F15A24] text-white'
                                : 'border-[#C0C0C0]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{option.name}</span>
                        </div>
                        {option.price > 0 && (
                          <span className="text-[13px] font-bold text-[#F15A24]">
                            +€{option.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
              Special Cooking Notes
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra sauce on side, no onions..."
              rows={2}
              className="w-full bg-[rgb(249,249,249)] border border-[#E5E5E5] focus:bg-white rounded-2xl p-3.5 text-[13px] text-[#1A130E] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#F15A24] resize-none transition-colors"
            />
          </div>

          {/* Related Suggestions / Frequently Paired Together */}
          {pairedItems.length > 0 && (
            <div className="pt-2 border-t border-[#EAEAEA]">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B84A22]" />
                <h3 className="font-bold text-[13px] text-[#1A130E]">Frequently Paired With</h3>
                <span className="text-[11px] text-[#747474] ml-auto">Popular combinations</span>
              </div>
              <div className="space-y-2">
                {pairedItems.map((item) => {
                  const isAdded = addedPairingIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#EBEBEB] bg-[#FBF9F6] hover:border-[#B84A22]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#E5E5E5]"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] text-[#1A130E] truncate">
                            {item.name}
                          </p>
                          <span className="text-[12px] font-bold text-[#B84A22]">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddPairing(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
                          isAdded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-white border border-[#E5E5E5] hover:border-[#B84A22] text-[#1A130E] hover:text-[#B84A22] shadow-xs active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E5E5] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[rgb(249,249,249)] px-3.5 py-1.5 rounded-xl border border-[#E5E5E5]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-[#747474] hover:text-[#1A130E] p-0.5"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-[14px] text-[#1A130E] w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-[#747474] hover:text-[#1A130E] p-0.5">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isRequiredSatisfied}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B84A22] to-[#FBA138] hover:from-[#9E3E1B] hover:to-[#E59128] text-white text-[14px] font-semibold flex items-center justify-between shadow-[0_4px_14px_rgba(184,74,34,0.3)] disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
          >
            <span>Add to Cart</span>
            <span>€{grandTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
