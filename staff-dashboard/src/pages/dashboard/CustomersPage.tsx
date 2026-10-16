import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Award,
  Crown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  getCustomersList,
  addCustomer,
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'active' | 'new'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected customer for quick detail view
  const [selectedCustomer, setSelectedCustomer] = useState<RegisteredCustomer | null>(null);

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

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
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

  const kpis = useMemo(() => {
    const total = customers.length;
    const vips = customers.filter((c) => c.status === 'vip').length;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgSpend = total > 0 ? totalRevenue / total : 0;
    return {
      total,
      vips,
      avgSpend,
    };
  }, [customers]);

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
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Customers & Diners"
        description="Directory of registered diners, customer accounts, orders placed, and lifetime spend."
        action={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Diner Account
          </Button>
        }
      />

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Diners */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Registered Diners
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F15A24] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">{kpis.total}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +23.5% Growth
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Verified Dublin accounts</p>
        </div>

        {/* VIP Loyalty Diners */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              VIP Loyalty Diners
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">{kpis.vips}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              3+ Repeat Orders
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">High retention diner tier</p>
        </div>

        {/* Avg Lifetime Spend */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Avg Lifetime Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">{formatCurrency(kpis.avgSpend)}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +14.2% LTV
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Net customer value</p>
        </div>

        {/* Dublin Delivery Zones */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Delivery Coverage
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">6 Zones</span>
            <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
              D1 · D2 · D4 · D6 · D8
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Active delivery radius</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by diner name, email, phone, or address..."
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
            { id: 'all', label: 'All Diners', count: customers.length },
            { id: 'vip', label: 'VIP Loyalty', count: customers.filter((c) => c.status === 'vip').length },
            { id: 'active', label: 'Active', count: customers.filter((c) => c.status === 'active').length },
            { id: 'new', label: 'New Signups', count: customers.filter((c) => c.status === 'new').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-stone-100 text-stone-800 font-bold' : 'bg-stone-200/60 text-stone-500'
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
                <th className="py-3.5 px-4">Diner Details</th>
                <th className="py-3.5 px-4">Contact &amp; Eircode</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Favorite Dish</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Diner Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0 border border-stone-200/60">
                          {c.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 leading-tight">{c.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" />
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Eircode */}
                    <td className="py-3.5 px-4">
                      <p className="text-stone-800 font-medium text-xs flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {c.phone}
                      </p>
                      <p className="text-[11.5px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {c.eircode} · {c.deliveryAddress.split(',')[0]}
                      </p>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-600 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>
                          {new Date(c.registeredAt).toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-stone-400 mt-0.5 block">
                        Last order: {new Date(c.lastOrderDate).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-stone-100 text-stone-900 font-bold text-xs">
                        {c.totalOrders}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900">
                        {formatCurrency(c.totalSpent)}
                      </span>
                    </td>

                    {/* Favorite Dish */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-stone-700 bg-stone-50 border border-stone-200/70 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F15A24]" />
                        {c.favoriteDish}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {c.status === 'vip' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          VIP Diner
                        </span>
                      )}
                      {c.status === 'active' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                      {c.status === 'new' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          New
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Quick Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Diner Profile: ${selectedCustomer.name}`}
          subtitle="Account details, order history summary, and delivery location"
          maxWidth="md"
        >
          <div className="space-y-4">
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
                <span className="text-stone-400 block mb-1">Registered Since</span>
                <span className="font-semibold text-stone-800">
                  {new Date(selectedCustomer.registeredAt).toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white">
                <span className="text-stone-400 block mb-1">Orders Count</span>
                <span className="font-semibold text-stone-800">{selectedCustomer.totalOrders} Completed Orders</span>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-white col-span-2">
                <span className="text-stone-400 block mb-1">Delivery Address &amp; Eircode</span>
                <span className="font-semibold text-stone-800">
                  {selectedCustomer.deliveryAddress} ({selectedCustomer.eircode})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Diner Account Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer Account"
        subtitle="Register a new customer account in the Amber Spice directory"
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
