import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, Package, Users, ShoppingBag, 
  Search, Sliders, ChevronDown, CheckCircle2, Truck, 
  Clock, Plus, ArrowUpRight, Upload, Globe, EyeOff, Sparkles, HelpCircle, Eye, AlertCircle, Trash, Check
} from 'lucide-react';
import { Product, Order, Metrics } from '../types';

interface SellerOverviewProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteProduct: (productId: string) => void;
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: string) => void;
  activeSubTab: 'overview' | 'orders' | 'add-product';
  setActiveSubTab: (tab: 'overview' | 'orders' | 'add-product') => void;
}

export default function SellerOverview({
  products,
  orders,
  onAddProduct,
  onUpdateOrderStatus,
  onDeleteProduct,
  setCurrentPage,
  setSelectedProductId,
  activeSubTab,
  setActiveSubTab
}: SellerOverviewProps) {
  
  // State for Add Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'living-room' | 'dining' | 'bedroom' | 'office' | 'lighting'>('living-room');
  const [newProdShortDesc, setNewProdShortDesc] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdMaterials, setNewProdMaterials] = useState('Solid American Walnut, Anodized Brass Joints');
  const [newProdColors, setNewProdColors] = useState('Natural Walnut, Smoked Ebony');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80');
  
  // Specific specifications
  const [newSpecDimensions, setNewSpecDimensions] = useState('W 180cm x D 90cm x H 75cm');
  const [newSpecWeightLimit, setNewSpecWeightLimit] = useState('150 kg');
  const [newSpecCare, setNewSpecCare] = useState('Wipe wood surfaces with wax dressing every 6 months.');
  const [newSpecOrigin, setNewSpecOrigin] = useState('Portland, Oregon');
  const [newSpecDesigner, setNewSpecDesigner] = useState('Alexander Mercer Homage');
  const [newListingVisibility, setNewListingVisibility] = useState(true);

  // States for orders manipulation
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Charts simulated hover point
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Analytics Metrics (derived from real data)
  const totalSalesCount = orders.reduce((total, o) => total + o.totalAmount, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const metrics: Metrics = {
    totalSales: totalSalesCount,
    activeOrders: activeOrdersCount,
    activeProducts: products.length,
    conversations: 42,
    visits: 1280
  };

  // Custom Chart Coordinates
  // 6 points of monthly sales (January to June 2026)
  const monthlySales = [
    { month: 'Jan', val: 12500, label: '$12,500' },
    { month: 'Feb', val: 18200, label: '$18,200' },
    { month: 'Mar', val: 15400, label: '$15,400' },
    { month: 'Apr', val: 24900, label: '$24,900' },
    { month: 'May', val: 28400, label: '$28,400' },
    { month: 'Jun', val: totalSalesCount > 0 ? 28400 + totalSalesCount : 32500, label: `$${(28400 + totalSalesCount).toLocaleString()}` }
  ];

  // SVG Dimension attributes
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = Math.max(...monthlySales.map(m => m.val)) * 1.15;
  
  // Calculate SVG line points
  const points = monthlySales.map((dot, index) => {
    const x = (index / (monthlySales.length - 1)) * chartWidth;
    const y = chartHeight - (dot.val / maxVal) * chartHeight;
    return { x, y, dot };
  });

  const pathStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // Smooth area path str
  const areaPathStr = `${pathStr} L ${points[points.length-1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
                        o.buyerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        o.items.some(it => it.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Handle Create Product Action
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdShortDesc || !newProdDesc || !newProdMaterials) {
      alert('Please fill in basic description blocks.');
      return;
    }

    const matArray = newProdMaterials.split(',').map(m => m.trim());
    const colorsArray = newProdColors.split(',').map(c => {
      const trimmed = c.trim();
      return { 
        name: trimmed, 
        hex: trimmed.toLowerCase().includes('dark') || trimmed.toLowerCase().includes('ebony') || trimmed.toLowerCase().includes('black') ? '#211D1C' : '#D1C4B5' 
      };
    });

    const addedProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      shortDescription: newProdShortDesc,
      description: newProdDesc,
      price: newProdPrice,
      rating: 5.0,
      reviewCount: 0,
      category: newProdCategory,
      materials: matArray,
      colors: colorsArray,
      images: [newProdImage],
      threeSixtyImages: [
        newProdImage,
        newProdImage + '&sat=-30',
        newProdImage + '&hue=10'
      ],
      details: {
        material: matArray.join(' & '),
        dimensions: newSpecDimensions,
        careInstructions: newSpecCare,
        origin: newSpecOrigin,
        weightLimit: newSpecWeightLimit,
        designer: newSpecDesigner
      },
      sellerId: 'studio-mercer'
    };

    onAddProduct(addedProd);
    alert('Product cataloged successfully! Redirecting to view details...');
    
    // Clear forms
    setNewProdName('');
    setNewProdShortDesc('');
    setNewProdDesc('');
    
    // View details instantly
    setSelectedProductId(addedProd.id);
    setCurrentPage('detail');
  };

  return (
    <div className="font-sans text-stone-900 bg-white min-h-screen">
      
      {/* 1. Header with tabs */}
      <header className="bg-stone-50 border-b border-stone-150 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-50 border border-amber-250 text-amber-700 font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-md">Atelier Sovereign Workspace</span>
            <h1 className="text-3xl font-display font-light text-stone-950 tracking-tight">Studio Administration Dashboard</h1>
            <p className="text-stone-500 text-sm">Review incoming commissions, track physical logs, and register newly created furniture designs.</p>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-5 py-2.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wide transition-all ${
                activeSubTab === 'overview' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-500 hover:text-stone-950'
              }`}
            >
              Overview Overview
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-5 py-2.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wide transition-all relative ${
                activeSubTab === 'orders' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-500 hover:text-stone-950'
              }`}
            >
              Incoming Orders
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                  {activeOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSubTab('add-product')}
              className={`px-5 py-2.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wide transition-all ${
                activeSubTab === 'add-product' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-500 hover:text-stone-950'
              }`}
            >
              Add Product Blueprint
            </button>
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* SUBTAB 1: OVERVIEW DASHBOARD */}
        {activeSubTab === 'overview' && (
          <div className="space-y-10">
            
            {/* Bento Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-stone-500">
              
              <div className="p-6 bg-[#FAF9F6] border border-stone-200/60 rounded-2xl flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B39D69]">Total Gross Commissions</span>
                  <TrendingUp className="w-4 h-4 text-[#B39D69]" />
                </div>
                <div className="mt-5.5">
                  <p className="text-3xl font-bold text-stone-950">${metrics.totalSales.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1.5">▲ 14.5% OVER YEAR-AGO RECORD</p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF9F6] border border-stone-200/60 rounded-2xl flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B39D69]">Active Pending Sinks</span>
                  <Clock className="w-4 h-4 text-[#B39D69]" />
                </div>
                <div className="mt-5.5">
                  <p className="text-3xl font-bold text-stone-950">{metrics.activeOrders}</p>
                  <p className="text-[9px] text-stone-400 font-medium mt-1.5">QUEUED IN WORKSHOP CORE</p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF9F6] border border-stone-200/60 rounded-2xl flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B39D69]">Showroom Blueprints</span>
                  <Package className="w-4 h-4 text-[#B39D69]" />
                </div>
                <div className="mt-5.5">
                  <p className="text-3xl font-bold text-stone-950">{metrics.activeProducts}</p>
                  <p className="text-[9px] text-[#B39D69] font-bold mt-1.5">100% SECURE LISTINGS</p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF9F6] border border-stone-200/60 rounded-2xl flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B39D69]">Collector Visits</span>
                  <Users className="w-4 h-4 text-[#B39D69]" />
                </div>
                <div className="mt-5.5">
                  <p className="text-3xl font-bold text-stone-950">{metrics.visits.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1.5">▲ 4.8% RETENTION RATE</p>
                </div>
              </div>

            </div>

            {/* Sales Analytics Immersive Graph Row AND Top Products side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sales Graph SVG monolithic */}
              <div className="lg:col-span-8 p-7 border border-stone-150 rounded-2xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-stone-100 text-stone-850 font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">Ledger Analytics</span>
                    <h3 className="text-xl font-display font-medium text-stone-900 mt-1">Intertemporal Revenue Flow</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B39D69]" />
                    <span>USD ($)</span>
                  </div>
                </div>

                {/* Handcrafted Animated Responsive SVG Graph */}
                <div className="relative pt-4">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full overflow-visible"
                    style={{ maxHeight: '200px' }}
                  >
                    {/* Grids */}
                    <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f4edd9" strokeDasharray="3" />
                    <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#f4edd9" strokeDasharray="3" />
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e4edd9" strokeDasharray="3" />

                    {/* Glowing Area Fill */}
                    <path 
                      d={areaPathStr} 
                      fill="url(#grad)" 
                      className="transition-all duration-300"
                    />

                    {/* Spline Path */}
                    <path 
                      d={pathStr} 
                      fill="none" 
                      stroke="#B39D69" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#B39D69" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#B39D69" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Interfacing Hover Hotspots */}
                    {points.map((p, idx) => (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={hoveredPoint === idx ? '6' : '3.5'} 
                          fill={hoveredPoint === idx ? '#B39D69' : '#fff'} 
                          stroke="#B39D69" 
                          strokeWidth="2" 
                          className="transition-all duration-150"
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Horizontal Labels */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mt-4 px-1 pb-2">
                    {monthlySales.map((dot, idx) => (
                      <span key={idx}>{dot.month}</span>
                    ))}
                  </div>

                  {/* Dynamic hovering coordinates coordinates details */}
                  {hoveredPoint !== null && (
                    <div className="absolute top-0 right-0 bg-stone-950 text-white p-3.5 rounded-xl text-left border border-stone-800 shadow-xl max-w-xs animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[9px] font-mono tracking-widest text-[#B39D69] uppercase font-bold">Ledger Coordinate</p>
                      <p className="text-xs text-stone-300 mt-1">Period: <span className="font-bold text-white">{monthlySales[hoveredPoint].month} 2026</span></p>
                      <p className="text-sm font-mono font-bold text-white mt-0.5">Value Sum: {monthlySales[hoveredPoint].label}</p>
                    </div>
                  )}

                </div>

              </div>

              {/* Showcase items state list */}
              <div className="lg:col-span-4 p-7 border border-stone-150 rounded-2xl space-y-6">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-100">
                  Featured Blueprints Panel
                </h3>

                <div className="space-y-4">
                  {products.slice(0, 4).map(p => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 p-1 flex items-center justify-center shrink-0">
                          <img 
                            src={p.images[0]} 
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="text-xs truncate max-w-[150px]">
                          <p className="font-semibold text-stone-950 truncate leading-snug">{p.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">Price: ${p.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setSelectedProductId(p.id); setCurrentPage('detail'); }}
                          className="p-1 px-2 border hover:border-stone-950 rounded font-mono text-[9px] uppercase tracking-wider text-stone-500 hover:text-stone-950"
                        >
                          Review 360
                        </button>
                        <button
                          onClick={() => { if(confirm(`Delist ${p.name}?`)) onDeleteProduct(p.id); }}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          aria-label="Delete listing"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUBTAB 2: INCOMING ORDERS STUDY BOARD */}
        {activeSubTab === 'orders' && (
          <div className="space-y-8">
            
            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 py-4 px-5 bg-stone-50 border border-stone-100 rounded-2xl items-center text-xs font-mono">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400 stroke-[1.8]" />
                <input 
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search buyer name, orders logs ID..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 hover:border-stone-300 rounded-xl text-xs placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div className="flex bg-white p-1 rounded-xl border border-stone-200">
                {(['all', 'pending', 'shipped', 'delivered'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wide transition-all ${
                      orderStatusFilter === st 
                        ? 'bg-stone-950 text-white' 
                        : 'text-stone-500 hover:text-stone-950'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 border border-dashed rounded-2xl text-stone-400 space-y-3">
                <AlertCircle className="w-10 h-10 mx-auto text-stone-300" />
                <h4 className="font-display font-medium text-stone-850">No incoming orders filed</h4>
                <p className="text-xs">Incoming purchasing will prompt up on this ledger registry table.</p>
              </div>
            ) : (
              <div className="border border-stone-150 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse bg-white font-sans text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-stone-200/60 font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                      <th className="p-5">Order ID</th>
                      <th className="p-5">Buyer / Client</th>
                      <th className="p-5">Items Sum</th>
                      <th className="p-5">Cost Registered</th>
                      <th className="p-5">Pipeline State</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      const isExpanded = expandedOrderId === o.id;
                      return (
                        <caption key={o.id} className="table-row-group text-stone-800">
                          <tr 
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className={`border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors ${
                              isExpanded ? 'bg-[#FAF9F6]/40' : ''
                            }`}
                          >
                            <td className="p-5 font-mono font-bold text-stone-950">{o.id}</td>
                            <td className="p-5 font-medium">{o.buyerName}</td>
                            <td className="p-5">{o.items.reduce((sum, it) => sum + it.quantity, 0)} Pcs</td>
                            <td className="p-5 font-mono font-medium">${o.totalAmount.toLocaleString()}</td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold ${
                                o.status === 'delivered' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : o.status === 'shipped' 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-250/60'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  o.status === 'delivered' ? 'bg-emerald-600' : o.status === 'shipped' ? 'bg-blue-600' : 'bg-amber-500'
                                }`} />
                                <span>{o.status}</span>
                              </span>
                            </td>
                            <td className="p-5 text-right font-mono text-stone-500 font-bold group-hover:text-stone-950">
                              {isExpanded ? 'Collapse' : 'Review Details'}
                            </td>
                          </tr>

                          {/* Expanded detail box */}
                          {isExpanded && (
                            <tr className="bg-stone-50/20 border-b border-stone-200/40">
                              <td colSpan={6} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-normal">
                                  
                                  {/* Left: Items details list */}
                                  <div className="space-y-4">
                                    <h4 className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#B39D69]">Ordered Cargo</h4>
                                    
                                    <div className="space-y-3.5">
                                      {o.items.map((it, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white border border-stone-150 p-3.5 rounded-xl">
                                          <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 bg-stone-50 border rounded p-1 flex items-center justify-center shrink-0">
                                              <img src={it.image} alt={it.productName} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-stone-900 leading-snug">{it.productName}</p>
                                              <p className="text-[10px] text-stone-400 font-mono mt-0.5">Finish: {it.selectedColor}</p>
                                            </div>
                                          </div>
                                          <span className="font-mono font-medium">${it.price.toLocaleString()} x {it.quantity}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Right: Courier Address & Control Toggles */}
                                  <div className="space-y-6">
                                    <div className="space-y-2.5">
                                      <h4 className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#B39D69]">Delivery Hub Coordinates</h4>
                                      <div className="bg-white border border-stone-150 p-4 rounded-xl space-y-1.5 font-sans">
                                        <p className="font-bold text-stone-900">{o.buyerName} <span className="font-mono text-[9px] text-stone-400 font-normal">({o.buyerEmail})</span></p>
                                        <p className="text-stone-500 font-light">{o.deliveryAddress.street}</p>
                                        <p className="text-stone-500 font-light">{o.deliveryAddress.postalCode} {o.deliveryAddress.city}, {o.deliveryAddress.country}</p>
                                        <p className="text-[10px] font-mono text-stone-400 uppercase pt-2 border-t mt-3.5">TRANSPORT CHARTER: {o.deliveryMethod} delivery</p>
                                      </div>
                                    </div>

                                    {/* Action items status change */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#B39D69]">Approve Pipeline Progression</h4>
                                      <div className="flex gap-2">
                                        {(['pending', 'shipped', 'delivered'] as const).map(statusOpt => (
                                          <button
                                            key={statusOpt}
                                            onClick={(e) => { e.stopPropagation(); onUpdateOrderStatus(o.id, statusOpt); }}
                                            className={`flex-1 py-2.5 border rounded-lg text-[10px] font-mono font-bold uppercase transition-all tracking-wide flex items-center justify-center gap-1.5 ${
                                              o.status === statusOpt
                                                ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                                                : 'bg-white text-stone-600 hover:border-stone-400 border-stone-200'
                                            }`}
                                          >
                                            {o.status === statusOpt && <Check className="w-3.5 h-3.5" />}
                                            <span>Mark {statusOpt}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </caption>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* SUBTAB 3: ADD NEW FURNITURE BLUEPRINT */}
        {activeSubTab === 'add-product' && (
          <form onSubmit={handleCreateProductSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-xs">
            
            {/* Left Fields Column (7 parts) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Product Info description blocks */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                  1. Basic Catalog Metadata
                </h3>

                <div className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-stone-500 uppercase">Interactive Design Title</label>
                      <input 
                        required
                        type="text"
                        placeholder="E.g., Pierre Bouclé Easy Chair"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-stone-500 uppercase">Collection Catalog Role</label>
                      <select 
                        value={newProdCategory}
                        onChange={(e: any) => setNewProdCategory(e.target.value)}
                        className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl font-sans"
                      >
                        <option value="living-room">Living Room Showcase</option>
                        <option value="dining">Dining & Cabinetry</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="office">Workspace</option>
                        <option value="lighting">Architectural Lighting</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">One-Sentence Summary</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Low-slung sculptural chair styled with raw Italian rattan..."
                      value={newProdShortDesc}
                      onChange={(e) => setNewProdShortDesc(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Detailed Architectural Description</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Expand on the wood grading values, frame joint deflections, and design blueprints inspiration..."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

              </div>

              {/* Physical specifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                  2. Physical Specifications & Blueprint Values
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Span Dimensions (W x D x H)</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., W 220cm x D 105cm x H 70cm"
                      value={newSpecDimensions}
                      onChange={(e) => setNewSpecDimensions(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Maximum Safe Load Limits</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., 200 kg"
                      value={newSpecWeightLimit}
                      onChange={(e) => setNewSpecWeightLimit(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Accredited Materials (Comma split)</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Recovered Solid Teak Wood, Organic Cane Mesh"
                      value={newProdMaterials}
                      onChange={(e) => setNewProdMaterials(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-[#B39D69] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Finish Selection Options (Comma split)</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Honey Teak, Charcoal Noir"
                      value={newProdColors}
                      onChange={(e) => setNewProdColors(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Bespoke Lead Designer</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Harald Thorsen, Studio Nord"
                      value={newSpecDesigner}
                      onChange={(e) => setNewSpecDesigner(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Production provence geographic origin</label>
                    <input 
                      required
                      type="text"
                      placeholder="E.g., Aarhus, Denmark"
                      value={newSpecOrigin}
                      onChange={(e) => setNewSpecOrigin(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Maintenance & Cleaning Instructions</label>
                  <input 
                    required
                    type="text"
                    placeholder="E.g., Dust weekly. professional upholstery vacuuming on safe settings..."
                    value={newSpecCare}
                    onChange={(e) => setNewSpecCare(e.target.value)}
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Gallery upload and visualization config files upload mockups */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-2 border-b border-stone-100">
                  3. Studio Gallery & Spatial files
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">High Definition Preview Image URL</label>
                    <input 
                      required
                      type="text"
                      placeholder="Paste Unsplash images URL..."
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  {/* Drag and Drop uploads for CAD files. This supports user intent by giving simulated drag structures */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">CAD Spatial AR `.usdz` Model</label>
                    <div className="w-full h-13 border border-dashed border-stone-300 rounded-xl bg-stone-50/20 flex items-center justify-center font-mono text-[10px] text-stone-400 gap-2 cursor-pointer hover:bg-stone-50 hover:border-stone-900 transition-colors">
                      <Upload className="w-4.5 h-4.5" />
                      <span>Drag spatial models or click</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Admin Summary Card Panel (5 parts) */}
            <div className="lg:col-span-5 p-7 bg-stone-50 border border-stone-150 rounded-2xl space-y-6">
              
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#B39D69] uppercase pb-3 border-b border-stone-200/40">
                Listing Registry Coordinates
              </h3>

              {/* Live Card Preview mockup */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-stone-400 uppercase">Realtime Live Customer Card Preview</span>
                <div className="bg-white p-4.5 rounded-xl border border-stone-200/60 shadow-sm space-y-3.5">
                  <div className="aspect-square bg-stone-50/80 rounded-lg p-3 overflow-hidden flex items-center justify-center relative">
                    <span className="absolute top-2 left-2 text-[8px] font-mono text-stone-400 bg-white border px-1.5 py-0.5 rounded uppercase">NEW DESIGN PREVIEW</span>
                    <img src={newProdImage || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80'} referrerPolicy="no-referrer" alt="preview" className="max-h-full max-w-full object-contain drop-shadow-sm" />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-display font-medium text-sm text-stone-950 truncate max-w-[170px]">{newProdName || 'Name Placeholder'}</h4>
                      <p className="text-[9px] font-mono text-stone-400 mt-0.5 uppercase">ByCategory: {newProdCategory}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-stone-950">${newProdPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Price Deflection setup slider */}
              <div className="space-y-3 pt-2.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-stone-500 uppercase font-bold">Showroom Commission Price</span>
                  <span className="text-stone-950 font-bold font-sans text-sm">${newProdPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-150 rounded-lg appearance-none cursor-pointer accent-stone-950"
                />
                <div className="flex justify-between font-mono text-[9px] text-stone-400">
                  <span>Draft: $500</span>
                  <span>Max Limit: $10,000</span>
                </div>
              </div>

              {/* Status visibility Toggles */}
              <div className="flex justify-between items-center p-3.5 bg-white border border-stone-200 rounded-xl text-xs font-mono">
                <div className="space-y-0.5">
                  <p className="font-bold text-stone-850">Visibilities in Showrooms</p>
                  <p className="font-sans text-[10px] text-stone-400 font-light">Controls whether visible immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewListingVisibility(!newListingVisibility)}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                    newListingVisibility 
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                      : 'bg-stone-100 border-stone-200 text-stone-500'
                  }`}
                >
                  {newListingVisibility ? (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Private</span>
                    </>
                  )}
                </button>
              </div>

              {/* Submit execution */}
              <button
                type="submit"
                className="w-full py-4 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 group transition-all"
              >
                <span>Commit & Log Blueprint</span>
                <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}
