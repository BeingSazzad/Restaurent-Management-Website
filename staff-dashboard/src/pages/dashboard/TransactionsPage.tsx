import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Search,
  X,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Smartphone,
  Banknote,
  Calendar,
  ExternalLink,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import {
  getTransactionsList,
  TransactionRecord,
} from '../../services/transactionService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../lib/utils';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() =>
    getTransactionsList()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'apple_pay' | 'card' | 'cash'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'settled' | 'pending' | 'refunded'>('all');
  const [activeSlipTxn, setActiveSlipTxn] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setTransactions(getTransactionsList());
    };
    window.addEventListener('amber_spice_transactions_updated', handleSync);
    return () => window.removeEventListener('amber_spice_transactions_updated', handleSync);
  }, []);

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.orderNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, methodFilter, statusFilter, searchQuery]);

  const kpis = useMemo(() => {
    const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
    const digitalVolume = transactions
      .filter((t) => t.paymentMethod === 'apple_pay' || t.paymentMethod === 'card')
      .reduce((acc, t) => acc + t.amount, 0);
    const cashVolume = transactions
      .filter((t) => t.paymentMethod === 'cash')
      .reduce((acc, t) => acc + t.amount, 0);
    const digitalPct = totalVolume > 0 ? Math.round((digitalVolume / totalVolume) * 100) : 0;
    return {
      totalVolume,
      digitalVolume,
      cashVolume,
      digitalPct,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Payment records and revenue."
        action={
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Export
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Settled Volume */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(kpis.totalVolume)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Settled payments</p>
        </div>

        {/* Digital / Card Settlements */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Card &amp; Digital
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(kpis.digitalVolume)}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {kpis.digitalPct}% Digital
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Online payments</p>
        </div>

        {/* Cash Settlements */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Cash
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(kpis.cashVolume)}
            </span>
            <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
              {100 - kpis.digitalPct}% Cash
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">Cash payments</p>
        </div>

        {/* Settlement Health */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Settlement
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold text-stone-900">100%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              0 Disputes
            </span>
          </div>
          <p className="text-[11.5px] text-stone-400 mt-1">No disputes</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions..."
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

        {/* Tender Method Filters */}
        <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'apple_pay', label: 'Apple Pay' },
            { id: 'card', label: 'Card' },
            { id: 'cash', label: 'Cash' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMethodFilter(tab.id as any)}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                methodFilter === tab.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">TXN ID</th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Transaction Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-stone-900 bg-stone-100 px-2 py-1 rounded-md border border-stone-200/60">
                        {t.id}
                      </span>
                    </td>

                    {/* Order Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800 text-xs hover:text-[#F15A24] cursor-pointer inline-flex items-center gap-1">
                        #{t.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900 leading-tight">{t.customerName}</p>
                      <p className="text-[11.5px] text-stone-400 mt-0.5">{t.customerEmail}</p>
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {t.paymentMethod === 'apple_pay' && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-stone-800 font-medium bg-stone-100 px-2.5 py-1 rounded-lg">
                            <Smartphone className="w-3.5 h-3.5 text-stone-700" />
                            Apple Pay
                          </span>
                        )}
                        {t.paymentMethod === 'card' && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-stone-800 font-medium bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200/60">
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            {t.methodLabel}
                          </span>
                        )}
                        {t.paymentMethod === 'cash' && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                            <Banknote className="w-3.5 h-3.5 text-amber-600" />
                            Cash
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 text-sm">
                        {formatCurrency(t.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Settled
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-stone-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>
                          {new Date(t.timestamp).toLocaleTimeString('en-IE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-stone-400 block mt-0.5">
                        {new Date(t.timestamp).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveSlipTxn(t)}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Receipt Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {activeSlipTxn && (
        <Modal
          isOpen={!!activeSlipTxn}
          onClose={() => setActiveSlipTxn(null)}
          title={`Receipt: ${activeSlipTxn.id}`}
          subtitle="Transaction payment details."
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="border border-dashed border-stone-300 rounded-xl p-5 bg-stone-50 font-mono text-xs text-stone-800 space-y-2.5">
              <div className="text-center pb-3 border-b border-stone-200">
                <p className="font-bold text-stone-900 text-sm">AMBER SPICE RESTAURANT</p>
                <p className="text-[11px] text-stone-500">18 South William Street, Dublin 2</p>
                <p className="text-[11px] text-stone-500">VAT Reg: IE 3849201H</p>
              </div>

              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-bold">{activeSlipTxn.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <span className="font-bold">#{activeSlipTxn.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{activeSlipTxn.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Tender Type:</span>
                <span>{activeSlipTxn.methodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Terminal Gateway:</span>
                <span>{activeSlipTxn.terminalRef || 'STRIPE_GATEWAY_IE'}</span>
              </div>

              <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Settled (EUR):</span>
                <span>{formatCurrency(activeSlipTxn.amount)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSlipTxn(null)}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Receipt Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TransactionsPage;
