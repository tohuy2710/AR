import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Global shared layout wrapper (Header + Main content + Footer)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Flow pages
import CustomerHome from './pages/customer/CustomerHome';
import ProductListing from './pages/customer/ProductListing';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import Wishlist from './pages/customer/Wishlist';
import CustomerProfile from './pages/customer/CustomerProfile';

// Seller Flow pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddEditProduct from './pages/seller/AddEditProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerInventory from './pages/seller/SellerInventory';
import SellerAnalytics from './pages/seller/SellerAnalytics';
// import SellerProfile from './pages/seller/SellerProfile';

// Sidebar Icons for professional dashboard
import { 
  LayoutDashboard, Sofa, Box, History, Award, Layers, LogOut, ChevronRight
} from 'lucide-react';

// 1. Customer Layout (includes global header & footer)
function CustomerLayout() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden antialiased">
      <Navbar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// 2. Seller Layout (professional dashboard with persistent sidebar)
function SellerLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleSidebarLogout = () => {
    logout();
    navigate('/');
  };

  const sellerNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex shrink-0 items-center gap-2.5 lg:gap-3.5 px-3.5 py-2.5 rounded-xl text-[10px] lg:text-xs font-mono uppercase tracking-wider transition-all border whitespace-nowrap ${
      isActive 
        ? 'bg-white/10 border-white/10 text-white font-bold' 
        : 'text-stone-400 border-transparent hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row selection:bg-amber-100 selection:text-amber-900 text-stone-900 overflow-x-hidden antialiased">
      
      {/* Dynamic persistent left navigation sidebar */}
      <aside className="w-full lg:w-64 bg-stone-950 text-white shrink-0 lg:min-h-screen flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-900 p-4 sm:p-5 lg:p-6 font-sans sticky top-0 z-30 lg:relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />
        
        <div className="space-y-4 lg:space-y-8 relative z-10 text-left min-w-0">
          
          {/* Logo return Link context */}
          <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer lg:pb-6 lg:border-b border-stone-850 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#c2ab77] text-white flex items-center justify-center">
              <Sofa className="w-4.5 h-4.5 text-stone-950 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-medium text-lg tracking-widest text-white leading-none block">ATELIER</span>
              <span className="text-[7px] tracking-[0.25em] uppercase text-[#c2ab77] font-mono leading-none mt-1.5 block">Studio Workspace</span>
            </div>
          </Link>

          <button
            onClick={handleSidebarLogout}
            className="lg:hidden w-9 h-9 bg-rose-950 hover:bg-rose-900 border border-rose-900/50 text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Sign out workspace"
            title="Sign out workspace"
          >
            <LogOut className="w-4 h-4" />
          </button>
          </div>

          {/* Quick profile metadata bubble */}
          <div className="bg-stone-900/50 border border-stone-850 rounded-xl p-3 flex items-center gap-3 lg:p-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#c2ab77] text-stone-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[9px] font-mono text-stone-400 capitalize">Role: {user?.role}</p>
            </div>
          </div>

          {/* Sidebar Navigation Options */}
          <nav className="space-y-2 lg:space-y-1.5">
            <span className="hidden lg:block text-[9.5px] font-mono tracking-widest uppercase text-stone-500 font-bold mb-3.5 pl-1.5">Studio Operations</span>
            
            <div className="flex lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0 -mx-1 px-1">
              <NavLink to="/seller" end className={sellerNavLinkClass}>
                <LayoutDashboard className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Workspace Hub</span>
              </NavLink>

              <NavLink to="/seller/products" className={sellerNavLinkClass}>
                <Box className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Catalog Registry</span>
              </NavLink>

              <NavLink to="/seller/orders" className={sellerNavLinkClass}>
                <History className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Client Orders</span>
              </NavLink>

              <NavLink to="/seller/inventory" className={sellerNavLinkClass}>
                <Layers className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Moisture Levels</span>
              </NavLink>

              <NavLink to="/seller/analytics" className={sellerNavLinkClass}>
                <Award className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Sales Ledger</span>
              </NavLink>

              {/* <NavLink to="/seller/profile" className={sellerNavLinkClass}>
                <Settings className="w-4 h-4 text-[#c2ab77] shrink-0" />
                <span>Studio Profile</span>
              </NavLink> */}
            </div>

          </nav>
        </div>

        {/* Bottom signout keys */}
        <div className="hidden lg:block space-y-4 pt-6 mt-12 border-t border-stone-850 relative z-10">
          <Link
            to="/"
            className="w-full py-2 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white text-[10px] font-mono uppercase font-bold text-center rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <span>Exit to Public Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          
          <button
            onClick={handleSidebarLogout}
            className="w-full py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-900/50 text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Workspace</span>
          </button>
        </div>

      </aside>

      {/* Main active panels context right content scroll area */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-stone-50 p-4 sm:p-6 lg:p-12 relative min-w-0">
        <Outlet />
      </main>

    </div>
  );
}

// Global Routing Application Node
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public customer-facing global wrapper layout */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            
            {/* Customer Flow Pages, protected under allowedRole="customer" */}
            <Route path="customer" element={
              <ProtectedRoute allowedRole="customer">
                <CustomerHome />
              </ProtectedRoute>
            } />
            <Route path="customer/products" element={
              <ProtectedRoute allowedRole="customer">
                <ProductListing />
              </ProtectedRoute>
            } />
            <Route path="customer/products/:id" element={
              <ProtectedRoute allowedRole="customer">
                <ProductDetail />
              </ProtectedRoute>
            } />
            <Route path="customer/cart" element={
              <ProtectedRoute allowedRole="customer">
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="customer/checkout" element={
              <ProtectedRoute allowedRole="customer">
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="customer/orders" element={
              <ProtectedRoute allowedRole="customer">
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="customer/wishlist" element={
              <ProtectedRoute allowedRole="customer">
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="customer/profile" element={
              <ProtectedRoute allowedRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            } />
          </Route>

          {/* Dedicated Seller Flow workspace, protected under allowedRole="seller" and rendering persistent sidebar */}
          <Route path="seller" element={
            <ProtectedRoute allowedRole="seller">
              <SellerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<AddEditProduct />} />
            <Route path="products/:id/edit" element={<AddEditProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            {/* <Route path="profile" element={<SellerProfile />} /> */}
          </Route>

          {/* Simple Authentication portals outside global layout */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Catch-all redirect to public Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
