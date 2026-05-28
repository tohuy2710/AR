import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  TrendingUp,
  Sofa,
  Package,
  ShieldCheck,
  DollarSign,
  Clock,
  Truck,
  MessageSquare,
  Users,
  Award,
  ChevronRight,
  Play,
  AlertCircle,
} from "lucide-react";

export default function SellerDashboard() {
  const { products, orders, user } = useApp();
  const navigate = useNavigate();

  // Filter products by this seller ID (e.g. they can own products under their brand, or we show all for simulated convenience)
  // For sandbox, we can show products in the system. Let's make it brand conscious or editable!
  const myProductsCount = products.length;

  // Calculations
  const totalSales = orders
    .filter((o) => o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingShipments = orders.filter((o) => o.status === "pending");

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="font-sans text-stone-900 text-left space-y-6 sm:space-y-8">
      {/* 1. Header Hero Welcome */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="relative z-10 max-w-xl space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-light leading-tight">
            Welcome back,{" "}
            <span className="font-normal text-[#c2ab77]">{user?.name}</span>
          </h1>
          <p className="text-stone-400 text-xs font-light leading-relaxed">
            Monitor incoming raw timber purchase orders, modify specifications
            of existing collections, or update PVD metallic hardware stocks.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl flex justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] font-mono text-stone-400 uppercase">
              Gross Co-Op Revenue
            </p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-stone-950 break-words">
              ${totalSales.toLocaleString()}
            </p>
            <p className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
              <span>↑ 12.4%</span>
              <span className="text-stone-400 font-normal">This Month</span>
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-150">
            <DollarSign className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl flex justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] font-mono text-stone-400 uppercase">
              Pending Freight Dispatch
            </p>
            <p className="text-2xl font-mono font-bold text-stone-950">
              {pendingShipments.length}
            </p>
            <p className="text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin text-amber-600" />
              <span>Awaiting validation</span>
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-150">
            <Truck className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl flex justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] font-mono text-stone-400 uppercase">
              Registered Products
            </p>
            <p className="text-2xl font-mono font-bold text-stone-950">
              {myProductsCount}
            </p>
            <p className="text-[10px] font-mono text-stone-500 font-bold">
              <span>Including 4 360D CADs</span>
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-150">
            <Sofa className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Metric 4 */}
        {/* <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-2xl flex justify-between items-start gap-4"> */}
        {/* <div className="space-y-1 min-w-0"> */}
        {/* <p className="text-[10px] font-mono text-stone-400 uppercase">
              Chamber Rating
            </p>
            <p className="text-2xl font-mono font-bold text-stone-950">
              4.9 / 5.0
            </p> */}
        {/* <p className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600" />
              <span>Accredited Workspace</span>
            </p>
          </div> */}
        {/* <div className="p-3 bg-stone-50 rounded-xl border border-stone-150">
            <Users className="w-5 h-5 text-stone-700" />
          </div>
        </div> */}
      </div>

      {/* 3. Action Warnings and Recent Orders splits layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left 2 Cols: Recent incoming ledger */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-stone-100">
            <h3 className="font-display font-medium text-base text-stone-950">
              Recent Commission Enrolments
            </h3>
            <Link
              to="/seller/orders"
              className="text-xs font-mono font-bold text-[#B39D69] hover:text-stone-950 uppercase flex items-center gap-1"
            >
              <span>Manage ledger</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-5">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-stone-50/70 border border-stone-100/80 transition-all cursor-pointer min-w-0"
                onClick={() => navigate("/seller/orders")}
              >
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-stone-900 font-mono text-xs font-bold border flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-stone-550" />
                  </div>
                  <div className="text-left select-none min-w-0">
                    <p className="font-semibold text-stone-950 text-sm">
                      {ord.buyerName}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5 break-all">
                      ID: {ord.id} • {ord.items.length} items
                    </p>
                  </div>
                </div>

                <div className="flex font-mono text-xs text-stone-500 gap-6 items-center w-full sm:w-auto justify-between sm:justify-start">
                  <div>
                    <p className="text-[9px] text-stone-400 text-left sm:text-right">
                      SUM
                    </p>
                    <p className="font-bold text-stone-950">
                      ${ord.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                      ord.status === "delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        : ord.status === "shipped"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                          : "bg-amber-50 text-amber-700 border border-amber-200/50"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Urgent tasks widget */}
        {/* <div className="lg:col-span-1 bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between"> */}
        {/* <div className="space-y-4">
            <h3 className="font-display font-medium text-base text-stone-950">
              Atelier Task Tracker
            </h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              System diagnostics of your artisan workspace catalog health.
            </p>

            <div className="space-y-3.5 text-xs text-stone-700">
              <div className="p-3.5 rounded-xl bg-white border border-stone-150 flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-900">
                    Check Teak Moisture
                  </p>
                  <p className="text-stone-500 font-light text-[11px]">
                    Chandigarh Lounge Cane requires 12% moisture alignment
                    checking.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-150 flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-900">
                    FSC Renewal Complete
                  </p>
                  <p className="text-stone-500 font-light text-[11px]">
                    Yearly European lumber grade verification complete till May
                    2027.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

        {/* <button
            onClick={() => navigate("/seller/products")}
            className="w-full mt-4 py-3 bg-stone-950 hover:bg-stone-900 text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>Audit Products Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
}

// Quick helper
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
