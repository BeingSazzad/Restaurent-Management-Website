import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Flame,
  Printer,
  BarChart3,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { ShiftZReport } from '../../components/analytics/ShiftZReport';

interface BestSellingDish {
  id: string;
  name: string;
  category: string;
  portionsSold: number;
  revenue: number;
  salesShare: number;
  badge?: string;
}

const TOP_SELLING_DISHES: BestSellingDish[] = [
  {
    id: 'dish-curry-01',
    name: 'Old Delhi Butter Chicken',
    category: 'Curries',
    portionsSold: 94,
    revenue: 1221.06,
    salesShare: 24.5,
    badge: '🔥 #1 Seller',
  },
  {
    id: 'dish-biryani-01',
    name: 'Royal Chicken Dum Biryani',
    category: 'Biryani',
    portionsSold: 88,
    revenue: 1231.12,
    salesShare: 22.9,
    badge: '👑 Signature',
  },
  {
    id: 'dish-bread-01',
    name: 'Tandoori Garlic Butter Naan',
    category: 'Breads',
    portionsSold: 142,
    revenue: 639.00,
    salesShare: 37.0,
    badge: '🥖 Top Side',
  },
  {
    id: 'dish-grill-01',
    name: 'Flame-Grilled Tandoori Chicken',
    category: 'Grill',
    portionsSold: 56,
    revenue: 756.00,
    salesShare: 14.6,
  },
  {
    id: 'dish-curry-02',
    name: 'Kashmiri Lamb Rogan Josh',
    category: 'Curries',
    portionsSold: 42,
    revenue: 629.58,
    salesShare: 10.9,
  },
];

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'growth' | 'shift_z'>('growth');

  const totalRevenue = 3842.50;
  const totalOrdersCount = 146;
  const registeredUsersCount = 84;

  return (
    <div className="space-y-4">
      {/* Header & Sub-tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Analytics &amp; Growth
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Key growth metrics and top selling menu items.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'growth'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>Executive Growth</span>
          </button>
          <button
            onClick={() => setActiveTab('shift_z')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shift_z'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Kitchen Z-Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'shift_z' ? (
        <ShiftZReport />
      ) : (
        <div className="space-y-4">
          {/* 3 Growth KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Income Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
                Total Income
              </span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
              </div>
              <span className="text-[11.5px] text-stone-400 mt-0.5 block">vs. prior 7 days (€3,245.10)</span>
            </div>

            {/* Order Volume Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
                Order Growth
              </span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {totalOrdersCount} Orders
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.6%
                </span>
              </div>
              <span className="text-[11.5px] text-stone-400 mt-0.5 block">68% Delivery · 32% Collection</span>
            </div>

            {/* Customer Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
                User Growth
              </span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {registeredUsersCount} Diners
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +23.5%
                </span>
              </div>
              <span className="text-[11.5px] text-stone-400 mt-0.5 block">+16 new registrations this week</span>
            </div>
          </div>

          {/* Top Selling Items Leaderboard */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F15A24]" />
                <h2 className="text-sm font-bold text-stone-900">
                  Top Selling Items
                </h2>
              </div>
              <span className="text-xs text-stone-400">Rolling 7 days sales volume</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-2 px-3 w-12 text-center">#</th>
                    <th className="py-2 px-3">Item Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-center">Portions Sold</th>
                    <th className="py-2 px-3">Gross Revenue</th>
                    <th className="py-2 px-3 text-right">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[13px]">
                  {TOP_SELLING_DISHES.map((dish, idx) => (
                    <tr key={dish.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-2.5 px-3 text-center text-xs font-bold text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900 text-xs">
                        {dish.name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {dish.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-stone-900 text-xs">
                        {dish.portionsSold}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-stone-900 text-xs">
                        {formatCurrency(dish.revenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {dish.badge ? (
                          <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                            {dish.badge}
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-stone-400">Regular</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
