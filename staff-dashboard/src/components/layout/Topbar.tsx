import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, Maximize, Minimize, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSound, toggleRushMode } from '../../store/slices/orderSlice';
import { Button } from '../ui/Button';

export interface TopbarProps {
  onFireManualTicket?: () => void;
}

export function Topbar({ onFireManualTicket }: TopbarProps) {
  const dispatch = useAppDispatch();
  const { soundEnabled, rushMode, rushMinutes } = useAppSelector((state) => state.orders);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <header className="h-16 bg-white border-b border-stone-200/90 px-6 lg:px-8 flex items-center justify-between shrink-0">
      {/* Left: Shift Clock */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
          <span>Shift:</span>
          <span className="font-semibold text-stone-900">{currentTime}</span>
        </div>
        <span className="text-stone-300">|</span>
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Station: <strong className="text-stone-800">All</strong>
        </span>
      </div>

      {/* Right Controls: Sound, Rush Mode, Fullscreen, New Ticket */}
      <div className="flex items-center gap-2">
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
