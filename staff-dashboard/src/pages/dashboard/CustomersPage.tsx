import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  X,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Crown,
  CheckCircle2,
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

  // New customer form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
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
    return { total, vips, avgSpend };
  }, [customers]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newCust = addCustomer({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '+353 87 000 0000',
      registeredAt: new Date().toISOString(),
      totalOrders: 1,
      totalSpent: 28.50,
      lastOrderDate: new Date().toISOString(),
      favoriteDish: 'Old Delhi Butter Chicken',
      status: 'new',
      deliveryAddress: newAddress.trim() || 'Dublin City Centre',
      eircode: 'D02 X381',
    });

    setCustomers((prev) => [newCust, ...prev]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
    setIsAddModalOpen(false);
    showToast(`✓ Registered ${newName}!`);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Registered Diners"
        description="Customer directory, sign-up dates, orders placed, and lifetime spend."
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

      {/* 3 Minimal KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Registered Diners
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{kpis.total}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +23.5%
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Total verified accounts</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            VIP Diners
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">{kpis.vips}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              3+ Orders
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Loyal repeat customers</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Avg Lifetime Spend
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{formatCurrency(kpis.avgSpend)}</span>
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              Per Diner
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Average customer value</span>
        </div>
      </div>

      {/* Toolbar: Search + Quick Filter */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#F15A24] rounded-xl pl-9 pr-8 text-xs font-medium text-stone-900 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'vip', label: 'VIP' },
            { id: 'active', label: 'Active' },
            { id: 'new', label: 'New' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">Diner</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-stone-400">
                    No customers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Diner */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900 leading-tight">{c.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{c.email}</p>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 text-xs text-stone-600">
                      <p>{c.phone}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">{c.eircode || 'Dublin'}</p>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-4 text-xs text-stone-600">
                      {new Date(c.registeredAt).toLocaleDateString('en-IE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Orders */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block min-w-6 px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-900 font-bold text-xs">
                        {c.totalOrders}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-3 px-4 font-bold text-stone-900 text-xs">
                      {formatCurrency(c.totalSpent)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-right">
                      {c.status === 'vip' && (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          VIP
                        </span>
                      )}
                      {c.status === 'active' && (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                      {c.status === 'new' && (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Diner Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer"
        subtitle="Quickly record a new diner account"
        maxWidth="sm"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <Input
            label="Name"
            placeholder="e.g. Liam O'Connor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="e.g. liam@dublin.ie"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Input
            label="Phone"
            placeholder="e.g. +353 87 234 5678"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <Input
            label="Area / Address"
            placeholder="e.g. Dublin 2"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
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
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CustomersPage;
