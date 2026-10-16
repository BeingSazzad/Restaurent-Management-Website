import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  X,
  Crown,
  CheckCircle2,
  Ban,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  getCustomersList,
  addCustomer,
  banCustomer,
  unbanCustomer,
  RegisteredCustomer,
} from '../../services/customerService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';

export function CustomersPage() {
  const [customers, setCustomers] = useState<RegisteredCustomer[]>(() => getCustomersList());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'active' | 'new' | 'banned'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected customer for quick detail view
  const [selectedCustomer, setSelectedCustomer] = useState<RegisteredCustomer | null>(null);

  // Customer to ban state
  const [customerToBan, setCustomerToBan] = useState<RegisteredCustomer | null>(null);
  const [banReason, setBanReason] = useState('Repeated fake or cancelled orders');

  // New customer form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newEircode, setNewEircode] = useState('');
  const [newFavDish, setNewFavDish] = useState('Old Delhi Butter Chicken');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleSync = () => {
      setCustomers(getCustomersList());
    };
    window.addEventListener('amber_spice_customers_updated', handleSync);
    return () => window.removeEventListener('amber_spice_customers_updated', handleSync);
  }, []);

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToBan) return;
    const updated = banCustomer(customerToBan.id, banReason);
    setCustomers(getCustomersList());
    if (selectedCustomer && selectedCustomer.id === customerToBan.id && updated) {
      setSelectedCustomer(updated);
    }
    showToast(`✓ ${customerToBan.name} has been banned.`);
    setCustomerToBan(null);
  };

  const handleUnban = (c: RegisteredCustomer) => {
    const updated = unbanCustomer(c.id);
    setCustomers(getCustomersList());
    if (selectedCustomer && selectedCustomer.id === c.id && updated) {
      setSelectedCustomer(updated);
    }
    showToast(`✓ ${c.name} has been unbanned.`);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const isBanned = c.isBanned || c.status === 'banned';
      if (statusFilter === 'banned') {
        if (!isBanned) return false;
      } else if (statusFilter !== 'all') {
        if (isBanned) return false;
        if (c.status !== statusFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.deliveryAddress.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, statusFilter, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addCustomer({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '+353 87 000 0000',
      registeredAt: new Date().toISOString(),
      totalOrders: 1,
      totalSpent: 28.50,
      lastOrderDate: new Date().toISOString(),
      favoriteDish: newFavDish,
      status: 'new',
      deliveryAddress: newAddress.trim() || 'Dublin City Centre',
      eircode: newEircode.trim().toUpperCase() || 'D02 X381',
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
    setNewEircode('');
    setIsAddModalOpen(false);
    showToast(`✓ Account created for ${newName}!`);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Customers"
        description="Manage customer accounts and order history."
        action={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Customer
          </Button>
        }
      />



      {/* Toolbar & Filters */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or email..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: customers.length },
            { id: 'vip', label: 'VIP', count: customers.filter((c) => c.status === 'vip' && !c.isBanned).length },
            { id: 'active', label: 'Active', count: customers.filter((c) => c.status === 'active' && !c.isBanned).length },
            { id: 'new', label: 'New', count: customers.filter((c) => c.status === 'new' && !c.isBanned).length },
            { id: 'banned', label: 'Banned', count: customers.filter((c) => c.isBanned || c.status === 'banned').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? tab.id === 'banned'
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id
                  ? tab.id === 'banned' ? 'bg-rose-700 text-white font-bold' : 'bg-stone-100 text-stone-800 font-bold'
                  : tab.id === 'banned' && tab.count > 0 ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-stone-200/60 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      c.isBanned || c.status === 'banned' ? 'bg-rose-50/25' : ''
                    }`}
                  >
                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                          c.isBanned || c.status === 'banned'
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200/60'
                        }`}>
                          {c.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-stone-900 leading-tight">{c.name}</p>
                            {(c.isBanned || c.status === 'banned') && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded">
                                Banned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4">
                      <span className="text-stone-700 text-xs font-medium">{c.phone}</span>
                    </td>

                    {/* Orders */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-stone-100 text-stone-800 font-bold text-xs">
                        {c.totalOrders}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 text-xs">
                        {formatCurrency(c.totalSpent)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {c.isBanned || c.status === 'banned' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                          <Ban className="w-3 h-3 text-rose-600" />
                          Banned
                        </span>
                      ) : (
                        <>
                          {c.status === 'vip' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              VIP
                            </span>
                          )}
                          {c.status === 'active' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          )}
                          {c.status === 'new' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              New
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer border border-stone-200/60"
                        >
                          View Profile
                        </button>
                        {c.isBanned || c.status === 'banned' ? (
                          <button
                            onClick={() => handleUnban(c)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors cursor-pointer border border-emerald-200 inline-flex items-center gap-1"
                            title="Unban customer"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCustomerToBan(c);
                              setBanReason('Repeated fake or cancelled orders');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-200 inline-flex items-center gap-1"
                            title="Ban customer"
                          >
                            <Ban className="w-3 h-3 text-rose-500" />
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer: ${selectedCustomer.name}`}
          subtitle="Customer account details and order summary."
          maxWidth="md"
        >
          <div className="space-y-4">
            {(selectedCustomer.isBanned || selectedCustomer.status === 'banned') && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-rose-900">This customer account is currently BANNED</p>
                  <p className="mt-0.5 text-rose-700">Reason: {selectedCustomer.banReason || 'Policy violation'}</p>
                  {selectedCustomer.bannedAt && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      Banned on {new Date(selectedCustomer.bannedAt).toLocaleString('en-IE')}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900 text-sm">{selectedCustomer.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{selectedCustomer.email}</p>
                <p className="text-xs text-stone-500">{selectedCustomer.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-stone-400 block">Total Spend</span>
                <span className="text-lg font-bold text-stone-900">{formatCurrency(selectedCustomer.totalSpent)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
                <span className="text-stone-400 block mb-1">Registered</span>
                <span className="font-semibold text-stone-800">
                  {new Date(selectedCustomer.registeredAt).toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
                <span className="text-stone-400 block mb-1">Orders</span>
                <span className="font-semibold text-stone-800">{selectedCustomer.totalOrders} completed</span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
                <span className="text-stone-400 block mb-1">Favorite Dish</span>
                <span className="font-semibold text-stone-800">{selectedCustomer.favoriteDish}</span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
                <span className="text-stone-400 block mb-1">Status</span>
                <span className="font-semibold text-stone-800 uppercase">{selectedCustomer.status}</span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white col-span-2">
                <span className="text-stone-400 block mb-1">Delivery Address</span>
                <span className="font-semibold text-stone-800">
                  {selectedCustomer.deliveryAddress} ({selectedCustomer.eircode})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {selectedCustomer.isBanned || selectedCustomer.status === 'banned' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleUnban(selectedCustomer)}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Unban Customer
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rose-300 text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    setCustomerToBan(selectedCustomer);
                    setBanReason('Repeated fake or cancelled orders');
                  }}
                  leftIcon={<Ban className="w-3.5 h-3.5 text-rose-500" />}
                >
                  Ban Customer
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Ban Confirmation Modal */}
      {customerToBan && (
        <Modal
          isOpen={!!customerToBan}
          onClose={() => setCustomerToBan(null)}
          title={`Ban Customer: ${customerToBan.name}`}
          subtitle="Restrict this customer account from placing orders."
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmBan} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Are you sure you want to ban this customer?</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  {customerToBan.name} ({customerToBan.email}) will be blocked from placing online orders.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">Reason for Ban</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  'Repeated fake or cancelled orders',
                  'Abusive behavior towards staff/drivers',
                  'Chargeback fraud / Payment disputes',
                  'Multiple unauthorized address changes',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBanReason(preset)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer border ${
                      banReason === preset
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Or write custom reason..."
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 outline-none focus:border-rose-400 mt-1"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCustomerToBan(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                leftIcon={<Ban className="w-3.5 h-3.5" />}
              >
                Confirm Ban
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer"
        subtitle="Enter customer details."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Full Name"
            placeholder="e.g. Liam O'Connor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. liam@dublin.ie"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +353 87 234 5678"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Street Address"
              placeholder="e.g. 15 Grafton Street"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Input
              label="Dublin Eircode"
              placeholder="e.g. D02 X381"
              value={newEircode}
              onChange={(e) => setNewEircode(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CustomersPage;
