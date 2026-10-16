export type StaffRole = 'admin' | 'manager' | 'chef' | 'user';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  station?: 'all' | 'curries' | 'biryani' | 'grill' | 'breads' | 'dispatch';
  status: 'active' | 'on_shift' | 'suspended';
  invitedAt: string;
  lastActive?: string;
  notes?: string;
}

export const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Tariq Al-Hassan',
    email: 'admin@amberspice.ie',
    phone: '+353 (01) 485 9210',
    role: 'admin',
    station: 'all',
    status: 'active',
    invitedAt: '2024-01-10T10:00:00Z',
    lastActive: 'Just now',
    notes: 'Executive Chef & General Managing Partner',
  },
  {
    id: 'usr-2',
    name: 'Marcus Ryan',
    email: 'manager@amberspice.ie',
    phone: '+353 87 234 5678',
    role: 'manager',
    station: 'all',
    status: 'on_shift',
    invitedAt: '2024-03-15T12:00:00Z',
    lastActive: '5 mins ago',
    notes: 'Floor & Operations Shift Supervisor',
  },
  {
    id: 'usr-3',
    name: 'Kabir Hussain',
    email: 'chef@amberspice.ie',
    phone: '+353 89 456 7890',
    role: 'chef',
    station: 'curries',
    status: 'on_shift',
    invitedAt: '2024-04-01T14:00:00Z',
    lastActive: '2 mins ago',
    notes: 'Senior Curry & Dum Pukht Specialist',
  },
  {
    id: 'usr-4',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@dublin.ie',
    phone: '+353 87 555 1234',
    role: 'user',
    status: 'active',
    invitedAt: '2024-06-20T09:30:00Z',
    lastActive: 'Today',
    notes: 'Loyal Dine-in & Online Customer',
  },
];

const USERS_STORAGE_KEY = 'amber_spice_app_users';

export function getUsersList(): AppUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_USERS;
}

export function saveUsersList(users: AppUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('amber_spice_users_updated'));
  } catch (err) {
    console.error('Failed to save users list:', err);
  }
}

export function getUserByEmail(email: string): AppUser | null {
  const users = getUsersList();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function assignRoleByEmail(
  email: string,
  newRole: StaffRole,
  station: AppUser['station'] = 'all'
): AppUser {
  const users = getUsersList();
  const normalized = email.trim().toLowerCase();
  const index = users.findIndex((u) => u.email.toLowerCase() === normalized);

  let updatedUser: AppUser;
  if (index >= 0) {
    updatedUser = {
      ...users[index],
      role: newRole,
      station: newRole === 'user' ? undefined : (station || users[index].station || 'all'),
      lastActive: 'Role updated just now',
    };
    users[index] = updatedUser;
  } else {
    // Create new entry
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    updatedUser = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email: email.trim(),
      phone: '+353 (01) 000 0000',
      role: newRole,
      station: newRole === 'user' ? undefined : station,
      status: 'active',
      invitedAt: new Date().toISOString(),
      lastActive: 'Invited just now',
    };
    users.unshift(updatedUser);
  }

  saveUsersList(users);
  return updatedUser;
}

export function addStaffMember(
  data: Omit<AppUser, 'id' | 'invitedAt' | 'lastActive'>
): AppUser {
  const users = getUsersList();
  const normalized = data.email.trim().toLowerCase();
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === normalized);

  const newUser: AppUser = {
    ...data,
    id: `usr-${Date.now()}`,
    invitedAt: new Date().toISOString(),
    lastActive: 'Invited just now',
  };

  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...newUser };
  } else {
    users.unshift(newUser);
  }

  saveUsersList(users);
  return newUser;
}

export function deleteStaffUser(email: string): boolean {
  const users = getUsersList();
  const normalized = email.trim().toLowerCase();
  const filtered = users.filter((u) => u.email.toLowerCase() !== normalized);
  if (filtered.length !== users.length) {
    saveUsersList(filtered);
    return true;
  }
  return false;
}

export function registerCustomer(data: { name: string; email: string; phone: string }): AppUser {
  const users = getUsersList();
  const normalized = data.email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === normalized);

  if (existing) {
    return existing;
  }

  const newCustomer: AppUser = {
    id: `usr-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim() || '+353 87 555 1234',
    role: 'user', // Public signups are STRICTLY customer role
    status: 'active',
    invitedAt: new Date().toISOString(),
    lastActive: 'Registered just now',
    notes: 'Storefront Self-Registered Diner',
  };

  users.push(newCustomer);
  saveUsersList(users);
  return newCustomer;
}
