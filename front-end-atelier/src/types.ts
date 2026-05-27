export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: 'living-room' | 'dining' | 'dining-room' | 'bedroom' | 'office' | 'lighting';
  materials: string[];
  colors: { name: string; hex: string; previewUrl?: string }[];
  images: string[];
  threeSixtyImages: string[]; // Mocking 360-degree frames
  model3DUrl?: string | null;
  details: {
    material: string;
    dimensions: string;
    careInstructions: string;
    origin: string;
    weightLimit?: string;
    designer: string;
    woodGrade?: string;
  };
  sellerId: string;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: 'standard' | 'express' | 'white-glove';
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedColor: string;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller';
}

export interface Metrics {
  totalSales: number;
  activeOrders: number;
  activeProducts: number;
  conversations: number;
  visits: number;
}
