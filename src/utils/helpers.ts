import { Material, Stats, Notification, NotificationType, AppSettings } from '../types';
import { OVERDUE_THRESHOLD_DAYS, DEFAULT_SETTINGS } from './constants';

// ============================================
// ID Generation System
// ============================================

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const generateMaterialId = (existingMaterials: Material[] = []): string => {
  const currentYear = new Date().getFullYear();
  const prefix = `ADN-${currentYear}`;
  
  let maxNumber = 0;
  existingMaterials.forEach(m => {
    if (m.materialId && m.materialId.startsWith(prefix)) {
      const parts = m.materialId.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  });
  
  const nextNumber = (maxNumber + 1).toString().padStart(5, '0');
  return `${prefix}-${nextNumber}`;
};

// ============================================
// Date Utilities
// ============================================

export const toDate = (date: Date | string): Date => {
  if (!date) return new Date();
  return typeof date === 'string' ? new Date(date) : date;
};

export const formatDate = (date: Date | string): string => {
  try {
    const d = toDate(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const formatTimeAgo = (timestamp: Date | string): string => {
  try {
    const now = new Date();
    const then = toDate(timestamp);
    if (isNaN(then.getTime())) return 'Unknown';
    
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  } catch {
    return 'Unknown';
  }
};

export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (uploadedAt: Date | string): boolean => {
  try {
    return getDaysDifference(uploadedAt, new Date()) > OVERDUE_THRESHOLD_DAYS;
  } catch {
    return false;
  }
};

// ============================================
// Statistics & Calculations
// ============================================

export const calculateStats = (materials: Material[]): Stats => {
  const completed = materials.filter(m => m.status === 'completed').length;
  const ongoing = materials.filter(m => m.status === 'ongoing').length;
  const pending = materials.filter(m => m.status === 'pending').length;
  
  return { completed, ongoing, pending, total: materials.length };
};

export const getOverdueMaterials = (materials: Material[]): Material[] => {
  return materials.filter(m => m.status !== 'completed' && isOverdue(m.uploadedAt));
};

// ============================================
// Notification System
// ============================================

export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  materialId?: string
): Notification => ({
  id: generateId(),
  type,
  title,
  message,
  timestamp: new Date(),
  read: false,
  materialId,
});

export const generateNotifications = (materials: Material[], isAdmin: boolean): Notification[] => {
  const notifications: Notification[] = [];
  
  materials.forEach(m => {
    if (m.status === 'pending' && !m.pendingReview) {
      notifications.push(createNotification(
        'new-material',
        'New Material Uploaded',
        `${m.title} by ${m.developerName} is waiting for review.`,
        m.id
      ));
    }
    
    if (m.pendingReview) {
      notifications.push(createNotification(
        'revised-material',
        'Material Revised',
        `${m.title} has been reuploaded and needs review.`,
        m.id
      ));
    }
    
    if (isAdmin && m.status !== 'completed' && isOverdue(m.uploadedAt)) {
      notifications.push(createNotification(
        'overdue',
        'Overdue Material',
        `${m.title} has been pending for more than ${OVERDUE_THRESHOLD_DAYS} days!`,
        m.id
      ));
    }
  });

  return notifications.sort((a, b) => {
    const timeA = toDate(a.timestamp).getTime();
    const timeB = toDate(b.timestamp).getTime();
    return timeB - timeA;
  });
};

// ============================================
// Local Storage Helpers
// ============================================

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      if (key === 'adnlrms_materials' && Array.isArray(parsed)) {
        return parsed.map((m: Material) => ({
          ...m,
          uploadedAt: new Date(m.uploadedAt),
          lastUpdated: m.lastUpdated ? new Date(m.lastUpdated) : undefined,
          reuploadedAt: m.reuploadedAt ? new Date(m.reuploadedAt) : undefined,
          qaRemark: m.qaRemark ? {
            ...m.qaRemark,
            reviewedAt: new Date(m.qaRemark.reviewedAt),
          } : undefined,
        })) as T;
      }
      return parsed;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// ============================================
// Settings Helpers
// ============================================

export const getSettings = (): AppSettings => {
  return storage.get<AppSettings>('adnlrms_settings', DEFAULT_SETTINGS);
};

export const saveSettings = (settings: AppSettings): void => {
  storage.set('adnlrms_settings', settings);
};