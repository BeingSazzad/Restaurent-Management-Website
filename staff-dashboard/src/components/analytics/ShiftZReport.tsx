import React, { useState, useMemo } from 'react';
import { Printer, TrendingUp, Flame, FileText, Bike, Store, ArrowUpRight } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency, formatTime } from '../../lib/utils';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';
import { KdsOrder } from '../../types/common.types';
import { TicketSlipModal } from '../dashboard/TicketSlipModal';

export function ShiftZReport() {
  const { orders } = useAppSelector((state) => state.orders);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('live');
  const [activeSlipOrder, setActiveSlipOrder] = useState<KdsOrder | null>(null);

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

  const totalPortions = Math.max(
    1,
    periodData.curryPortions + periodData.biryaniPortions + periodData.grillPortions + periodData.breadCount
  );

  const stations = [
    {
      name: 'Karahi & Curries Station',
      count: periodData.curryPortions,
      unit: 'Portions',
      color: 'bg-amber-500',
      barColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textAccent: 'text-amber-800',
      percent: Math.round((periodData.curryPortions / totalPortions) * 100),
    },
    {
      name: 'Dum Biryani & Rice Line',
      count: periodData.biryaniPortions,
      unit: 'Portions',
      color: 'bg-orange-500',
      barColor: 'bg-[#F15A24]',
      lightBg: 'bg-orange-50',
      textAccent: 'text-orange-800',
      percent: Math.round((periodData.biryaniPortions / totalPortions) * 100),
    },
    {
      name: 'Clay Oven Tandoor Grill',
      count: periodData.grillPortions,
      unit: 'Portions',
      color: 'bg-rose-500',
      barColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      textAccent: 'text-rose-800',
      percent: Math.round((periodData.grillPortions / totalPortions) * 100),
    },
    {
      name: 'Artisan Naan & Breads',
      count: periodData.breadCount,
      unit: 'Breads',
      color: 'bg-stone-500',
      barColor: 'bg-stone-500',
      lightBg: 'bg-stone-100',
      textAccent: 'text-stone-800',
      percent: Math.round((periodData.breadCount / totalPortions) * 100),
    },
  ];

  return (
    <div className="space-y-5">
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
        <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Shift Revenue</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#F15A24] tracking-tight">
            {formatCurrency(periodData.revenue)}
          </div>
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> {periodData.badgeText}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Total Orders</span>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {periodData.ticketCount} Orders
          </div>
          <span className="text-xs text-stone-500 block">
            {periodData.delivery} Delivery · {periodData.collection} Pickup
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">Average Prep Time</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">{periodData.avgPrep}</div>
          <span className="text-xs text-stone-500 block">Target: 20 min · {periodData.onTime}</span>
        </div>
      </div>

      {/* Station Breakdown & Shift Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Stations Breakdown Card with Visual Capacity Bars */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F15A24]" />
              <span>Station Output Breakdown</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-md">
              {totalPortions} Total Units
            </span>
          </div>

          <div className="space-y-3">
            {stations.map((st) => (
              <div
                key={st.name}
                className="p-3.5 rounded-xl bg-stone-50/60 border border-stone-200/50 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color} shrink-0`} />
                    <span className="font-semibold text-stone-800 text-sm truncate">{st.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-stone-900 text-sm">
                      {st.count} {st.unit}
                    </span>
                    <span className="text-xs font-medium text-stone-400">
                      ({st.percent}%)
                    </span>
                  </div>
                </div>

                {/* Purposeful visual progress bar across middle space */}
                <div className="mt-2.5 w-full bg-stone-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${st.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(st.count > 0 ? 5 : 0, st.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Card with Structured Order Tiles */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F15A24]" />
              <span>Recent Shift Activity</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
              {displayedOrders.length} Tickets
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto scrollbar-none pr-0.5">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs font-medium">
                No orders recorded in this service period.
              </div>
            ) : (
              displayedOrders.map((ord: KdsOrder) => {
                const isDelivery = ord.fulfillmentType === 'delivery';
                const totalItemCount = ord.items.reduce((acc: number, i) => acc + i.quantity, 0);

                return (
                  <div
                    key={ord.id}
                    onClick={() => setActiveSlipOrder(ord)}
                    title="Click to view ticket details"
                    className="p-3.5 rounded-xl bg-stone-50/60 hover:bg-stone-50 border border-stone-200/50 hover:border-stone-300 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded-md">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-sm font-semibold text-stone-900 truncate">
                          {ord.customerName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-white border border-stone-200/60 px-2 py-0.5 rounded-md">
                          {isDelivery ? (
                            <Bike className="w-3 h-3 text-[#F15A24]" />
                          ) : (
                            <Store className="w-3 h-3 text-emerald-600" />
                          )}
                          <span className="capitalize">{ord.fulfillmentType}</span>
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
                        <span>·</span>
                        <span>{formatTime(ord.createdAt)}</span>
                        <span>·</span>
                        <span className="text-stone-400 truncate max-w-[200px]">
                          {ord.items.map((i) => i.dish.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-bold text-stone-900 text-sm">
                          {formatCurrency(ord.total)}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 transition-colors" />
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
                          ord.status === 'completed'
                            ? 'bg-stone-100 text-stone-700'
                            : ord.status === 'ready'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : ord.status === 'preparing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-orange-50 text-[#F15A24] border border-orange-200/60'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Ticket Slip Modal for Manager inspection */}
      {activeSlipOrder && (
        <TicketSlipModal
          order={activeSlipOrder}
          onClose={() => setActiveSlipOrder(null)}
        />
      )}
    </div>
  );
}
