import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppDispatch } from '../../store/hooks';
import { addOrder } from '../../store/slices/orderSlice';
import { KdsOrder } from '../../types/common.types';
import { Flame, CheckCircle2 } from 'lucide-react';

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [tableOrType, setTableOrType] = useState('Table 4');
  const [selectedStation, setSelectedStation] = useState<'biryani' | 'curries' | 'grill'>('curries');
  const [specialNote, setSpecialNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFireTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `#AS-${Math.floor(1000 + Math.random() * 9000)}`;

    const dishPresets = {
      curries: {
        id: 'd-curry',
        name: 'Murgh Makhani Karahi',
        category: 'curries' as const,
        categoryLabel: 'Karahi & Curries',
        price: 16.50,
        image: '',
        isAvailable: true,
      },
      biryani: {
        id: 'd-biryani',
        name: 'Awadhi Dum Gosht Biryani',
        category: 'biryani' as const,
        categoryLabel: 'Dum Biryani',
        price: 17.50,
        image: '',
        isAvailable: true,
      },
      grill: {
        id: 'd-grill',
        name: 'Tandoori Seekh Kebab Platter',
        category: 'grill' as const,
        categoryLabel: 'Tandoor Grill',
        price: 18.00,
        image: '',
        isAvailable: true,
      },
    };

    const chosenDish = dishPresets[selectedStation];

    const manualOrder: KdsOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: orderNum,
      customerName: guestName.trim() || `${tableOrType} Guest`,
      customerPhone: '+353 1 234 5678',
      customerEmail: 'walkin@amberspice.ie',
      fulfillmentType: tableOrType.toLowerCase().includes('delivery') ? 'delivery' : 'collection',
      subtotal: chosenDish.price + 3.50,
      deliveryFee: 0,
      discount: 0,
      total: chosenDish.price + 3.50,
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 18,
      specialNotes: specialNote.trim() ? `${tableOrType}: ${specialNote.trim()}` : tableOrType,
      paymentMethod: 'cash_at_counter',
      items: [
        {
          cartItemId: `item-${Date.now()}-1`,
          dish: chosenDish,
          quantity: 1,
          selectedModifiers: [],
          specialInstructions: 'Cooked fresh on order',
          totalPrice: chosenDish.price,
        },
        {
          cartItemId: `item-${Date.now()}-2`,
          dish: {
            id: 'd-naan',
            name: 'Garlic Coriander Naan',
            category: 'breads' as const,
            categoryLabel: 'Clay Oven Breads',
            price: 3.50,
            image: '',
            isAvailable: true,
          },
          quantity: 1,
          selectedModifiers: [],
          totalPrice: 3.50,
        },
      ],
    };

    dispatch(addOrder(manualOrder));
    setGuestName('');
    setSpecialNote('');
    setIsManualModalOpen(false);
    showToast(`Ticket ${orderNum} fired to kitchen brigade!`);
  };

  return (
    <div className="flex h-screen bg-[#FBF9F7] text-stone-900 overflow-hidden select-none font-sans antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standalone KDS / Staff Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar with Shift Clock, Sound, Fullscreen & Rush Controls */}
        <Topbar onFireManualTicket={() => setIsManualModalOpen(true)} />

        {/* Scrollable Workspace Container with standard dashboard margins */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1750px] mx-auto px-8 sm:px-10 lg:px-12 xl:px-16 py-7">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Manual Ticket Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="New Order Ticket"
        subtitle="Create a walk-in or manual order for the kitchen"
        maxWidth="md"
      >
        <form onSubmit={handleFireTicket} className="space-y-4">
          <Input
            label="Customer / Table Reference"
            placeholder="e.g. Table 4 / Liam Walk-in"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-700">Order Channel</label>
              <select
                value={tableOrType}
                onChange={(e) => setTableOrType(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-900 outline-none focus:border-[#F15A24] cursor-pointer"
              >
                <option value="Table 1">Dine-In: Table 1</option>
                <option value="Table 4">Dine-In: Table 4</option>
                <option value="Table 8">Dine-In: Table 8</option>
                <option value="Counter Pickup">Counter Pickup</option>
                <option value="Phone Takeaway">Phone Takeaway</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-700">Kitchen Station Target</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value as 'biryani' | 'curries' | 'grill')}
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-900 outline-none focus:border-[#F15A24] cursor-pointer"
              >
                <option value="curries">Curry Station (Murgh Makhani)</option>
                <option value="biryani">Biryani Line (Dum Biryani)</option>
                <option value="grill">Tandoor Grill (Seekh Platter)</option>
              </select>
            </div>
          </div>

          <Input
            label="Special Instructions"
            placeholder="e.g. Mild spice, extra sauce"
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Flame className="w-3.5 h-3.5" />}
            >
              Send to Kitchen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DashboardLayout;
