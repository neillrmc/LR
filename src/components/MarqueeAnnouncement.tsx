import { X, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Announcement } from '../types';

interface MarqueeAnnouncementProps {
  announcements: Announcement[];
  speed?: 'slow' | 'normal' | 'fast';
}

export const MarqueeAnnouncement = ({ 
  announcements, 
  speed = 'normal' 
}: MarqueeAnnouncementProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Filter only active announcements
  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (!isVisible || activeAnnouncements.length === 0) return null;

  // Combine all announcement messages with separator
  const combinedMessage = activeAnnouncements
    .map(a => a.message)
    .join('   ✦   ');

  // Speed configurations
  const speedConfig = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast',
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 overflow-hidden">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-indigo-600 to-transparent z-10 pointer-events-none" />
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-600 to-transparent z-10 pointer-events-none" />

      {/* Megaphone icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
        <Megaphone className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Announcement</span>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
        title="Dismiss"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Marquee container */}
      <div className="py-3 pl-48 pr-16">
        <div className={`whitespace-nowrap ${speedConfig[speed]}`}>
          <span className="inline-block text-white font-medium text-sm tracking-wide">
            {combinedMessage}
            <span className="mx-8">✦</span>
            {combinedMessage}
            <span className="mx-8">✦</span>
            {combinedMessage}
          </span>
        </div>
      </div>
    </div>
  );
};