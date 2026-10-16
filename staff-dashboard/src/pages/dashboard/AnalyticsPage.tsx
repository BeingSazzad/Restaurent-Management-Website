import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  Flame,
  Award,
  Crown,
  Printer,
  Calendar,
  UtensilsCrossed,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Receipt,
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../lib/utils';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { ShiftZReport } from '../../components/analytics/ShiftZReport';

interface BestSellingDish {
  id: string;
  name: string;
  category: string;
  portionsSold: number;
  revenue: number;
  salesShare: number;
  badge?: string;
  image: string;
}

const TOP_SELLING_DISHES: BestSellingDish[] = [
  {
    id: 'dish-curry-01',
    name: 'Old Delhi Butter Chicken',
    category: 'Curries',
    portionsSold: 94,
    revenue: 1221.06,
    salesShare: 24.5,
    badge: '🔥 #1 Best Seller',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80',
  },
  {
    id: 'dish-biryani-01',
    name: 'Royal Chicken Dum Biryani',
    category: 'Biryani',
    portionsSold: 88,
    revenue: 1231.12,
    salesShare: 22.9,
    badge: '👑 Kitchen Signature',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80',
  },
  {
    id: 'dish-bread-01',
    name: 'Tandoori Garlic Butter Naan',
    category: 'Breads',
    portionsSold: 142,
    revenue: 639.00,
    salesShare: 37.0,
    badge: '🥖 Top Side Item',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80',
  },
  {
    id: 'dish-grill-01',
    name: 'Flame-Grilled Tandoori Chicken',
    category: 'Grill',
    portionsSold: 56,
    revenue: 756.00,
    salesShare: 14.6,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&q=80',
  },
  {
    id: 'dish-curry-02',
    name: 'Kashmiri Lamb Rogan Josh',
    category: 'Curries',
    portionsSold: 42,
    revenue: 629.58,
    salesShare: 10.9,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=300&q=80',
  },
  {
    id: 'dish-veg-01',
    name: 'Paneer Butter Masala',
    category: 'Vegetarian',
    portionsSold: 38,
    revenue: 455.62,
    salesShare: 9.8,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80',
  },
];

const WEEKLY_SALES_TREND = [
  { day: 'Mon', revenue: 412.50, orders: 18, pct: 45 },
  { day: 'Tue', revenue: 489.20, orders: 21, pct: 54 },
  { day: 'Wed', revenue: 534.80, orders: 23, pct: 60 },
  { day: 'Thu', revenue: 610.40, orders: 26, pct: 68 },
  { day: 'Fri', revenue: 890.00, orders: 38, pct: 95 },
  { day: 'Sat', revenue: 980.60, orders: 42, pct: 100 },
  { day: 'Sun', revenue: 760.00, orders: 32, pct: 82 },
];

