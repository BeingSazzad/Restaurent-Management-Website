export interface DishModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface DishModifierGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: DishModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'biryani' | 'curries' | 'grill' | 'vegetarian' | 'breads' | 'desserts' | 'combos';
  categoryLabel: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  prepTime: string;
  calories?: number;
  allergens: string[];
  dietary: ('halal' | 'vegetarian' | 'vegan' | 'gluten-free')[];
  isBestSeller?: boolean;
  isAvailable: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  spiceLevel?: number;
  modifierGroups?: DishModifierGroup[];
  suggestedPairingIds?: string[];
}

export interface CartItem {
  cartItemId: string;
  dish: MenuItem;
  quantity: number;
  selectedModifiers: {
    groupName: string;
    optionName: string;
    price: number;
  }[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: 'delivery' | 'collection';
  deliveryAddress?: string;
  eircode?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedMinutes: number;
  specialNotes?: string;
  paymentMethod: 'card' | 'apple_pay' | 'cash';
}

export const RESTAURANT_INFO = {
  name: "AMBER SPICE",
  tagline: "Authentic Flavors · Timeless Recipes",
  subtitle: "Discover The Real Taste of Heritage Kitchen",
  location: "18 South William St, Dublin 2, D02 HR58, Ireland",
  phone: "+353 (01) 485 9210",
  email: "orders@amberspice.ie",
  openingHours: "Mon – Thu: 17:00 – 22:00, Fri – Sat: 16:30 – 22:30 (Sun: Closed)",
  isOpenNow: true,
  rating: 4.9,
  reviewsCount: 1680,
  currency: "€",
  freeDeliveryThreshold: 30.0,
  baseDeliveryFee: 2.50,
  collectionPrepMinutes: 15,
  deliveryPrepMinutes: 30,
};

export const DELIVERY_ZONES = [
  { key: "D02", name: "Dublin 2 (South William / Grafton St)", fee: 2.00, minOrder: 15.00 },
  { key: "D01", name: "Dublin 1 (O'Connell St / City Center)", fee: 2.50, minOrder: 18.00 },
  { key: "D04", name: "Dublin 4 (Ballsbridge / Grand Canal)", fee: 3.00, minOrder: 20.00 },
  { key: "D06", name: "Dublin 6 (Ranelagh / Rathmines)", fee: 3.00, minOrder: 20.00 },
  { key: "D08", name: "Dublin 8 (Portobello / Liberties)", fee: 2.50, minOrder: 18.00 },
];

export const CATEGORIES = [
  { id: 'biryani', name: 'Biryani', count: '12+ Dishes', image: '/images/amber_hero_dish.jpg' },
  { id: 'curries', name: 'Curries', count: '15+ Dishes', image: '/images/curry_dish.jpg' },
  { id: 'grill', name: 'Grill', count: '8+ Dishes', image: '/images/grill_dish.jpg' },
  { id: 'vegetarian', name: 'Vegetarian', count: '10+ Dishes', image: '/images/curry_dish.jpg' },
  { id: 'breads', name: 'Rice & Bread', count: '7+ Dishes', image: '/images/curry_dish.jpg' },
  { id: 'desserts', name: 'Desserts', count: '5+ Dishes', image: '/images/amber_hero_dish.jpg' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "dish-biryani-01",
    name: "Royal Chicken Dum Biryani",
    category: "biryani",
    categoryLabel: "Biryani",
    description: "Saffron-infused aged basmati rice layered with spiced tender chicken, caramelized onions, fresh mint & whole spices cooked slowly in a sealed handi.",
    price: 13.99,
    image: "/images/amber_hero_dish.jpg",
    rating: 4.95,
    reviewCount: 420,
    prepTime: "15-20 min",
    calories: 720,
    allergens: ["Dairy"],
    dietary: ["halal"],
    isBestSeller: true,
    isAvailable: true,
    suggestedPairingIds: ["dish-bread-01", "dish-dessert-01"],
    modifierGroups: [
      {
        id: "portion",
        name: "Portion Size",
        required: true,
        maxSelect: 1,
        options: [
          { id: "reg", name: "Standard Handi Portion (1 Person)", price: 0 },
          { id: "large", name: "Large Handi Feast (with extra drumstick)", price: 3.50 },
        ],
      },
      {
        id: "spice",
        name: "Spice Level",
        required: true,
        maxSelect: 1,
        options: [
          { id: "mild", name: "Mild Aromatic", price: 0 },
          { id: "medium", name: "Authentic Dum Spice", price: 0 },
          { id: "hot", name: "Extra Spiced Handi", price: 0 },
        ],
      },
      {
        id: "sides",
        name: "Food Extensions & Accompaniments",
        required: false,
        maxSelect: 3,
        options: [
          { id: "raita", name: "Pomegranate Mint Raita", price: 1.50 },
          { id: "salan", name: "Spiced Mirchi Salan Gravy", price: 2.00 },
          { id: "egg", name: "Boiled Spiced Egg Topping", price: 1.20 },
        ],
      },
    ],
  },
  {
    id: "dish-curry-01",
    name: "Old Delhi Butter Chicken",
    category: "curries",
    categoryLabel: "Curries",
    description: "Tender tandoori chicken simmered gently in a velvety satin tomato, cashew nut butter gravy infused with fragrant dried fenugreek leaves.",
    price: 12.99,
    image: "/images/curry_dish.jpg",
    rating: 4.88,
    reviewCount: 380,
    prepTime: "15 min",
    calories: 680,
    allergens: ["Dairy", "Nuts"],
    dietary: ["halal"],
    isBestSeller: true,
    isAvailable: true,
    suggestedPairingIds: ["dish-bread-01", "dish-biryani-01"],
    modifierGroups: [
      {
        id: "portion",
        name: "Portion Size",
        required: true,
        maxSelect: 1,
        options: [
          { id: "reg", name: "Standard Bowl (1 Person)", price: 0 },
          { id: "sharing", name: "Family Sharing Bowl (+40% Chicken)", price: 4.00 },
        ],
      },
      {
        id: "spice",
        name: "Spice Level",
        required: true,
        maxSelect: 1,
        options: [
          { id: "mild", name: "Mild & Creamy (Classic)", price: 0 },
          { id: "med", name: "Medium Spiced", price: 0 },
          { id: "hot", name: "Spicy Delhi Kick", price: 0 },
        ],
      },
      {
        id: "addons",
        name: "Curry Add-ons",
        required: false,
        maxSelect: 2,
        options: [
          { id: "cream", name: "Extra Fresh Cream & Butter Swirl", price: 1.00 },
          { id: "extra_chicken", name: "Extra Tandoori Chicken Chunks", price: 3.00 },
        ],
      },
    ],
  },
  {
    id: "dish-curry-02",
    name: "Kashmiri Lamb Rogan Josh",
    category: "curries",
    categoryLabel: "Curries",
    description: "Slow-braised Irish spring lamb shoulder cooked in authentic Kashmiri deghi mirch chili, bruised black cardamom, and aromatic ratanjot oil.",
    price: 14.99,
    image: "/images/curry_dish.jpg",
    rating: 4.92,
    reviewCount: 215,
    prepTime: "20 min",
    calories: 740,
    allergens: ["Dairy"],
    dietary: ["halal", "gluten-free"],
    isBestSeller: false,
    isAvailable: true,
    suggestedPairingIds: ["dish-bread-01", "dish-dessert-01"],
    modifierGroups: [
      {
        id: "spice",
        name: "Spice Level",
        required: true,
        maxSelect: 1,
        options: [
          { id: "medium", name: "Medium Kashmiri Spiced", price: 0 },
          { id: "fiery", name: "Royal Fiery Rogan Hot", price: 0 },
        ],
      },
      {
        id: "sides",
        name: "Add-ons & Extras",
        required: false,
        maxSelect: 2,
        options: [
          { id: "onion_salad", name: "Kashmiri Spiced Onion Salad", price: 1.20 },
          { id: "extra_gravy", name: "Extra Aromatic Rogan Gravy Cup", price: 2.00 },
        ],
      },
    ],
  },
  {
    id: "dish-grill-01",
    name: "Flame-Grilled Tandoori Chicken",
    category: "grill",
    categoryLabel: "Grill",
    description: "Succulent chicken skewers steeped overnight in hung curd, garlic-ginger paste, smoked paprika & mustard oil, roasted over live tandoor charcoal.",
    price: 13.50,
    image: "/images/grill_dish.jpg",
    rating: 4.9,
    reviewCount: 198,
    prepTime: "15-20 min",
    calories: 590,
    allergens: ["Dairy"],
    dietary: ["halal", "gluten-free"],
    isBestSeller: true,
    isAvailable: true,
    suggestedPairingIds: ["dish-bread-01", "dish-dessert-01"],
    modifierGroups: [
      {
        id: "portion",
        name: "Portion Selection",
        required: true,
        maxSelect: 1,
        options: [
          { id: "half", name: "Half Chicken (4 Pieces)", price: 0 },
          { id: "full", name: "Full Chicken Feast (8 Pieces)", price: 5.50 },
        ],
      },
      {
        id: "addons",
        name: "Grill Dips & Extras",
        required: false,
        maxSelect: 2,
        options: [
          { id: "mint_dip", name: "Extra Mint Yogurt & Pickled Onions", price: 1.50 },
          { id: "garlic_butter", name: "Smoked Garlic Butter Glaze", price: 1.00 },
        ],
      },
    ],
  },
  {
    id: "dish-veg-01",
    name: "Paneer Butter Masala",
    category: "vegetarian",
    categoryLabel: "Vegetarian",
    description: "Fresh cottage cheese cubes cooked in a creamy spiced onion-tomato makhani sauce with aromatic ginger matchsticks and sweet butter.",
    price: 11.99,
    image: "/images/curry_dish.jpg",
    rating: 4.82,
    reviewCount: 165,
    prepTime: "12-15 min",
    calories: 610,
    allergens: ["Dairy", "Nuts"],
    dietary: ["vegetarian", "halal"],
    isBestSeller: false,
    isAvailable: true,
    suggestedPairingIds: ["dish-bread-01", "dish-dessert-01"],
    modifierGroups: [
      {
        id: "spice",
        name: "Spice Level",
        required: true,
        maxSelect: 1,
        options: [
          { id: "mild", name: "Mild & Velvety", price: 0 },
          { id: "medium", name: "Medium Spiced", price: 0 },
        ],
      },
      {
        id: "addons",
        name: "Vegetarian Add-ons",
        required: false,
        maxSelect: 2,
        options: [
          { id: "extra_paneer", name: "Extra Fresh Paneer Cubes", price: 2.50 },
          { id: "butter_dip", name: "Clarified Ghee Butter Drizzle", price: 1.00 },
        ],
      },
    ],
  },
  {
    id: "dish-combo-01",
    name: "Grand Royal Feast Platter",
    category: "combos",
    categoryLabel: "Family Combo",
    description: "Generous assortment of flame-grilled seekh kebabs, chicken tikkas, freshly baked garlic naans, spiced mint chutney, and signature dips.",
    price: 18.50,
    image: "/images/hero_dish.jpg",
    rating: 4.95,
    reviewCount: 310,
    prepTime: "15-20 min",
    calories: 820,
    allergens: ["Gluten", "Dairy"],
    dietary: ["halal"],
    isBestSeller: true,
    isAvailable: true,
    suggestedPairingIds: ["dish-dessert-01"],
    modifierGroups: [
      {
        id: "size",
        name: "Platter Size",
        required: true,
        maxSelect: 1,
        options: [
          { id: "regular", name: "Standard Platter (Serves 2-3)", price: 0 },
          { id: "mega", name: "Grand Platter (+ Extra Seekh Kebabs, Serves 4-5)", price: 8.50 },
        ],
      },
      {
        id: "addons",
        name: "Platter Add-ons",
        required: false,
        maxSelect: 2,
        options: [
          { id: "extra_naan", name: "Extra Garlic Butter Naan", price: 2.50 },
          { id: "extra_dip", name: "Trio of Signature Chutneys", price: 2.00 },
        ],
      },
    ],
  },
  {
    id: "dish-bread-01",
    name: "Tandoori Garlic Butter Naan Basket",
    category: "breads",
    categoryLabel: "Rice & Bread",
    description: "Trio of clay-oven blistered naans brushed with organic clarified ghee, roasted crushed garlic, and fresh chopped coriander leaves.",
    price: 6.50,
    image: "/images/curry_dish.jpg",
    rating: 4.89,
    reviewCount: 220,
    prepTime: "8-10 min",
    calories: 340,
    allergens: ["Gluten", "Dairy"],
    dietary: ["vegetarian", "halal"],
    isBestSeller: false,
    isAvailable: true,
    suggestedPairingIds: ["dish-curry-01", "dish-biryani-01"],
    modifierGroups: [
      {
        id: "variety",
        name: "Naan Style",
        required: true,
        maxSelect: 1,
        options: [
          { id: "garlic", name: "Roasted Garlic & Ghee (3 Naans)", price: 0 },
          { id: "cheese", name: "Melted Cheddar Stuffed Naan (+2 Naans)", price: 2.50 },
          { id: "peshwari", name: "Peshwari Sweet Coconut & Almond Naan", price: 2.00 },
        ],
      },
    ],
  },
  {
    id: "dish-dessert-01",
    name: "Royal Saffron & Cardamom Gulab Jamun",
    category: "desserts",
    categoryLabel: "Desserts",
    description: "Golden fried khoya milk dumplings gently soaked in rosewater and saffron sugar syrup, topped with slivered Iranian pistachios.",
    price: 5.99,
    image: "/images/amber_hero_dish.jpg",
    rating: 4.92,
    reviewCount: 145,
    prepTime: "5 min",
    calories: 280,
    allergens: ["Dairy", "Nuts"],
    dietary: ["vegetarian", "halal"],
    isBestSeller: true,
    isAvailable: true,
    suggestedPairingIds: ["dish-biryani-01"],
    modifierGroups: [
      {
        id: "portions",
        name: "Portion Size",
        required: true,
        maxSelect: 1,
        options: [
          { id: "p2", name: "Classic (2 Dumplings)", price: 0 },
          { id: "p4", name: "Royal Feast (4 Dumplings)", price: 3.00 },
        ],
      },
      {
        id: "icecream",
        name: "Dessert Add-ons",
        required: false,
        maxSelect: 1,
        options: [
          { id: "vanilla", name: "Artisan Madagascan Vanilla Ice Cream Scoop", price: 2.00 },
          { id: "pistachio", name: "Extra Roasted Iranian Pistachio Dust", price: 1.00 },
        ],
      },
    ],
  },
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-4047",
    orderNumber: "ZM-4047",
    customerName: "Mark Jecno",
    customerPhone: "+353 87 123 4567",
    customerEmail: "mark.jecno@example.com",
    fulfillmentType: "delivery",
    deliveryAddress: "14 Grafton Street, Dublin 2",
    eircode: "D02 P682",
    items: [
      {
        cartItemId: "c-4047",
        dish: MENU_ITEMS[2],
        quantity: 1,
        selectedModifiers: [],
        specialInstructions: "Medium spice, gravy on side",
        totalPrice: 14.99,
      },
    ],
    subtotal: 14.99,
    deliveryFee: 2.00,
    discount: 0,
    total: 16.99,
    status: "new",
    createdAt: new Date().toISOString(),
    estimatedMinutes: 35,
    specialNotes: "Ring Apt 3 buzzer, leave at reception",
    paymentMethod: "apple_pay",
  },
  {
    id: "ord-2041",
    orderNumber: "AS-2041",
    customerName: "Sarah Ahmed",
    customerPhone: "+353 87 234 5678",
    customerEmail: "sarah.ahmed@gmail.com",
    fulfillmentType: "delivery",
    deliveryAddress: "42 Baggot St Lower, Dublin 2",
    eircode: "D02 P682",
    items: [
      {
        cartItemId: "c1",
        dish: MENU_ITEMS[0],
        quantity: 2,
        selectedModifiers: [
          { groupName: "Portion Size", optionName: "Standard Handi Portion (1 Person)", price: 0 },
        ],
        specialInstructions: "Please include extra mint raita!",
        totalPrice: 27.98,
      },
      {
        cartItemId: "c2",
        dish: MENU_ITEMS[1],
        quantity: 1,
        selectedModifiers: [],
        totalPrice: 12.99,
      },
    ],
    subtotal: 40.97,
    deliveryFee: 0,
    discount: 4.10,
    total: 36.87,
    status: "preparing",
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedMinutes: 25,
    specialNotes: "Ring Apartment 4B buzzer.",
    paymentMethod: "apple_pay",
  },
  {
    id: "ord-2042",
    orderNumber: "AS-2042",
    customerName: "James Miller",
    customerPhone: "+353 85 987 6543",
    customerEmail: "james.m@outlook.com",
    fulfillmentType: "collection",
    items: [
      {
        cartItemId: "c3",
        dish: MENU_ITEMS[3],
        quantity: 1,
        selectedModifiers: [],
        totalPrice: 13.50,
      },
    ],
    subtotal: 13.50,
    deliveryFee: 0,
    discount: 0,
    total: 13.50,
    status: "new",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    estimatedMinutes: 15,
    paymentMethod: "card",
  },
];

export const MOCK_USER = {
  name: "Sarah Ahmed",
  email: "sarah.ahmed@dublin.ie",
  phone: "+353 87 555 1234",
  addresses: [
    { id: "addr-1", label: "Home", address: "14 South William St, Apt 2", eircode: "D02 AF30", isDefault: true },
    { id: "addr-2", label: "Office", address: "Grand Canal Quay, Silicon Docks", eircode: "D04 T8K2", isDefault: false },
  ],
};
