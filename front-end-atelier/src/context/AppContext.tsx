import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data';

interface AppContextProps {
  user: User | null;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  reviews: Record<string, Review[]>;
  login: (email: string, password: string) => { success: boolean; role?: 'customer' | 'seller'; message: string };
  logout: () => void;
  registerUser: (name: string, email: string, role: 'customer' | 'seller') => void;
  addToCart: (product: Product, color: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, color: string) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  addReview: (productId: string, review: Review) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

function mergeInitialProducts(savedProducts: Product[]) {
  const migratedProducts = savedProducts.filter(product => product.id !== 'modern-3d-chair');
  const savedIds = new Set(migratedProducts.map(product => product.id));
  const missingInitialProducts = INITIAL_PRODUCTS.filter(product => !savedIds.has(product.id));
  return [...missingInitialProducts, ...migratedProducts];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load and sync state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('atelier_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products');
    return saved ? mergeInitialProducts(JSON.parse(saved)) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('atelier_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Save changes to localStorage on any state change
  useEffect(() => {
    if (user) {
      localStorage.setItem('atelier_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('atelier_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('atelier_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Login handler
  const login = (email: string, password: string) => {
    // Exact Demo credentials rules:
    // customer@example.com / customer123 -> customer
    // seller@example.com / seller123 -> seller
    if (email === 'customer@example.com' && password === 'customer123') {
      const u: User = { id: 'usr-customer', name: 'Adrian Sterling', email, role: 'customer' };
      setUser(u);
      return { success: true, role: 'customer' as const, message: 'Welcome Customer!' };
    } else if (email === 'seller@example.com' && password === 'seller123') {
      const u: User = { id: 'usr-seller', name: 'Alexander Mercer', email, role: 'seller' };
      setUser(u);
      return { success: true, role: 'seller' as const, message: 'Welcome Seller!' };
    }
    
    return { success: false, message: 'Invalid demo credentials. Please check the credentials helper.' };
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const registerUser = (name: string, email: string, role: 'customer' | 'seller') => {
    const u: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role
    };
    setUser(u);
  };

  // Cart actions
  const addToCart = (product: Product, color: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, selectedColor: color, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => !(item.product.id === productId && item.selectedColor === color)
        );
      }
      return prev.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity }
          : item
      );
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedColor === color))
    );
  };

  const clearCart = () => setCart([]);

  // Orders
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  // Product management (Seller flow)
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Review additions
  const addReview = (productId: string, r: Review) => {
    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [r, ...existing]
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        orders,
        cart,
        wishlist,
        reviews,
        login,
        logout,
        registerUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        addOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleWishlist,
        addReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
