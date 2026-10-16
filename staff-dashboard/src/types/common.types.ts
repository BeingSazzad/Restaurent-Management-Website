export type UserRole = 'admin' | 'chef' | 'expo' | 'staff';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  shiftStation?: 'all' | 'biryani' | 'curries' | 'grill' | 'breads';
  isActive: boolean;
  joinedAt?: string;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type FulfillmentType = 'delivery' | 'collection';
export type StationType = 'all' | 'biryani' | 'curries' | 'grill' | 'breads';

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  quantity: number; // in raw unit (e.g. 0.25 kg)
  unit: string;
}

export interface DishItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  image: string;
  isAvailable: boolean;
  description?: string;
  stockCount?: number;
  lowStockThreshold?: number;
  recipe?: RecipeIngredient[];
}

export interface OrderModifier {
  groupName: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  dish: DishItem;
  quantity: number;
  selectedModifiers: OrderModifier[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  eircode?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  specialNotes?: string;
  internalNotes?: string;
  driverName?: string;
  stockDeducted?: boolean;
  paymentMethod: string;
}

export interface RawIngredientItem {
  id: string;
  name: string;
  category: 'protein' | 'dairy' | 'grain' | 'spice_produce' | 'packaging' | 'beverage';
  categoryLabel: string;
  currentStock: number;
  parLevel: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
  status: 'healthy' | 'low_stock' | 'out_of_stock';
  expiryDate?: string;
}

export interface WastageRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'raw' | 'dish';
  quantity: number;
  unit: string;
  reason: 'expired' | 'burned' | 'damaged' | 'customer_return';
  costLost: number;
  timestamp: string;
  loggedBy: string;
  notes?: string;
}
