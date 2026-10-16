import { AppNotification } from '../types/common.types';

const STORAGE_KEY = 'amber_spice_staff_notifications';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Online Order #1048',
    message: 'Delivery order placed: 2x Royal Dum Biryani, 1x Rogan Josh (€42.50). Kitchen pass notified.',
    type: 'order',
    severity: 'urgent',
    createdAt: 'Just now',
    isRead: false,
    link: '/all-orders',
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Dum Lamb Shoulder',
    message: 'Raw inventory dropped to 2.5 kg (below par level of 5.0 kg). Prepare replenishment.',
    type: 'stock',
    severity: 'warning',
    createdAt: '12m ago',
    isRead: false,
    link: '/stock-86',
  },
  {
    id: 'notif-3',
    title: 'Kitchen Ticket #1044 Ready for Dispatch',
    message: 'Biryani station marked order #1044 complete. Driver Dave assigned for delivery.',
    type: 'kitchen',
    severity: 'info',
    createdAt: '28m ago',
    isRead: false,
    link: '/',
  },
  {
    id: 'notif-4',
    title: 'Rush Hour Buffer Active',
    message: 'Peak dinner prep buffer adjusted (+20 min) across online Dublin checkout.',
    type: 'system',
    severity: 'info',
    createdAt: '1h ago',
    isRead: true,
  },
  {
    id: 'notif-5',
    title: 'CMS Schedule Sync Completed',
    message: 'Weekly operating hours and contact hotline published to customer website.',
    type: 'system',
    severity: 'info',
    createdAt: '2h ago',
    isRead: true,
    link: '/cms',
  },
];

export function getNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('amber_spice_notifications_updated'));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export function markAsRead(id: string): AppNotification[] {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  saveNotifications(updated);
  return updated;
}

export function markAllAsRead(): AppNotification[] {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, isRead: true }));
  saveNotifications(updated);
  return updated;
}

export function clearReadNotifications(): AppNotification[] {
  const current = getNotifications();
  const updated = current.filter((n) => !n.isRead);
  saveNotifications(updated);
  return updated;
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.isRead).length;
}