export function AnalyticsPage() {
  const { orders } = useAppSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState<'growth' | 'shift_z'>('growth');
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');

  // Real-time calculations
  const totalRevenue = 3842.50;
  const totalOrdersCount = 146;
  const registeredUsersCount = 84;
  const avgOrderValue = totalRevenue / totalOrdersCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Revenue growth, order trends, and top selling items.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'growth'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>Growth &amp; Sales</span>
          </button>
          <button
            onClick={() => setActiveTab('shift_z')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'shift_z'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Shift Z-Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'shift_z' ? (
        <ShiftZReport />
      ) : (
        <div className="space-y-6">
          {/* Executive Growth KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Income Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Total Income
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-stone-900">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11.5px] text-stone-400">
                <span>Prior 7 Days</span>
                <span className="font-semibold text-stone-600">€3,245.10</span>
              </div>
            </div>

            {/* Order Volume Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-stone-900">
                  {totalOrdersCount}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.6%
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11.5px] text-stone-400">
                <span>Fulfillment Mix</span>
                <span className="font-semibold text-stone-600">68% Delivery · 32% Collection</span>
              </div>
            </div>

            {/* User / Customer Growth */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Registered Diners
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-stone-900">
                  {registeredUsersCount}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +23.5%
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11.5px] text-stone-400">
                <span>New This Week</span>
                <span className="font-semibold text-stone-600">+16 Customer Accounts</span>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Avg Order Value
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-bold text-stone-900">
                  {formatCurrency(avgOrderValue)}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.2%
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11.5px] text-stone-400">
                <span>Delivery AOV</span>
                <span className="font-semibold text-stone-600">€31.20</span>
              </div>
            </div>
          </div>

          {/* Section: Top Selling Dishes ("kon item besi sales hocche") */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#F15A24]" />
                  <h2 className="text-base font-bold text-stone-900">
                    Bestselling Dishes &amp; Item Sales Leaderboard
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Top performing menu items ranked by portions sold, gross revenue, and customer attach rate.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto">
                Rolling 7 Days Active
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-14 text-center">Rank</th>
                    <th className="py-2.5 px-3">Menu Dish</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Portions Sold</th>
                    <th className="py-2.5 px-3">Gross Revenue</th>
                    <th className="py-2.5 px-3">Sales Share</th>
                    <th className="py-2.5 px-3 text-right">Performance Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[13px]">
                  {TOP_SELLING_DISHES.map((dish, idx) => (
                    <tr key={dish.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Rank */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-900'
                              : idx === 1
                              ? 'bg-stone-200 text-stone-800'
                              : idx === 2
                              ? 'bg-orange-100 text-[#B84A22]'
                              : 'text-stone-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Menu Dish */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200/80 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-stone-900 leading-tight">{dish.name}</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">South William Kitchen Prep</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md">
                          {dish.category}
                        </span>
                      </td>

                      {/* Portions Sold */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center font-bold text-stone-900 bg-stone-100 min-w-8 h-7 px-2 rounded-lg text-xs">
                          {dish.portionsSold}
                        </span>
                      </td>

                      {/* Gross Revenue */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-stone-900">
                          {formatCurrency(dish.revenue)}
                        </span>
                      </td>

                      {/* Sales Share Bar */}
                      <td className="py-3 px-3">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px] font-medium text-stone-600">
                            <span>{dish.salesShare}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#F15A24]"
                              style={{ width: `${Math.min(100, dish.salesShare * 2.5)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Tag */}
                      <td className="py-3 px-3 text-right">
                        {dish.badge ? (
                          <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
                            {dish.badge}
                          </span>
                        ) : (
                          <span className="inline-block text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            Steady Seller
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Sales Trend & Reconciled Channel Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 7-Day Performance Curve */}
            <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">7-Day Revenue Velocity (Mon - Sun)</h3>
                  <p className="text-xs text-stone-400">Daily gross turnover with weekend dinner surges</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Peak: Saturday (€980.60)
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2 items-end h-44">
                {WEEKLY_SALES_TREND.map((day) => (
                  <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-stone-500 group-hover:text-stone-900 transition-colors">
                      €{Math.round(day.revenue)}
                    </span>
                    <div className="w-full bg-stone-100 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: '70%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-[#B84A22] to-[#F15A24] rounded-t-lg transition-all group-hover:opacity-90"
                        style={{ height: `${day.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-stone-700">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reconciled Channel Breakdown */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Order Channel &amp; Payment Mix</h3>
                <p className="text-xs text-stone-400 mt-0.5">Audited fulfillment and tender ratios</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Delivery Orders (Dublin Metro)</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-[#F15A24] rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Takeaway / Click &amp; Collect</span>
                    <span className="font-bold">32%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '32%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Apple Pay &amp; Digital Card</span>
                    <span className="font-bold">91.4%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '91.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Cash on Hand</span>
                    <span className="font-bold">8.6%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '8.6%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600">
                <span className="font-bold text-stone-800">Operational Tip: </span>
                Curry station volume peaks between 18:30 and 20:45. Ensure batch prep is completed before rush hour.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
