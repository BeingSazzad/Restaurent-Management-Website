import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Receipt,
  Printer,
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
  }, [transactions, methodFilter, searchQuery]);

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'apple_pay':
        return 'Apple Pay';
      case 'card':
        return 'Card';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Payment records and order history."
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
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[13px]">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Order Ref */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-900 text-xs">
                        #{t.orderNumber}
                      </span>
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-900">
                        {t.customerName}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4">
                      <span className="text-stone-700 text-xs font-medium">
                        {getMethodLabel(t.paymentMethod)}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 text-[13.5px]">
                        {formatCurrency(t.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Settled
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4">
                      <span className="text-stone-600 text-xs font-medium whitespace-nowrap">
                        {new Date(t.timestamp).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                        })}, {new Date(t.timestamp).toLocaleTimeString('en-IE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveSlipTxn(t)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                      >
                        Receipt
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
                <span>Email:</span>
                <span>{activeSlipTxn.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span>
                  {new Date(activeSlipTxn.timestamp).toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  {new Date(activeSlipTxn.timestamp).toLocaleTimeString('en-IE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
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
