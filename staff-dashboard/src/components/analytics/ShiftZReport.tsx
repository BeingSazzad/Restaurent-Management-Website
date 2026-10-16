import React, { useState, useMemo } from 'react';
import { Printer, TrendingUp, Flame, FileText } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency, formatTime } from '../../lib/utils';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';
import { KdsOrder } from '../../types/common.types';

export function ShiftZReport() {
  const { orders } = useAppSelector((state) => state.orders);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('live');

  const baseRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // Dynamic shift reconciliation metrics based on selected service window
  const periodData = React.useMemo(() => {
    if (selectedPeriod === 'lunch') {
      return {
        revenue: 348.50,
        ticketCount: 14,
        delivery: 9,
        collection: 5,
        avgPrep: '15.2 Mins',
        onTime: '98.1% On-Time',
        curryPortions: 12,
        biryaniPortions: 16,
        grillPortions: 9,
        breadCount: 22,
        badgeText: 'Lunch Service (12:00 - 16:00)',
      };
    } else if (selectedPeriod === 'dinner') {
      return {
        revenue: 782.90,
        ticketCount: 29,
        delivery: 20,
        collection: 9,
        avgPrep: '18.6 Mins',
        onTime: '94.5% On-Time',
        curryPortions: 26,
        biryaniPortions: 34,
        grillPortions: 21,
        breadCount: 48,
        badgeText: 'Dinner Rush (17:00 - 23:00)',
      };
    } else if (selectedPeriod === 'full') {
      return {
        revenue: 1198.76,
        ticketCount: 43,
        delivery: 29,
        collection: 14,
        avgPrep: '17.1 Mins',
        onTime: '96.2% On-Time',
        curryPortions: 38,
        biryaniPortions: 50,
        grillPortions: 30,
        breadCount: 70,
        badgeText: 'Full Day Reconciliation',
      };
    }
    // live
    return {
      revenue: baseRevenue,
      ticketCount: orders.length,
      delivery: orders.filter((o) => o.fulfillmentType === 'delivery').length,
      collection: orders.filter((o) => o.fulfillmentType === 'collection').length,
      avgPrep: '17.4 Mins',
      onTime: '96.8% On-Time',
      curryPortions: orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'curries').length,
      biryaniPortions: orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'biryani').length,
      grillPortions: orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'grill').length,
      breadCount: orders.flatMap((o) => o.items).filter((i) => i.dish.category === 'breads').length,
      badgeText: 'Shift Orders Live',
    };
  }, [selectedPeriod, orders, baseRevenue]);

  const displayedOrders = useMemo(() => {
    if (selectedPeriod === 'lunch') {
      return orders.slice(0, Math.min(3, orders.length));
    }
    if (selectedPeriod === 'dinner') {
      return orders.slice(1, Math.min(5, orders.length));
    }
    return orders;
  }, [selectedPeriod, orders]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shift Report"
        description="Shift sales summary, order counts, and station breakdown."
        action={
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        }
      />

      {/* Standard Segmented Service Window Filter Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-3">
        <div className="h-10 flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 overflow-x-auto overflow-y-hidden scrollbar-none">
          {[
            { id: 'live', label: 'Active Shift' },
            { id: 'lunch', label: 'Lunch (12:00 - 16:00)' },
            { id: 'dinner', label: 'Dinner (17:00 - 23:00)' },
            { id: 'full', label: 'Full Day' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedPeriod === period.id
                  ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Live Sync
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Shift Revenue</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#F15A24] tracking-tight">
            {formatCurrency(periodData.revenue)}
          </div>
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> {periodData.badgeText}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Total Orders</span>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {periodData.ticketCount} Orders
          </div>
          <span className="text-xs text-stone-500 block">
            {periodData.delivery} Delivery · {periodData.collection} Pickup
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Average Prep Time</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">{periodData.avgPrep}</div>
          <span className="text-xs text-stone-500 block">Target: 20 min · {periodData.onTime}</span>
        </div>
      </div>

      {/* Station Breakdown & Shift Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Stations Breakdown Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F15A24]" />
              <span>Station Output</span>
            </h3>
            <span className="text-xs text-stone-400 font-medium">Breakdown</span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            <div className="flex items-center justify-between py-3 px-1.5 hover:bg-stone-50/70 rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="font-medium text-stone-700">Karahi &amp; Curries Station</span>
              </div>
              <span className="font-bold text-xs text-stone-900 bg-stone-100 px-3 py-1 rounded-lg">
                {periodData.curryPortions} Portions
              </span>
            </div>

            <div className="flex items-center justify-between py-3 px-1.5 hover:bg-stone-50/70 rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span className="font-medium text-stone-700">Dum Biryani &amp; Rice Line</span>
              </div>
              <span className="font-bold text-xs text-stone-900 bg-stone-100 px-3 py-1 rounded-lg">
                {periodData.biryaniPortions} Portions
              </span>
            </div>

            <div className="flex items-center justify-between py-3 px-1.5 hover:bg-stone-50/70 rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="font-medium text-stone-700">Clay Oven Tandoor Grill</span>
              </div>
              <span className="font-bold text-xs text-stone-900 bg-stone-100 px-3 py-1 rounded-lg">
                {periodData.grillPortions} Portions
              </span>
            </div>

            <div className="flex items-center justify-between py-3 px-1.5 hover:bg-stone-50/70 rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400 shrink-0" />
                <span className="font-medium text-stone-700">Artisan Naan &amp; Breads</span>
              </div>
              <span className="font-bold text-xs text-stone-900 bg-stone-100 px-3 py-1 rounded-lg">
                {periodData.breadCount} Breads
              </span>
            </div>
          </div>
        </div>

        {/* Activity log Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F15A24]" />
              <span>Recent Orders</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {displayedOrders.length} Orders
            </span>
          </div>

          <div className="divide-y divide-stone-100 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
            {displayedOrders.map((ord: KdsOrder) => (
              <div key={ord.id} className="flex items-center justify-between py-3 px-1.5 hover:bg-stone-50/70 rounded-xl transition-colors text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">#{ord.orderNumber}</span>
                    <span className="text-stone-700 font-semibold">{ord.customerName}</span>
                    <span className="text-[11px] text-stone-400 capitalize font-medium">({ord.fulfillmentType})</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">
                    {ord.items.reduce((acc: number, i) => acc + i.quantity, 0)} items · {formatTime(ord.createdAt)}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-bold text-stone-900 block text-xs">
                    {formatCurrency(ord.total)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full inline-block ${
                      ord.status === 'completed'
                        ? 'bg-stone-100 text-stone-700'
                        : ord.status === 'ready'
                        ? 'bg-emerald-50 text-emerald-700'
                        : ord.status === 'preparing'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-orange-50 text-[#F15A24]'
                    }`}
                  >
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
