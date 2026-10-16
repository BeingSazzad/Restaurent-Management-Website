export type UserRole = 'admin' | 'chef' | 'expo' | 'staff';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  shiftStation?: 'all' | 'biryani' | 'curries' | 'grill' | 'breads';
  isActive: boolean;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type FulfillmentType = 'delivery' | 'collection';
export type StationType = 'all' | 'biryani' | 'curries' | 'grill' | 'breads';

export interface DishItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  image: string;
  isAvailable: boolean;
  description?: string;
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
  paymentMethod: string;
}
