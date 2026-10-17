import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  Clock,
  Maximize,
  Minimize,
  Plus,
  ShieldCheck,
  Bell,
  User,
  ShoppingBag,
  AlertTriangle,
  Flame,
  Info,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSound, toggleRushMode } from '../../store/slices/orderSlice';
import { setActiveRole } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, AppNotification } from '../../types/common.types';
import { Button } from '../ui/Button';
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from '../../services/notificationService';

export interface TopbarProps {
  onFireManualTicket?: () => void;
}

export function Topbar({ onFireManualTicket }: TopbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { soundEnabled, rushMode, rushMinutes } = useAppSelector((state) => state.orders);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Notification popover state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Sync notifications
  useEffect(() => {
    const handleSync = () => {
      setNotifications(getNotifications());
    };
    window.addEventListener('amber_spice_notifications_updated', handleSync);
    return () => window.removeEventListener('amber_spice_notifications_updated', handleSync);
  }, []);

  // Click outside to close notification popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-3.5 h-3.5 text-[#F15A24]" />;
      case 'stock':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'kitchen':
        return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'system':
      default:
        return <Info className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  const initials = (user?.name || 'Admin')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-stone-200/90 px-6 sm:px-8 lg:px-10 flex items-center justify-between shrink-0">
      {/* Left: Shift Clock & Active Role Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
          <span>Shift:</span>
          <span className="font-semibold text-stone-900">{currentTime}</span>
        </div>
        <span className="text-stone-300 hidden sm:inline">|</span>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F15A24] ml-1 hidden sm:inline" />
          <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">Role:</span>
          <select
            value={user?.role || 'admin'}
            onChange={(e) => dispatch(setActiveRole(e.target.value as UserRole))}
            className="h-7 px-2 rounded-lg text-xs font-semibold bg-white border border-stone-200/90 text-stone-800 outline-none cursor-pointer hover:border-[#F15A24] transition-colors shadow-2xs"
            title="Switch Active Persona / Role"
          >
            <option value="admin">Admin (Manager)</option>
            <option value="chef">Head Chef (Kitchen)</option>
            <option value="expo">Expo (Dispatch)</option>
            <option value="staff">Station Cook</option>
          </select>
        </div>
      </div>

      {/* Right Controls: Notifications, Profile, Sound, Rush, Fullscreen, New Ticket */}
      <div className="flex items-center gap-2">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer relative ${
              isNotifOpen
                ? 'bg-stone-100 border-[#F15A24] text-stone-900'
                : 'border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#F15A24] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-stone-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-stone-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-[#F15A24]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      markAllAsRead();
                      setNotifications(getNotifications());
                    }}
                    className="text-[11px] font-semibold text-[#F15A24] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No new notifications.
                  </div>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        setNotifications(getNotifications());
                        if (n.link) {
                          setIsNotifOpen(false);
                          navigate(n.link);
                        }
                      }}
                      className={`p-3 text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                        n.isRead ? 'bg-white hover:bg-stone-50' : 'bg-orange-50/40 hover:bg-orange-50/70'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-stone-900 truncate">{n.title}</p>
                          <span className="text-[10px] text-stone-400 shrink-0">{n.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-snug">
                          {n.message}
                        </p>
                      </div>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F15A24] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-stone-100 bg-stone-50/50 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="block py-1 text-xs font-semibold text-stone-700 hover:text-[#F15A24] transition-colors"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Link */}
        <Link
          to="/profile"
          className="h-8 pl-1.5 pr-2.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Admin Profile & Password"
        >
          <img
            src={user?.avatarUrl || '/images/chef_master.jpg'}
            alt="Profile"
            className="w-5 h-5 rounded-md object-cover shadow-2xs border border-stone-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/chef_master.jpg';
            }}
          />
          <span className="text-xs font-semibold text-stone-800 hidden md:inline">
            {user?.name?.split(' ')[0] || 'Admin'}
          </span>
        </Link>

        {/* Sound Toggle */}
        <button
          onClick={() => dispatch(toggleSound())}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-white border-stone-200 text-stone-800 hover:border-[#F15A24]'
              : 'bg-stone-100 border-transparent text-stone-400'
          }`}
          title="Toggle Chime Sound"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#F15A24]" />
              <span className="hidden sm:inline">Sound</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mute</span>
            </>
          )}
        </button>

        {/* Rush Mode (+20m delay) */}
        <button
          onClick={() => dispatch(toggleRushMode())}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
            rushMode
              ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
              : 'bg-white border-stone-200 text-stone-800 hover:border-[#F15A24]'
          }`}
          title="Toggle Rush Hour (+20m prep delay)"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{rushMode ? `Rush (+${rushMinutes}m)` : 'Rush Mode'}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>

        {/* New Ticket Button */}
        {onFireManualTicket && (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onFireManualTicket}
          >
            <span>New Ticket</span>
          </Button>
        )}
      </div>
    </header>
  );
}

