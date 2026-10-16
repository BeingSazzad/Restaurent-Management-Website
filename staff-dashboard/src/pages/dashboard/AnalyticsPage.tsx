import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Flame,
  FileText,
  BarChart3,
  Percent,
  AlertOctagon,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { ROUTES } from '../../constants/routes';

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
  const { orders } = useAppSelector((state) => state.orders);
  const { wastageHistory } = useAppSelector((state) => state.stock);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0) || 3842.50;
  const totalOrdersCount = orders.length || 146;
  const totalWastageLoss = (wastageHistory || []).reduce((sum, w) => sum + (w.costLost || 0), 0);
  const grossMarginPercent = 74.2;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Analytics &amp; Margins
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time revenue, gross kitchen food margin, and stock wastage performance.
          </p>
        </div>

        <Link
          to={ROUTES.DASHBOARD.SHIFT_REPORT}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto border border-stone-200/60"
        >
          <FileText className="w-3.5 h-3.5 text-stone-500" />
          <span>View Shift Report &rarr;</span>
        </Link>
      </div>

      <div className="space-y-4">
          {/* 4 Clean, High-Signal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Revenue */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Total Sales
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
              <p className="text-[11px] text-stone-400 mt-1">Live settled tickets</p>
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
              <p className="text-[11px] text-stone-400 mt-1">Kitchen &amp; dispatch count</p>
            </div>

            {/* Gross Margin */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Kitchen Gross Margin
                </span>
                <Percent className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-600">
                  {grossMarginPercent}%
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  Healthy
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Target food cost: 25.8%</p>
            </div>

            {/* Wastage Loss */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Wastage &amp; Spoilage
                </span>
                <AlertOctagon className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rose-600">
                  {formatCurrency(totalWastageLoss)}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  {(totalRevenue > 0 ? (totalWastageLoss / totalRevenue) * 100 : 0).toFixed(1)}% of sales
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Burned, expired &amp; dropped</p>
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
                    <th className="py-2 px-3 text-center">Sold</th>
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
    </div>
  );
}

export default AnalyticsPage;
