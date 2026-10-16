import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  Flame,
  Percent,
  AlertOctagon,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

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

interface SalesMonthData {
  month: string;
  sales: number;
  orders: number;
  growth: number;
}

const SALES_DATA_BY_YEAR: Record<string, SalesMonthData[]> = {
  '2026': [
    { month: 'Jan', sales: 28400, orders: 1120, growth: 4.2 },
    { month: 'Feb', sales: 29800, orders: 1180, growth: 4.9 },
    { month: 'Mar', sales: 33200, orders: 1290, growth: 11.4 },
    { month: 'Apr', sales: 35600, orders: 1360, growth: 7.2 },
    { month: 'May', sales: 39100, orders: 1480, growth: 9.8 },
    { month: 'Jun', sales: 42500, orders: 1590, growth: 8.7 },
    { month: 'Jul', sales: 44800, orders: 1670, growth: 5.4 },
    { month: 'Aug', sales: 43900, orders: 1640, growth: -2.0 },
    { month: 'Sep', sales: 47200, orders: 1750, growth: 7.5 },
    { month: 'Oct', sales: 51600, orders: 1890, growth: 9.3 },
    { month: 'Nov', sales: 53800, orders: 1980, growth: 4.3 },
    { month: 'Dec', sales: 59400, orders: 2150, growth: 10.4 },
  ],
  '2025': [
    { month: 'Jan', sales: 21500, orders: 860, growth: 3.1 },
    { month: 'Feb', sales: 22800, orders: 910, growth: 6.0 },
    { month: 'Mar', sales: 25400, orders: 990, growth: 11.4 },
    { month: 'Apr', sales: 27100, orders: 1040, growth: 6.7 },
    { month: 'May', sales: 30200, orders: 1150, growth: 11.4 },
    { month: 'Jun', sales: 32900, orders: 1240, growth: 8.9 },
    { month: 'Jul', sales: 34500, orders: 1290, growth: 4.9 },
    { month: 'Aug', sales: 33800, orders: 1260, growth: -2.0 },
    { month: 'Sep', sales: 36700, orders: 1370, growth: 8.6 },
    { month: 'Oct', sales: 39900, orders: 1480, growth: 8.7 },
    { month: 'Nov', sales: 41800, orders: 1540, growth: 4.8 },
    { month: 'Dec', sales: 46200, orders: 1710, growth: 10.5 },
  ],
  '2024': [
    { month: 'Jan', sales: 16800, orders: 670, growth: 2.5 },
    { month: 'Feb', sales: 17900, orders: 710, growth: 6.5 },
    { month: 'Mar', sales: 19800, orders: 780, growth: 10.6 },
    { month: 'Apr', sales: 21200, orders: 820, growth: 7.1 },
    { month: 'May', sales: 23600, orders: 910, growth: 11.3 },
    { month: 'Jun', sales: 25400, orders: 970, growth: 7.6 },
    { month: 'Jul', sales: 26800, orders: 1010, growth: 5.5 },
    { month: 'Aug', sales: 26100, orders: 990, growth: -2.6 },
    { month: 'Sep', sales: 28500, orders: 1070, growth: 9.2 },
    { month: 'Oct', sales: 30900, orders: 1150, growth: 8.4 },
    { month: 'Nov', sales: 32400, orders: 1210, growth: 4.9 },
    { month: 'Dec', sales: 36200, orders: 1340, growth: 11.7 },
  ],
};

interface IncomeMonthData {
  month: string;
  gross: number;
  net: number;
  margin: number;
}

