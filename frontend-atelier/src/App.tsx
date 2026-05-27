import { useState, useMemo } from 'react';
import { Product, CartItem, Order, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS } from './data';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerOverview from './pages/SellerOverview';
import Auth from './pages/Auth';

export default function App() {
  // Session States
  const [user, setUser] = useState<User | null>({
    id: 'usr-demo',
    name: 'Alexander Mercer',
    email: 'alex@mercer.com',
    role: 'customer'
  }); // Pre-populated with luxury patron to keep it immediately interactive! No empty roadblocks.

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('nordic-oak-table');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'orders' | 'add-product'>('overview');

  // Dynamic Content Registers
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviewsMap, setReviewsMap] = useState(INITIAL_REVIEWS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cart Handlers
  const handleAddToCart = (product: Product, color: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );

      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity
        };
        return newCart;
      }

      return [...prev, { product, quantity, selectedColor: color }];
    });
  };

  const handleUpdateQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  // Checkout Handlers
  const handleCompleteCheckout = (orderData: Partial<Order>) => {
    const newOrderId = `ATL-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder: Order = {
      id: newOrderId,
      buyerName: orderData.buyerName || 'Premium Client',
      buyerEmail: orderData.buyerEmail || 'client@atelier.co',
      deliveryAddress: orderData.deliveryAddress || {
        street: 'Room 20B',
        city: 'Showroom',
        postalCode: '10000',
        country: 'Global'
      },
      deliveryMethod: orderData.deliveryMethod || 'standard',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [fullOrder, ...prev]);
    setCart([]); // Clear device shopping cart
    return newOrderId;
  };

  // Seller Dashboard Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Navigation controller for back tracing
  const handleNavigateBack = () => {
    setCurrentPage('catalog');
  };

  const handleViewProductFromDetails = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  // Filter featured products for landing pages
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  // Main Page Router switch-case
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            featuredProducts={featuredProducts}
          />
        );
      case 'catalog':
        return (
          <Catalog
            products={products}
            onViewDetails={(id) => {
              setSelectedProductId(id);
              setCurrentPage('detail');
            }}
            onAddToCart={(p, color) => handleAddToCart(p, color, 1)}
          />
        );
      case 'detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            products={products}
            reviewsMap={reviewsMap}
            onAddToCart={handleAddToCart}
            onNavigateBack={handleNavigateBack}
            onNavigateToCatalog={() => setCurrentPage('catalog')}
            onViewProduct={handleViewProductFromDetails}
          />
        );
      case 'cart':
        return (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigateToCatalog={() => setCurrentPage('catalog')}
            onProceedToCheckout={() => setCurrentPage('checkout')}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cart={cart}
            onCompleteCheckout={handleCompleteCheckout}
            onNavigateToCatalog={() => setCurrentPage('catalog')}
          />
        );
      case 'seller-overview':
      case 'seller-orders':
      case 'seller-add':
        return (
          <SellerOverview
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteProduct={handleDeleteProduct}
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
          />
        );
      case 'auth':
        return (
          <Auth
            setUser={setUser}
            setCurrentPage={setCurrentPage}
          />
        );
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            featuredProducts={featuredProducts}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden antialiased">
      
      {/* Top sticky navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          // If accessing specific seller workspaces, set their respective nested subtab
          if (page === 'seller-overview') {
            setActiveSubTab('overview');
          } else if (page === 'seller-orders') {
            setActiveSubTab('orders');
          } else if (page === 'seller-add') {
            setActiveSubTab('add-product');
          }
          setCurrentPage(page);
        }}
        cart={cart}
        user={user}
        setUser={setUser}
      />

      {/* Primary interactive node content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Bottom cohesive footer */}
      <Footer setCurrentPage={setCurrentPage} />

    </div>
  );
}
