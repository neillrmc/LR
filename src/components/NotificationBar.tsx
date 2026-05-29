import { Material } from '../types';
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  X, 
  ChevronRight,
  Upload,
  FileCheck,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

interface NotificationBarProps {
  materials: Material[];
  onDismiss?: () => void;
}

interface Notification {
  id: string;
  type: 'pending' | 'review' | 'passed' | 'failed' | 'upload';
  title: string;
  message: string;
  time: Date;
  materialId?: string;
  read: boolean;
}

export const NotificationBar = ({ materials, onDismiss }: NotificationBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications from materials
  const generateNotifications = (): Notification[] => {
    const notifs: Notification[] = [];

    materials.forEach(material => {
      // Pending review notifications
      if (material.pendingReview) {
        notifs.push({
          id: `review-${material.id}`,
          type: 'review',
          title: 'Reupload Pending Review',
          message: `${material.developerName} reuploaded "${material.title}"`,
          time: material.reuploadedAt || new Date(),
          materialId: material.id,
          read: false,
        });
      }

      // New upload notifications (pending status)
      if (material.status === 'pending' && !material.pendingReview) {
        notifs.push({
          id: `pending-${material.id}`,
          type: 'pending',
          title: 'New Material Uploaded',
          message: `"${material.title}" from ${material.school} is awaiting QA`,
          time: material.uploadedAt,
          materialId: material.id,
          read: false,
        });
      }

      // QA result notifications
      if (material.qaRemark && material.status === 'completed') {
        notifs.push({
          id: `qa-${material.id}`,
          type: material.qaRemark.result === 'passed' ? 'passed' : 'failed',
          title: material.qaRemark.result === 'passed' ? 'Material Passed QA' : 'Material Failed QA',
          message: `"${material.title}" - ${material.qaRemark.comments || 'No comments'}`,
          time: material.qaRemark.reviewedAt,
          materialId: material.id,
          read: true,
        });
      }
    });

    // Sort by time (newest first)
    return notifs.sort((a, b) => b.time.getTime() - a.time.getTime());
  };

  const allNotifications = generateNotifications();
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'review':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'passed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'pending':
        return 'bg-amber-500 bg-opacity-10 border-amber-500 border-opacity-20';
      case 'review':
        return 'bg-blue-500 bg-opacity-10 border-blue-500 border-opacity-20';
      case 'passed':
        return 'bg-emerald-500 bg-opacity-10 border-emerald-500 border-opacity-20';
      case 'failed':
        return 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-20';
      default:
        return 'bg-slate-700 border-slate-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-xs text-slate-400">
                    {unreadCount} unread
                  </span>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-700 bg-slate-800">
              <div className="text-center p-2 rounded-lg bg-amber-500 bg-opacity-10">
                <p className="text-lg font-bold text-amber-400">
                  {materials.filter(m => m.status === 'pending' && !m.pendingReview).length}
                </p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-500 bg-opacity-10">
                <p className="text-lg font-bold text-blue-400">
                  {materials.filter(m => m.pendingReview).length}
                </p>
                <p className="text-xs text-slate-400">For Review</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-emerald-500 bg-opacity-10">
                <p className="text-lg font-bold text-emerald-400">
                  {materials.filter(m => m.status === 'completed').length}
                </p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No notifications</p>
                  <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {allNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 hover:bg-slate-700 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-slate-750' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getNotificationBg(notif.type)}`}>
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-white truncate">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTime(notif.time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {allNotifications.length > 0 && (
              <div className="p-3 border-t border-slate-700 bg-slate-900">
                <button className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
                  View All Activity
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};