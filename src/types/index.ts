export type MaterialStatus = 'pending' | 'ongoing' | 'completed';
export type MaterialType = 'pdf' | 'image' | 'ppt' | 'game' | 'website' | 'video' | 'others';
export type UserRole = 'admin' | 'developer' | 'viewer';
export type QAResult = 'passed' | 'failed' | 'needs-revision';
export type NotificationType = 'new-material' | 'revised-material' | 'qa-completed' | 'overdue';

export interface Material {
  id: string;
  materialId: string;
  title: string;
  description: string;
  category: string;
  type: MaterialType;
  status: MaterialStatus;
  fileUrl?: string;
  fileName?: string;
  linkUrl?: string;
  developerName: string;
  developerEmail: string;
  contactNumber?: string;
  school?: string;
  district?: string;
  uploadedAt: Date | string;
  lastUpdated?: Date | string;
  qaRemark?: QARemark;
  pendingReview?: boolean;
  reuploadedAt?: Date | string;
  reuploadedFileName?: string;
  reuploadedFileUrl?: string;
  reuploadedLinkUrl?: string;
}

export interface QARemark {
  result: QAResult;
  comments?: string;
  reviewedAt: Date | string;
  reviewedBy: string;
}

export interface QAGuideline {
  id: string;
  title: string;
  version: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: Date | string;
  uploadedBy: string;
  isActive: boolean;
}

export interface AppSettings {
  autoApproveEnabled: boolean;
  maxRevisionAttempts: number;
  allowedFileTypes: string[];
  emailNotifications: boolean;
  requireComments: boolean;
  guidelines: QAGuideline[];
}

export interface Stats {
  completed: number;
  ongoing: number;
  pending: number;
  total: number;
}

export interface User {
  name: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date | string;
  read: boolean;
  materialId?: string;
}