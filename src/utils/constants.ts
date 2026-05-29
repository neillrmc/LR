export const APP_NAME = 'ADNLRMS QAT';
export const OVERDUE_THRESHOLD_DAYS = 7;

export const STATUS_CONFIG = {
  pending: { color: 'amber', bgColor: 'bg-amber-500', textColor: 'text-amber-400' },
  ongoing: { color: 'blue', bgColor: 'bg-blue-500', textColor: 'text-blue-400' },
  completed: { color: 'emerald', bgColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
};

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'image', label: 'Image' },
  { value: 'ppt', label: 'PowerPoint' },
  { value: 'game', label: 'Interactive Game' },
  { value: 'website', label: 'Website' },
  { value: 'video', label: 'Video' },
  { value: 'others', label: 'Others' },
] as const;

export const CATEGORIES = [
  'Mathematics',
  'Science',
  'English',
  'Filipino',
  'Araling Panlipunan',
  'MAPEH',
  'Edukasyon sa Pagpapakatao',
  'Computer Education',
  'TLE',
  'Kindergarten',
] as const;

export const DISTRICTS = [
  'District I',
  'District II',
  'District III',
  'District IV',
  'District V',
  'District VI',
] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  autoApproveEnabled: false,
  maxRevisionAttempts: 3,
  allowedFileTypes: ['.pdf', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.gif'],
  emailNotifications: true,
  requireComments: true,
  guidelines: [],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'gif', 'webp'];

// Admin access codes
export const ADMIN_CODES = ['ADMIN2024', 'ADNLRMS-QA', 'QAT-MASTER'];