import { Product, Review, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'nordic-oak-table',
    name: 'Nordic Oak Dining Table',
    shortDescription: 'Minimalist masterwork sculptured from a single source of FSC-certified European Oak.',
    description: 'The Nordic Oak Dining Table represents architectural purism at its zenith. Hand-finished by local Danish carpenters, its seamlessly continuous timber grains highlight the natural timber growth rings. Its robust undertruss frame handles structural deflection with ease, ensuring decades of intergenerational resilience.',
    price: 3850,
    rating: 4.9,
    reviewCount: 38,
    category: 'dining',
    materials: ['Solid European Oak', 'FSC Polyurethane Sealant', 'Stainless Undertruss Pins'],
    colors: [
      { name: 'Chalked White Oak', hex: '#EAE5D9' },
      { name: 'Natural Smoked Oak', hex: '#8F7E6B' },
      { name: 'Charcoal Black Oak', hex: '#2A2927' }
    ],
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    // Let's mock 8 different rotation perspectives (lighting/rotation mockups, or just high-quality angles)
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80&sat=-50',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80&sat=-50',
      'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=1200&q=80&sat=-50',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80&hue=15',
      'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=1200&q=80&hue=15'
    ],
    details: {
      material: '100% Solid European Oak (FSC Certified)',
      dimensions: 'W 240cm x D 100cm x H 75cm',
      careInstructions: 'Wipe with soft, dry microfibre cloth. Treat with specialized white wood oil every 12 months.',
      origin: 'Aarhus, Denmark',
      weightLimit: '180 kg',
      designer: 'Harald Thorsen, Studio Nord',
      woodGrade: 'Premium Grade A (Zero Structural Knots)'
    },
    sellerId: 'studio-nord',
    isFeatured: true
  },
  {
    id: 'boucle-curved-sofa',
    name: 'Pierre Bouclé Curved Sofa',
    shortDescription: 'Organic low-slung architectural lounger matching plush bouclé textile comfort.',
    description: 'Constructed around a sculptural, bio-morphic timber framing, the Pierre Curved Sofa is wrapped entirely in rich Italian bouclé. Generous dual-density foam cores deliver optimal ergonomic weight distribution with a luxurious, floating lounge posture.',
    price: 5200,
    rating: 4.8,
    reviewCount: 24,
    category: 'living-room',
    materials: ['High-texture Italian Bouclé (35% Wool, 65% Cotton)', 'Multi-density Polyurethane Core', 'Larchwood Internal Frame'],
    colors: [
      { name: 'Oatmeal Bouclé', hex: '#EDECE7' },
      { name: 'Sage Moss Bouclé', hex: '#949E82' },
      { name: 'Taupe Dust Bouclé', hex: '#8B8378' }
    ],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80&sat=-40',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80&sat=-40',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80&sat=-40',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80&hue=-20',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80&hue=-20'
    ],
    details: {
      material: 'Italian Bouclé & Solid Larchwood',
      dimensions: 'W 280cm x D 115cm x H 68cm',
      careInstructions: 'Professional upholstery clean only. Vacuum on low-suction weekly with soft brush head.',
      origin: 'Florence, Italy',
      weightLimit: '350 kg',
      designer: 'Pierre-Luc Morel, Atelier Morel',
      woodGrade: 'Premium Structural Larchwood'
    },
    sellerId: 'atelier-morel',
    isFeatured: true
  },
  {
    id: 'mid-century-credenza',
    name: 'Walnut Architect Credenza',
    shortDescription: 'Classic mid-century silhouette featuring walnut veneers and sand-cast solid brass details.',
    description: 'This monolithic credenza showcases grain-matched American Walnut panels across four soft-closing cabinet doors. Hand-fitted joinery and patinated brass pulls yield a refined storage centerpiece for bespoke boardrooms and private galleries.',
    price: 4300,
    rating: 4.7,
    reviewCount: 15,
    category: 'office',
    materials: ['American Black Walnut Veneer', 'Solid Walnut Legs', 'PVD Brass Hardware'],
    colors: [
      { name: 'Oiled Natural Walnut', hex: '#624A32' },
      { name: 'Ebonized Dark Walnut', hex: '#2F251F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80&sat=-50',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80&sat=-50',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80&hue=10'
    ],
    details: {
      material: 'American Black Walnut Veneer over High-Density Core, Solid Walnut Frame & Legs',
      dimensions: 'W 210cm x D 50cm x H 70cm',
      careInstructions: 'Dust weekly. Polish with premium natural beeswax polish every 6 months.',
      origin: 'Portland, United States',
      weightLimit: '120 kg',
      designer: 'Jonathan Cole, LineaForm',
      woodGrade: 'A-Grade Select Walnut Veneers'
    },
    sellerId: 'linea-form',
    isFeatured: false
  },
  {
    id: 'carrara-coffee-table',
    name: 'Italian Carrara Coffee Table',
    shortDescription: 'Monolithic fluted base in sandblasted Carrara marble topped with an elegant honed slab.',
    description: 'Carved directly from elite quarry block remnants in Tuscany, this coffee table displays intricate grey veins cutting dynamically across crystalline white. The honed, unsealed surface invites tactile encounters with natural mineral structures.',
    price: 3100,
    rating: 4.9,
    reviewCount: 19,
    category: 'living-room',
    materials: ['Honed Carrara Marble', 'Tumbled Sandstone Column Base', 'Satin-Sheen Marble sealer'],
    colors: [
      { name: 'Carrara White', hex: '#ECEAE6' },
      { name: 'Nero Marquina Black', hex: '#1C1B1A' }
    ],
    images: [
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80'
    ],
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80&sat=-40',
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80&sat=-40'
    ],
    details: {
      material: 'Authentic Honed Tuscan Carrara Marble Coated in Acid-Resistant Shielding',
      dimensions: 'Dia 100cm x H 38cm',
      careInstructions: 'Use coasters instantly for acidic liquids or red wine. Avoid chemical household cleaners.',
      origin: 'Carrara, Italy',
      weightLimit: '150 kg',
      designer: 'Enzo Castelli, Carrara Lab',
      woodGrade: 'Premium Quarry Grade AP (First Selection)'
    },
    sellerId: 'carrara-lab',
    isFeatured: true
  },
  {
    id: 'brutalist-brass-sconce',
    name: 'Brutalist Brass Floor Sconce',
    shortDescription: 'Sculpted lighting piece in sand-cast molten yellow brass casting dramatic shadows.',
    description: 'An exploration of organic texture and radiant shadows, this high-end floor lamp features a cast-mold brass reflector panel with irregular molten fissures. Light glows from integrated, high-CRI warm-spectrum LEDs embedded in its structural base.',
    price: 1950,
    rating: 4.6,
    reviewCount: 9,
    category: 'lighting',
    materials: ['Cast Raw Brass', 'Bronzed Anodized Alum Base', 'Warm-dim LED modules'],
    colors: [
      { name: 'Aged Molten Brass', hex: '#C2AB77' },
      { name: 'Patinated Bronze', hex: '#5E523F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80'
    ],
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80&sat=-60'
    ],
    details: {
      material: 'Genuine Sand-Cast Refined Brass Frame, Solid Slate Counterweight Base',
      dimensions: 'W 45cm x D 40cm x H 165cm',
      careInstructions: 'Wipe with dry microfiber cloth only. Do not polish raw brass unless bright finish is desired.',
      origin: 'Munich, Germany',
      weightLimit: 'N/A',
      designer: 'Maximilian Schreiner, Studio Schreiner'
    },
    sellerId: 'studio-schreiner',
    isFeatured: false
  },
  {
    id: 'jeanneret-easy-chair',
    name: 'Jeanneret Easy Armchair',
    shortDescription: 'Faithful reissue of the legendary woven cane and solid teak lounge chair.',
    description: 'A quiet monument to mid-century industrial elegance, this easy chair balances warm solid teak timber angles with hand-woven organic rattan cane weaving. Designed with deep ergonomic lounge recline angles for ultimate conversation circles.',
    price: 2400,
    rating: 4.8,
    reviewCount: 42,
    category: 'living-room',
    materials: ['Recovered Solitary Teak Wood', 'Organic Rattan Cane Mesh'],
    colors: [
      { name: 'Heritage Honey Teak', hex: '#A3683E' },
      { name: 'Ebonized Black Teak', hex: '#1C1613' }
    ],
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80'
    ],
    threeSixtyImages: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80&sat=-50'
    ],
    details: {
      material: 'FSC-Certified Old-Growth Burma Teak Wood & Natural Hand-Peeled Cane Webbing',
      dimensions: 'W 58cm x D 76cm x H 71cm',
      careInstructions: 'Apply specialized teak feeding dressing occasionally. Protect woven cane webbing from direct dampness.',
      origin: 'Puducherry, India',
      weightLimit: '140 kg',
      designer: 'Pierre Jeanneret Homage, Chandigarh Collection',
      woodGrade: 'Premium Burma Solid Teak'
    },
    sellerId: 'chandigarh-studio',
    isFeatured: true
  }
];

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  'nordic-oak-table': [
    {
      id: 'rev-1',
      userName: 'Adrian Sterling',
      userAvatar: 'AS',
      rating: 5,
      date: 'May 12, 2026',
      comment: 'An absolute masterpiece. The solid lines are perfectly flush, and the chalked white oak feels incredible to touch. White glove delivery was flawless.'
    },
    {
      id: 'rev-2',
      userName: 'Isabella Vane',
      userAvatar: 'IV',
      rating: 5,
      date: 'April 28, 2026',
      comment: 'Extremely clean joins and sturdy build. In the evening, the table looks architectural. An investment piece.'
    }
  ],
  'boucle-curved-sofa': [
    {
      id: 'rev-3',
      userName: 'Elena Rostova',
      userAvatar: 'ER',
      rating: 5,
      date: 'May 14, 2026',
      comment: 'The grain of the bouclé is dense and of pristine quality. Floating feeling is highly accurate. Outstanding craft.'
    }
  ],
  'jeanneret-easy-chair': [
    {
      id: 'rev-4',
      userName: 'Marcus Aurelius',
      userAvatar: 'MA',
      rating: 4,
      date: 'May 01, 2026',
      comment: 'True to the heritage blueprints. The teak is dry and robust, and the cane weave has perfect tension. A delight in my reading nook.'
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ATL-9382',
    buyerName: 'Serena Vance',
    buyerEmail: 'serena@vancestudio.com',
    deliveryAddress: {
      street: '142 Mercer St, Loft 4B',
      city: 'New York',
      postalCode: '10012',
      country: 'United States'
    },
    deliveryMethod: 'white-glove',
    items: [
      {
        productId: 'nordic-oak-table',
        productName: 'Nordic Oak Dining Table',
        price: 3850,
        quantity: 1,
        selectedColor: 'Chalked White Oak',
        image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 3850 + 250, // Including white-glove fee
    status: 'pending',
    createdAt: '2026-05-24T14:32:00Z'
  },
  {
    id: 'ATL-9381',
    buyerName: 'Klaus Lindner',
    buyerEmail: 'k.lindner@designberlin.de',
    deliveryAddress: {
      street: 'Heidestraße 17',
      city: 'Berlin',
      postalCode: '10557',
      country: 'Germany'
    },
    deliveryMethod: 'express',
    items: [
      {
        productId: 'jeanneret-easy-chair',
        productName: 'Jeanneret Easy Armchair',
        price: 2400,
        quantity: 2,
        selectedColor: 'Heritage Honey Teak',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 4800 + 120, // 2 items + express fee
    status: 'shipped',
    createdAt: '2026-05-22T09:15:00Z'
  },
  {
    id: 'ATL-9378',
    buyerName: 'Chiara Bianchi',
    buyerEmail: 'chiara@bianchiforma.it',
    deliveryAddress: {
      street: 'Via della Cernaia 24',
      city: 'Milan',
      postalCode: '20121',
      country: 'Italy'
    },
    deliveryMethod: 'standard',
    items: [
      {
        productId: 'carrara-coffee-table',
        productName: 'Italian Carrara Coffee Table',
        price: 3100,
        quantity: 1,
        selectedColor: 'Carrara White',
        image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 3100,
    status: 'delivered',
    createdAt: '2026-05-18T16:45:00Z'
  }
];
