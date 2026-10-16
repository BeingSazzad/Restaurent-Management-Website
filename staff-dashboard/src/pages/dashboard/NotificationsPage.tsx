import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShoppingBag,
  AlertTriangle,
  Flame,
  Info,
  ExternalLink,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearReadNotifications,
} from '../../services/notificationService';
import { AppNotification } from '../../types/common.types';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'order' | 'stock' | 'system'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const handleSync = () => {
      setNotifications(getNotifications());
    };
    window.addEventListener('amber_spice_notifications_updated', handleSync);
    return () => window.removeEventListener('amber_spice_notifications_updated', handleSync);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'unread') return !n.isRead;
      if (activeTab === 'order') return n.type === 'order';
      if (activeTab === 'stock') return n.type === 'stock' || n.type === 'kitchen';
      if (activeTab === 'system') return n.type === 'system';
      return true;
    });
  }, [notifications, activeTab]);

  const handleMarkAllRead = () => {
    const updated = markAllAsRead();
    setNotifications(updated);
    showToast('✓ All notifications marked as read');
  };

  const handleClearRead = () => {
    const updated = clearReadNotifications();
    setNotifications(updated);
    showToast('✓ Cleared read notifications');
  };

  const handleToggleRead = (id: string) => {
    const updated = markAsRead(id);
    setNotifications(updated);
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#F15A24]" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'kitchen':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Kitchen alerts, new customer orders, and inventory warnings."
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
              >
                <span>Mark All Read</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearRead}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              <span>Clear Read</span>
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 overflow-x-auto w-full sm:w-fit">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'order', label: 'Orders' },
          { id: 'stock', label: 'Kitchen & Stock' },
          { id: 'system', label: 'System' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1A130E]">No notifications</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You are all caught up! New orders and inventory alerts will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                n.isRead
                  ? 'bg-white border-stone-200/80 hover:border-stone-300'
                  : 'bg-white border-orange-200/80 shadow-2xs ring-1 ring-orange-500/10'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'order'
                      ? 'bg-orange-50 border border-orange-200/70'
                      : n.type === 'stock'
                      ? 'bg-amber-50 border border-amber-200/70'
                      : n.type === 'kitchen'
                      ? 'bg-rose-50 border border-rose-200/70'
                      : 'bg-stone-100 border border-stone-200/70'
                  }`}
                >
                  {getNotificationIcon(n.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#1A130E]">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#F15A24] shrink-0" title="Unread" />
                    )}
                    <span className="text-[11px] text-stone-400">· {n.createdAt}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={() => markAsRead(n.id)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 text-stone-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleRead(n.id)}
                  title={n.isRead ? 'Mark as unread' : 'Mark as read'}
                  className={`h-8 px-2.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    n.isRead
                      ? 'bg-white border-stone-200 text-stone-500 hover:text-stone-900'
                      : 'bg-orange-50 border-orange-200 text-[#F15A24] hover:bg-orange-100'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{n.isRead ? 'Read' : 'Mark Read'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#140F0C] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold border border-stone-800 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
