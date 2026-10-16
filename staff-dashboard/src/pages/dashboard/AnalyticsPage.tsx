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
  image: string;
}

const TOP_SELLING_DISHES: BestSellingDish[] = [
  {
    id: 'dish-curry-01',
    name: 'Old Delhi Butter Chicken',
    category: 'Curries',
    portionsSold: 94,
    revenue: 1221.06,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80',
  },
  {
    id: 'dish-biryani-01',
    name: 'Royal Chicken Dum Biryani',
    category: 'Biryani',
    portionsSold: 88,
    revenue: 1231.12,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80',
  },
  {
    id: 'dish-bread-01',
    name: 'Tandoori Garlic Butter Naan',
    category: 'Breads',
    portionsSold: 142,
    revenue: 639.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80',
  },
  {
    id: 'dish-grill-01',
    name: 'Flame-Grilled Tandoori Chicken',
    category: 'Grill',
    portionsSold: 56,
    revenue: 756.00,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&q=80',
  },
  {
    id: 'dish-curry-02',
    name: 'Kashmiri Lamb Rogan Josh',
    category: 'Curries',
    portionsSold: 42,
    revenue: 629.58,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=200&q=80',
  },
];

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'growth' | 'shift_z'>('growth');

  const totalRevenue = 3842.50;
  const totalOrdersCount = 146;
  const registeredUsersCount = 84;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Revenue, orders, customer growth, and bestsellers.
          </p>
        </div>

        {/* View Switcher */}
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
            <span>Growth</span>
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
            <span>Shift Z-Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'shift_z' ? (
        <ShiftZReport />
      ) : (
        <div className="space-y-4">
          {/* 3 Clean, Minimal Growth KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Revenue */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Total Income
                </span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Total Orders
                </span>
                <ShoppingBag className="w-4 h-4 text-[#F15A24]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {totalOrdersCount}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +12.6%
                </span>
              </div>
            </div>

            {/* Registered Diners */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Registered Diners
                </span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {registeredUsersCount}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +23.5%
                </span>
              </div>
            </div>
          </div>

          {/* Clean Top Selling Dishes Table */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F15A24]" />
                <span>Top Selling Dishes</span>
              </h2>
              <span className="text-xs text-stone-400">Past 7 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-2 px-3 w-10 text-center">#</th>
                    <th className="py-2 px-3">Dish</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-center">Portions Sold</th>
                    <th className="py-2 px-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[13px]">
                  {TOP_SELLING_DISHES.map((dish, idx) => (
                    <tr key={dish.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-2.5 px-3 text-center text-xs font-bold text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-stone-200/80"
                          />
                          <span className="font-semibold text-stone-900 text-xs">
                            {dish.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {dish.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-stone-900 text-xs">
                        {dish.portionsSold}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900 text-xs">
                        {formatCurrency(dish.revenue)}
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
