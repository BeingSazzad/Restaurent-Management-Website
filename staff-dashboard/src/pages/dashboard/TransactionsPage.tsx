import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  X,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Smartphone,
  Banknote,
} from 'lucide-react';
import {
  getTransactionsList,
  TransactionRecord,
} from '../../services/transactionService';
import { PageHeader } from '../../components/layout/PageHeader';
import { formatCurrency } from '../../lib/utils';

export function TransactionsPage() {
  const [transactions] = useState<TransactionRecord[]>(() => getTransactionsList());
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'apple_pay' | 'card' | 'cash'>('all');

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.orderNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, methodFilter, searchQuery]);

  const kpis = useMemo(() => {
    const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
    const digitalVolume = transactions
      .filter((t) => t.paymentMethod === 'apple_pay' || t.paymentMethod === 'card')
      .reduce((acc, t) => acc + t.amount, 0);
    const cashVolume = transactions
      .filter((t) => t.paymentMethod === 'cash')
      .reduce((acc, t) => acc + t.amount, 0);
    return { totalVolume, digitalVolume, cashVolume };
  }, [transactions]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Transactions"
        description="Payment history, payment methods, and settled revenue audit trail."
      />

      {/* 3 Minimal KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Settled Revenue
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">
              {formatCurrency(kpis.totalVolume)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Total reconciled turnover</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Card &amp; Apple Pay
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">
              {formatCurrency(kpis.digitalVolume)}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              91% Digital
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Contactless &amp; online orders</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
            Cash on Delivery
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">
              {formatCurrency(kpis.cashVolume)}
            </span>
            <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
              9% Cash
            </span>
          </div>
          <span className="text-[11.5px] text-stone-400 mt-0.5 block">Driver handover &amp; till</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by TXN ref, Order #, or diner name..."
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
            { id: 'apple_pay', label: 'Apple Pay' },
            { id: 'card', label: 'Card' },
            { id: 'cash', label: 'Cash' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMethodFilter(tab.id as any)}
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                methodFilter === tab.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">TXN Ref</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-stone-800">
                      {t.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700 text-xs">
                      #{t.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900 text-xs">
                      {t.customerName}
                    </td>
                    <td className="py-3 px-4">
                      {t.paymentMethod === 'apple_pay' && (
                        <span className="text-xs text-stone-700 font-medium inline-flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                          Apple Pay
                        </span>
                      )}
                      {t.paymentMethod === 'card' && (
                        <span className="text-xs text-blue-700 font-medium inline-flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          Card
                        </span>
                      )}
                      {t.paymentMethod === 'cash' && (
                        <span className="text-xs text-amber-700 font-medium inline-flex items-center gap-1">
                          <Banknote className="w-3.5 h-3.5 text-amber-600" />
                          Cash
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 text-xs">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Settled
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-stone-500">
                      {new Date(t.timestamp).toLocaleTimeString('en-IE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      , {new Date(t.timestamp).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
