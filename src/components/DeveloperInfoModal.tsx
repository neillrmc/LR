import { Material } from '../types';
import { Button } from './ui/button';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  FileText,
  Link as LinkIcon,
  Clock,
  Tag,
  MessageSquare
} from 'lucide-react';

interface DeveloperInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
}

export const DeveloperInfoModal = ({ isOpen, onClose, material }: DeveloperInfoModalProps) => {
  if (!isOpen || !material) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'ongoing':
        return 'bg-amber-500';
      case 'pending':
      default:
        return 'bg-red-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 bg-opacity-20 border-emerald-500';
      case 'ongoing':
        return 'bg-amber-500 bg-opacity-20 border-amber-500';
      case 'pending':
      default:
        return 'bg-red-500 bg-opacity-20 border-red-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Developer Information</h2>
              <p className="text-xs text-slate-400">Material submission details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Material Info Card */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 bg-opacity-20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBg(material.status)}`}>
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(material.status)} mr-1.5`} />
                      {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {material.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {material.description && (
              <p className="text-sm text-slate-400 bg-slate-900 rounded-lg p-3 mt-3">
                {material.description}
              </p>
            )}
          </div>

          {/* Developer Contact Details */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Developer Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-medium text-white">{material.developerName}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <a 
                      href={`mailto:${material.developerEmail}`}
                      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {material.developerEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone (if available) */}
              {material.developerPhone && (
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <a 
                        href={`tel:${material.developerPhone}`}
                        className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                      >
                        {material.developerPhone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Department (if available) */}
              {material.developerDepartment && (
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-2 rounded-lg">
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="text-sm font-medium text-white">{material.developerDepartment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Submission Timeline
            </h4>
            
            <div className="space-y-3">
              {/* Upload Date */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Uploaded</p>
                  <p className="text-sm text-white">{formatDate(material.uploadedAt)}</p>
                </div>
              </div>

              {/* Reupload Date (if applicable) */}
              {material.reuploadedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Last Re-uploaded</p>
                    <p className="text-sm text-white">{formatDate(material.reuploadedAt)}</p>
                  </div>
                </div>
              )}

              {/* Review Date (if applicable) */}
              {material.qaRemark?.reviewedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Last Reviewed</p>
                    <p className="text-sm text-white">{formatDate(material.qaRemark.reviewedAt)}</p>
                    <p className="text-xs text-slate-400">by {material.qaRemark.reviewedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Material Files/Links */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-400" />
              Material Files & Links
            </h4>
            
            <div className="space-y-3">
              {/* Files */}
              {material.files && material.files.length > 0 && (
                <div className="space-y-2">
                  {material.files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-sm text-white">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => {
                          const link = window.document.createElement('a');
                          link.href = URL.createObjectURL(file);
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Links */}
              {material.links && material.links.length > 0 && (
                <div className="space-y-2">
                  {material.links.map((link, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-sm text-white">{link.label}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{link.url}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* QA Remarks (if any) */}
          {material.qaRemark && (
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                QA Review Remarks
              </h4>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    material.qaRemark.result === 'passed' 
                      ? 'bg-emerald-500 bg-opacity-20 text-emerald-400'
                      : material.qaRemark.result === 'failed'
                      ? 'bg-red-500 bg-opacity-20 text-red-400'
                      : 'bg-amber-500 bg-opacity-20 text-amber-400'
                  }`}>
                    {material.qaRemark.result === 'passed' ? 'Passed' : 
                     material.qaRemark.result === 'failed' ? 'Failed' : 'Needs Revision'}
                  </span>
                  <span className="text-xs text-slate-500">
                    by {material.qaRemark.reviewedBy}
                  </span>
                </div>
                {material.qaRemark.comments && (
                  <p className="text-sm text-slate-300">{material.qaRemark.comments}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => window.open(`mailto:${material.developerEmail}`, '_blank')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            {material.developerPhone && (
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => window.open(`tel:${material.developerPhone}`, '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
          </div>
          <Button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};