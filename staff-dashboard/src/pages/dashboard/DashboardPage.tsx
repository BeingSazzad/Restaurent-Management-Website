import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { KdsPipeline } from '../../components/dashboard/KdsPipeline';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Flame, Clock } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addOrder } from '../../store/slices/orderSlice';
import { KdsOrder } from '../../types/common.types';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const [isFireTicketModalOpen, setIsFireTicketModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [notes, setNotes] = useState('');

  const handleCreateManualTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ord-${Date.now().toString().slice(-4)}`;
    const manualOrder: KdsOrder = {
      id: newId,
      orderNumber: `#AS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim() || 'Walk-in Table Guest',
      customerPhone: '+353 1 234 5678',
      customerEmail: 'guest@table.local',
      fulfillmentType: 'collection',
      subtotal: 34.50,
      deliveryFee: 0,
      discount: 0,
      total: 34.50,
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 18,
      specialNotes: notes.trim() || undefined,
      paymentMethod: 'cash_at_counter',
      items: [
        {
          cartItemId: 'item-m-1',
          dish: {
            id: 'd-1',
            name: 'Chicken Tikka Biryani',
            category: 'biryani',
            categoryLabel: 'Dum Biryani',
            price: 15.50,
            image: '',
            isAvailable: true,
          },
          quantity: 2,
          selectedModifiers: [],
          specialInstructions: 'Extra Raita',
          totalPrice: 31.00,
        },
        {
          cartItemId: 'item-m-2',
          dish: {
            id: 'd-2',
            name: 'Garlic Coriander Naan',
            category: 'breads',
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
    setCustomerName('');
    setNotes('');
    setIsFireTicketModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen Orders"
        description="Track and manage live orders across preparation stations."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsFireTicketModalOpen(true)}
          >
            New Ticket
          </Button>
        }
      />

      <KdsPipeline />

      {/* Manual Ticket Creation Modal */}
      <Modal
        isOpen={isFireTicketModalOpen}
        onClose={() => setIsFireTicketModalOpen(false)}
        title="New Order Ticket"
        subtitle="Create a walk-in or manual order for the kitchen"
        maxWidth="md"
      >
        <form onSubmit={handleCreateManualTicket} className="space-y-4">
          <Input
            label="Customer Name / Identifier"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Walk-in Guest / Liam"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Table / Station Location"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. Table 4 / Patio"
            />
            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-700">Estimated Target</label>
              <div className="h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 flex items-center gap-1.5 text-xs text-stone-700">
                <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>18 Mins Standard</span>
              </div>
            </div>
          </div>

          <Input
            label="Chef Instructions / Allergies"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Nut allergy, extra spicy sauce on side"
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFireTicketModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Flame className="w-3.5 h-3.5" />}
            >
              Send to Line Cooks
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DashboardPage;