const INCOME_DATA_BY_YEAR: Record<string, IncomeMonthData[]> = {
  '2026': [
    { month: 'Jan', gross: 28400, net: 8520, margin: 30.0 },
    { month: 'Feb', gross: 29800, net: 9240, margin: 31.0 },
    { month: 'Mar', gross: 33200, net: 10620, margin: 32.0 },
    { month: 'Apr', gross: 35600, net: 11750, margin: 33.0 },
    { month: 'May', gross: 39100, net: 13290, margin: 34.0 },
    { month: 'Jun', gross: 42500, net: 14880, margin: 35.0 },
    { month: 'Jul', gross: 44800, net: 15680, margin: 35.0 },
    { month: 'Aug', gross: 43900, net: 15360, margin: 35.0 },
    { month: 'Sep', gross: 47200, net: 17460, margin: 37.0 },
    { month: 'Oct', gross: 51600, net: 19600, margin: 38.0 },
    { month: 'Nov', gross: 53800, net: 20980, margin: 39.0 },
    { month: 'Dec', gross: 59400, net: 23760, margin: 40.0 },
  ],
  '2025': [
    { month: 'Jan', gross: 21500, net: 5800, margin: 27.0 },
    { month: 'Feb', gross: 22800, net: 6380, margin: 28.0 },
    { month: 'Mar', gross: 25400, net: 7370, margin: 29.0 },
    { month: 'Apr', gross: 27100, net: 8130, margin: 30.0 },
    { month: 'May', gross: 30200, net: 9360, margin: 31.0 },
    { month: 'Jun', gross: 32900, net: 10530, margin: 32.0 },
    { month: 'Jul', gross: 34500, net: 11040, margin: 32.0 },
    { month: 'Aug', gross: 33800, net: 10820, margin: 32.0 },
    { month: 'Sep', gross: 36700, net: 12480, margin: 34.0 },
    { month: 'Oct', gross: 39900, net: 13960, margin: 35.0 },
    { month: 'Nov', gross: 41800, net: 15050, margin: 36.0 },
    { month: 'Dec', gross: 46200, net: 17090, margin: 37.0 },
  ],
  '2024': [
    { month: 'Jan', gross: 16800, net: 4200, margin: 25.0 },
    { month: 'Feb', gross: 17900, net: 4650, margin: 26.0 },
    { month: 'Mar', gross: 19800, net: 5350, margin: 27.0 },
    { month: 'Apr', gross: 21200, net: 5940, margin: 28.0 },
    { month: 'May', gross: 23600, net: 6840, margin: 29.0 },
    { month: 'Jun', gross: 25400, net: 7620, margin: 30.0 },
    { month: 'Jul', gross: 26800, net: 8040, margin: 30.0 },
    { month: 'Aug', gross: 26100, net: 7830, margin: 30.0 },
    { month: 'Sep', gross: 28500, net: 8840, margin: 31.0 },
    { month: 'Oct', gross: 30900, net: 9890, margin: 32.0 },
    { month: 'Nov', gross: 32400, net: 10690, margin: 33.0 },
    { month: 'Dec', gross: 36200, net: 12310, margin: 34.0 },
  ],
};

function buildSmoothCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export function AnalyticsPage() {
  const { orders } = useAppSelector((state) => state.orders);
  const { wastageHistory } = useAppSelector((state) => state.stock);

  // Filter states
  const [salesYear, setSalesYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [hoveredSalesIdx, setHoveredSalesIdx] = useState<number | null>(null);

  const [incomeYear, setIncomeYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [hoveredIncomeIdx, setHoveredIncomeIdx] = useState<number | null>(null);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0) || 3842.50;
  const totalOrdersCount = orders.length || 146;
  const totalWastageLoss = (wastageHistory || []).reduce((sum, w) => sum + (w.costLost || 0), 0);
  const grossMarginPercent = 74.2;

  // Chart 1: Sales Growth calculations (Full 12 Months)
  const rawSalesData = SALES_DATA_BY_YEAR[salesYear] || SALES_DATA_BY_YEAR['2026'];
  const activeSalesData = rawSalesData;

  const totalYearSales = activeSalesData.reduce((acc, d) => acc + d.sales, 0);
  const avgMonthlyGrowth = (
    activeSalesData.reduce((acc, d) => acc + d.growth, 0) / activeSalesData.length
  ).toFixed(1);

  // SVG Chart 1 dimensions (Edge-to-edge standard width)
  const c1Width = 760;
  const c1Height = 220;
  const c1PadLeft = 40;
  const c1PadRight = 14;
  const c1PadTop = 18;
  const c1PadBottom = 30;
  const c1PlotW = c1Width - c1PadLeft - c1PadRight;
  const c1PlotH = c1Height - c1PadTop - c1PadBottom;

  const maxSales = Math.max(...activeSalesData.map((d) => d.sales)) * 1.12;
  const minSales = Math.max(0, Math.min(...activeSalesData.map((d) => d.sales)) * 0.85);

  const salesPoints = activeSalesData.map((d, i) => {
    const x = c1PadLeft + (i / (activeSalesData.length - 1)) * c1PlotW;
    const y = c1PadTop + c1PlotH - ((d.sales - minSales) / (maxSales - minSales)) * c1PlotH;
    return { x, y, data: d, index: i };
  });

  const salesCurve = buildSmoothCurvedPath(salesPoints);
  const salesArea = salesPoints.length > 0
    ? `${salesCurve} L ${salesPoints[salesPoints.length - 1].x} ${c1PadTop + c1PlotH} L ${salesPoints[0].x} ${c1PadTop + c1PlotH} Z`
    : '';

  // Chart 2: Total Income calculations
  const activeIncomeData = INCOME_DATA_BY_YEAR[incomeYear] || INCOME_DATA_BY_YEAR['2026'];
  const totalYearGross = activeIncomeData.reduce((acc, d) => acc + d.gross, 0);

  // SVG Chart 2 dimensions (Edge-to-edge standard width)
  const c2Width = 760;
  const c2Height = 210;
  const c2PadLeft = 40;
  const c2PadRight = 14;
  const c2PadTop = 16;
  const c2PadBottom = 28;
  const c2PlotW = c2Width - c2PadLeft - c2PadRight;
  const c2PlotH = c2Height - c2PadTop - c2PadBottom;

  const maxIncomeVal = Math.max(...activeIncomeData.map((d) => d.gross)) * 1.12;
  const colWidth = c2PlotW / activeIncomeData.length;
  const barWidth = Math.max(16, Math.min(26, colWidth * 0.46));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Analytics &amp; Margins
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time revenue, gross kitchen food margin, and multi-year sales growth analytics.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 4 Clean High-Signal KPI Cards */}
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

        {/* 2 Designer Charts: Type 1 Curved Wave Area Chart & Type 2 Layered Dual Bar Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Chart 1: Total Sales Growth (Curved Area & Gradient Line Chart) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            {/* Header with Title, Stats & Dropdown Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24] ring-4 ring-[#F15A24]/15" />
                  <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                    Total Sales Growth
                  </h2>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-stone-900">
                    €{(totalYearSales / 1000).toFixed(1)}k
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{avgMonthlyGrowth}% MoM avg
                  </span>
                </div>
              </div>

              {/* Year Dropdown Filter */}
              <div className="relative self-start sm:self-auto">
                <select
                  value={salesYear}
                  onChange={(e) => setSalesYear(e.target.value as '2026' | '2025' | '2024')}
                  aria-label="Filter sales year"
                  className="text-xs font-bold bg-[#F15A24]/10 hover:bg-[#F15A24]/15 border border-[#F15A24]/20 rounded-xl px-2.5 py-1.5 text-[#F15A24] outline-none cursor-pointer transition-colors"
                >
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                  <option value="2024">Year 2024</option>
                </select>
              </div>
            </div>

            {/* SVG Visual Area Chart */}
            <div className="relative mt-3 w-full">
              <svg
                viewBox={`0 0 ${c1Width} ${c1Height}`}
                className="w-full h-auto select-none overflow-visible"
              >
                <defs>
                  {/* Glowing Orange-Amber Area Gradient */}
                  <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F15A24" stopOpacity="0.28" />
                    <stop offset="60%" stopColor="#F15A24" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#F15A24" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = c1PadTop + c1PlotH * ratio;
                  const val = maxSales - ratio * (maxSales - minSales);
                  return (
                    <g key={ratio}>
                      <line
                        x1={c1PadLeft}
                        y1={y}
                        x2={c1Width - c1PadRight}
                        y2={y}
                        stroke="#F5F5F4"
                        strokeDasharray={ratio === 1 ? 'none' : '3 3'}
                        strokeWidth="1"
                      />
                      <text
                        x={c1PadLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#A8A29E"
                        fontWeight="500"
                      >
                        €{(val / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}

                {/* Area Gradient Fill */}
                <path d={salesArea} fill="url(#salesAreaGradient)" />

                {/* Smooth Curve Stroke */}
                <path
                  d={salesCurve}
                  fill="none"
                  stroke="#F15A24"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Hover Guide & Data Points */}
                {salesPoints.map((pt) => {
                  const isHovered = hoveredSalesIdx === pt.index;
                  return (
                    <g key={pt.index}>
                      {/* Vertical Hover Indicator Line */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={c1PadTop}
                          x2={pt.x}
                          y2={c1PadTop + c1PlotH}
                          stroke="#F15A24"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Data Point Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : 3.5}
                        fill="#FFFFFF"
                        stroke="#F15A24"
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all duration-150 cursor-pointer"
                      />

                      {/* Invisible Hover Hitbox Area */}
                      <rect
                        x={pt.x - c1PlotW / (activeSalesData.length * 2)}
                        y={c1PadTop}
                        width={c1PlotW / activeSalesData.length}
                        height={c1PlotH + c1PadBottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredSalesIdx(pt.index)}
                        onMouseLeave={() => setHoveredSalesIdx(null)}
                      />

                      {/* X-Axis Month Labels */}
                      <text
                        x={pt.x}
                        y={c1Height - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={isHovered ? '700' : '500'}
                        fill={isHovered ? '#F15A24' : '#78716C'}
                        className="transition-colors"
                      >
                        {pt.data.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip */}
              {hoveredSalesIdx !== null && salesPoints[hoveredSalesIdx] && (
                <div
                  className="pointer-events-none absolute z-20 bg-stone-900 text-white rounded-xl px-3 py-2 shadow-xl border border-stone-800 text-xs transition-all duration-75"
                  style={{
                    left: `${Math.min(82, Math.max(12, (salesPoints[hoveredSalesIdx].x / c1Width) * 100))}%`,
                    top: '10px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 font-semibold text-stone-300 pb-1 border-b border-stone-800 text-[11px]">
                    <span>{salesPoints[hoveredSalesIdx].data.month} {salesYear}</span>
                    <span className={salesPoints[hoveredSalesIdx].data.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {salesPoints[hoveredSalesIdx].data.growth >= 0 ? '+' : ''}
                      {salesPoints[hoveredSalesIdx].data.growth}%
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex justify-between gap-3">
                      <span className="text-stone-400">Total Sales:</span>
                      <span className="font-bold text-amber-400">
                        {formatCurrency(salesPoints[hoveredSalesIdx].data.sales)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-[10px]">
                      <span className="text-stone-400">Orders Settled:</span>
                      <span className="font-medium text-stone-200">
                        {salesPoints[hoveredSalesIdx].data.orders} orders
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Total Annual Income (Single Clean Monthly Bar Chart) */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            {/* Header with Title, Stats & Year Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                  <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                    Total Annual Income
                  </h2>
                </div>
                <div className="mt-1">
                  <span className="text-lg font-bold text-stone-900">
                    €{(totalYearGross / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>

              {/* Year Dropdown Filter */}
              <div className="relative self-start sm:self-auto">
                <select
                  value={incomeYear}
                  onChange={(e) => setIncomeYear(e.target.value as '2026' | '2025' | '2024')}
                  aria-label="Filter income year"
                  className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 text-emerald-700 outline-none cursor-pointer transition-colors"
                >
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                  <option value="2024">Year 2024</option>
                </select>
              </div>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="relative mt-3 w-full">
              <svg
                viewBox={`0 0 ${c2Width} ${c2Height}`}
                className="w-full h-auto select-none overflow-visible"
              >
                <defs>
                  <linearGradient id="incomeSingleBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = c2PadTop + c2PlotH * ratio;
                  const val = maxIncomeVal - ratio * maxIncomeVal;
                  return (
                    <g key={ratio}>
                      <line
                        x1={c2PadLeft}
                        y1={y}
                        x2={c2Width - c2PadRight}
                        y2={y}
                        stroke="#F5F5F4"
                        strokeDasharray={ratio === 1 ? 'none' : '3 3'}
                        strokeWidth="1"
                      />
                      <text
                        x={c2PadLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#A8A29E"
                        fontWeight="500"
                      >
                        €{(val / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}

                {/* 12 Monthly Clean Income Bars */}
                {activeIncomeData.map((d, i) => {
                  const colCenter = c2PadLeft + (i + 0.5) * colWidth;
                  const barHeight = (d.gross / maxIncomeVal) * c2PlotH;
                  const isHovered = hoveredIncomeIdx === i;
                  const barX = colCenter - barWidth / 2;
                  const baseY = c2PadTop + c2PlotH;

                  return (
                    <g key={d.month}>
                      {/* Background Column Highlight on Hover */}
                      {isHovered && (
                        <rect
                          x={colCenter - colWidth * 0.45}
                          y={c2PadTop}
                          width={colWidth * 0.9}
                          height={c2PlotH}
                          rx="6"
                          fill="#FFFBEB"
                        />
                      )}

                      {/* Single Clean Amber Bar */}
                      <rect
                        x={barX}
                        y={baseY - barHeight}
                        width={barWidth}
                        height={barHeight}
                        rx="5"
                        fill={isHovered ? '#B45309' : 'url(#incomeSingleBarGradient)'}
                        className="transition-all duration-150 cursor-pointer"
                      />

                      {/* Invisible Hover Hitbox */}
                      <rect
                        x={colCenter - colWidth * 0.5}
                        y={c2PadTop}
                        width={colWidth}
                        height={c2PlotH + c2PadBottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIncomeIdx(i)}
                        onMouseLeave={() => setHoveredIncomeIdx(null)}
                      />

                      {/* X-Axis Month Labels */}
                      <text
                        x={colCenter}
                        y={c2Height - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={isHovered ? '700' : '500'}
                        fill={isHovered ? '#B45309' : '#78716C'}
                        className="transition-colors"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip */}
              {hoveredIncomeIdx !== null && activeIncomeData[hoveredIncomeIdx] && (
                <div
                  className="pointer-events-none absolute z-20 bg-stone-900 text-white rounded-xl px-3 py-2 shadow-xl border border-stone-800 text-xs transition-all duration-75"
                  style={{
                    left: `${Math.min(88, Math.max(12, ((c2PadLeft + (hoveredIncomeIdx + 0.5) * colWidth) / c2Width) * 100))}%`,
                    top: '8px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="font-semibold text-stone-300 pb-1 border-b border-stone-800 text-[11px]">
                    <span>{activeIncomeData[hoveredIncomeIdx].month} {incomeYear}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs">
                    <span className="text-stone-400">Total Income:</span>
                    <span className="font-bold text-amber-400">
                      {formatCurrency(activeIncomeData[hoveredIncomeIdx].gross)}
                    </span>
                  </div>
                </div>
              )}
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

