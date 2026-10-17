export interface RegisteredCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteDish: string;
  status: 'vip' | 'active' | 'new' | 'banned';
  deliveryAddress: string;
  eircode: string;
  isBanned?: boolean;
  bannedAt?: string;
  banReason?: string;
  previousStatus?: 'vip' | 'active' | 'new';
}

const CUSTOMERS_STORAGE_KEY = 'amber_spice_customers';

export const INITIAL_CUSTOMERS: RegisteredCustomer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@dublin.ie',
    phone: '+353 87 555 1234',
    avatarUrl: '/images/avatars/sarah.jpg',
    registeredAt: '2026-10-02T11:20:00Z',
    totalOrders: 6,
    totalSpent: 184.50,
    lastOrderDate: '2026-10-16T14:30:00Z',
    favoriteDish: 'Old Delhi Butter Chicken',
    status: 'vip',
    deliveryAddress: '42 Baggot St Lower, Dublin 2',
    eircode: 'D02 P682',
  },
  {
    id: 'cust-2',
    name: 'Mark Jecno',
    email: 'mark.jecno@gmail.com',
    phone: '+353 87 123 4567',
    avatarUrl: '/images/avatars/cian.jpg',
    registeredAt: '2026-10-06T15:45:00Z',
    totalOrders: 3,
    totalSpent: 64.80,
    lastOrderDate: '2026-10-16T17:15:00Z',
    favoriteDish: 'Kashmiri Lamb Rogan Josh',
    status: 'active',
    deliveryAddress: '12 Fitzwilliam Square, Dublin 2',
    eircode: 'D02 X381',
  },
  {
    id: 'cust-3',
    name: 'Aoife Kelly',
    email: 'aoife.kelly@tcd.ie',
    phone: '+353 83 456 7890',
    avatarUrl: '/images/avatars/elena.jpg',
    registeredAt: '2026-10-08T09:10:00Z',
    totalOrders: 5,
    totalSpent: 132.00,
    lastOrderDate: '2026-10-15T19:00:00Z',
    favoriteDish: 'Royal Chicken Dum Biryani',
    status: 'vip',
    deliveryAddress: '18 Ranelagh Road, Dublin 6',
    eircode: 'D06 Y102',
  },
  {
    id: 'cust-4',
    name: 'James Miller',
    email: 'james.m@outlook.com',
    phone: '+353 85 987 6543',
    avatarUrl: '/images/avatars/james.jpg',
    registeredAt: '2026-10-10T18:30:00Z',
    totalOrders: 2,
    totalSpent: 38.50,
    lastOrderDate: '2026-10-16T16:20:00Z',
    favoriteDish: 'Flame-Grilled Tandoori Chicken',
    status: 'active',
    deliveryAddress: '9 Ballsbridge Terrace, Dublin 4',
    eircode: 'D04 K291',
  },
  {
    id: 'cust-5',
    name: 'Dr. Declan Byrne',
    email: 'declan.byrne@stjames.ie',
    phone: '+353 87 888 9900',
    avatarUrl: '/images/avatars/cian.jpg',
    registeredAt: '2026-10-12T12:00:00Z',
    totalOrders: 4,
    totalSpent: 96.50,
    lastOrderDate: '2026-10-14T20:10:00Z',
    favoriteDish: 'Old Delhi Butter Chicken',
    status: 'active',
    deliveryAddress: '24 South Circular Road, Dublin 8',
    eircode: 'D08 H520',
  },
  {
    id: 'cust-6',
    name: 'Conor Murphy',
    email: 'conor.murphy@eircom.net',
    phone: '+353 86 333 4455',
    avatarUrl: '/images/avatars/ayesha.jpg',
    registeredAt: '2026-10-15T14:05:00Z',
    totalOrders: 1,
    totalSpent: 28.99,
    lastOrderDate: '2026-10-15T14:05:00Z',
    favoriteDish: 'Royal Chicken Dum Biryani',
    status: 'new',
    deliveryAddress: '31 Portobello Harbour, Dublin 8',
    eircode: 'D08 R281',
  },
];

export function getCustomersList(): RegisteredCustomer[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    const parsed: RegisteredCustomer[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure avatars are backfilled
      return parsed.map((c) => {
        if (!c.avatarUrl) {
          const match = INITIAL_CUSTOMERS.find((i) => i.id === c.id || i.email.toLowerCase() === c.email.toLowerCase());
          return { ...c, avatarUrl: match?.avatarUrl || '/images/avatars/sarah.jpg' };
        }
        return c;
      });
    }
  } catch {
    // fallback
  }
  return INITIAL_CUSTOMERS;
}

export function saveCustomersList(customers: RegisteredCustomer[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    window.dispatchEvent(new Event('amber_spice_customers_updated'));
  } catch (err) {
    console.error('Failed to save customers list:', err);
  }
}

export function addCustomer(data: Omit<RegisteredCustomer, 'id'>): RegisteredCustomer {
  const current = getCustomersList();
  const newCustomer: RegisteredCustomer = {
    ...data,
    id: `cust-${Date.now()}`,
  };
  const updated = [newCustomer, ...current];
  saveCustomersList(updated);
  return newCustomer;
}

export function deleteCustomer(id: string): void {
  const current = getCustomersList();
  const updated = current.filter((c) => c.id !== id);
  saveCustomersList(updated);
}

export function banCustomer(id: string, reason?: string): RegisteredCustomer | null {
  const current = getCustomersList();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const target = current[index];
  const updatedCustomer: RegisteredCustomer = {
    ...target,
    isBanned: true,
    previousStatus: (target.status !== 'banned' ? target.status : target.previousStatus) || 'active',
    status: 'banned',
    bannedAt: new Date().toISOString(),
    banReason: reason || 'Violation of restaurant terms',
  };

  current[index] = updatedCustomer;
  saveCustomersList(current);
  return updatedCustomer;
}

export function unbanCustomer(id: string): RegisteredCustomer | null {
  const current = getCustomersList();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const target = current[index];
  const restoredStatus = target.previousStatus || (target.totalOrders >= 5 ? 'vip' : 'active');
  const updatedCustomer: RegisteredCustomer = {
    ...target,
    isBanned: false,
    status: restoredStatus,
    bannedAt: undefined,
    banReason: undefined,
  };

  current[index] = updatedCustomer;
  saveCustomersList(current);
  return updatedCustomer;
}

export function getCustomerById(id: string): RegisteredCustomer | undefined {
  const customers = getCustomersList();
  return customers.find((c) => c.id === id);
}

