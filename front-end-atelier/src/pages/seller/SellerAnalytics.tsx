import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sofa, Tag, ShieldCheck, TrendingUp, BarChart, Percent, CheckCircle, PieChart, Info } from 'lucide-react';

export default function SellerAnalytics() {
  const { products, orders } = useApp();

  // Calculations
  const completedOrders = orders.filter(
    ord => ord.status === 'delivered' || ord.status === 'shipped'
  );

  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Simulated visual chart values
  const monthlyData = [
    { month: 'Jan', sales: 12400 },
    { month: 'Feb', sales: 19500 },
    { month: 'Mar', sales: 15100 },
    { month: 'Apr', sales: 22800 },
    { month: 'May', sales: totalSales > 0 ? totalSales : 26000 }
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.sales)) || 1;

  // Sells by category
  const categoriesCount = {
    'living-room': products.filter(p => p.category === 'living-room').length,
    'dining': products.filter(p => p.category === 'dining' || p.category === 'dining-room').length,
    'bedroom': products.filter(p => p.category === 'bedroom').length,
    'office': products.filter(p => p.category === 'office').length,
    'lighting': products.filter(p => p.category === 'lighting').length,
  };

  return (
    <div className="font-sans text-stone-900 text-left space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-light text-stone-950 tracking-tight">Showroom Performance Analytics</h1>
        <p className="text-xs text-stone-400 mt-1">
          Review monthly SWIFT revenue, category spreads, and timber warranty commission rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Revenue Chart (2/3 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-display font-medium text-base text-stone-950">Revenue Progress</h3>
              <p className="text-[11px] text-stone-400 font-sans">Monthly performance including Sandbox wire orders.</p>
            </div>
            
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 rounded uppercase font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>UPWARD CURVE</span>
            </span>
          </div>

          {/* Simple magnificent pure CSS bar chart */}
          <div className="space-y-6 pt-4">
            <div className="flex items-end justify-between h-48 px-4 border-b border-stone-150 relative">
              {monthlyData.map((data, idx) => {
                const heightPercentage = Math.floor((data.sales / maxVal) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center w-1/5 group">
                    
                    {/* Floating Value indicator on Hover */}
                    <div className="absolute -translate-y-12 bg-stone-950 text-white text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                      ${data.sales.toLocaleString()}
                    </div>

                    {/* Bar representing value */}
                    <div 
                      className="w-8 sm:w-12 bg-[#c2ab77] hover:bg-stone-900 rounded-t-lg transition-all"
                      style={{ height: `${heightPercentage}%`, minHeight: '10%' }}
                    />
                    
                    <span className="font-mono text-[10px] text-stone-400 mt-3">{data.month}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="text-stone-500 text-[10px] font-mono flex items-center gap-2 bg-stone-50 border border-stone-100 p-3 rounded-xl leading-relaxed">
              <Info className="w-4.5 h-4.5 text-stone-400 shrink-0" />
              <span>
                Sales levels track commission payments cleared. Live updates refresh as buyers confirm and authorize checkout ledger items.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Category Split (1/3 cols) */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-medium text-base text-stone-950 mb-3 border-b border-stone-100 pb-3 text-left">
            Department Spreads
          </h3>

          <div className="space-y-4">
            
            {/* Dept 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-stone-600">
                <span className="uppercase font-bold">Living Room Lounges</span>
                <span>{categoriesCount['living-room']} blueprints</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-950 rounded-full" style={{ width: `${(categoriesCount['living-room'] / products.length) * 100}%` }} />
              </div>
            </div>

            {/* Dept 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-stone-600">
                <span className="uppercase font-bold">Dining Cabinets</span>
                <span>{categoriesCount['dining']} blueprints</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#c2ab77] rounded-full" style={{ width: `${(categoriesCount['dining'] / products.length) * 100}%` }} />
              </div>
            </div>

            {/* Dept 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-stone-600">
                <span className="uppercase font-bold">Bedrooms Cozy</span>
                <span>{categoriesCount['bedroom']} blueprints</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-700 rounded-full" style={{ width: `${(categoriesCount['bedroom'] / products.length) * 100}%` }} />
              </div>
            </div>

            {/* Dept 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-stone-600">
                <span className="uppercase font-bold">Workspace Chairs</span>
                <span>{categoriesCount['office']} blueprints</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-400 rounded-full" style={{ width: `${(categoriesCount['office'] / products.length) * 100}%` }} />
              </div>
            </div>

            {/* Dept 5 */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-stone-600">
                <span className="uppercase font-bold">Lighting Art</span>
                <span>{categoriesCount['lighting']} blueprints</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#e4cfa1] rounded-full" style={{ width: `${(categoriesCount['lighting'] / products.length) * 100}%` }} />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-100 text-[10px] font-mono text-stone-400">
            Total active registered catalog assets: <b className="text-stone-700">{products.length} models</b>
          </div>
        </div>

      </div>

    </div>
  );
}
