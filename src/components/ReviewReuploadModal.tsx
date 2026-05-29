import { useState } from 'react';
import { Material, QAResult } from '../types';
import { Button } from './ui/button';
import { 
  X, 
  FileText, 
  Image, 
  Presentation, 
  Gamepad2, 
  Globe,
  Download,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileSearch,
  Clock,
  User,
  Mail,
  Tag,
  File
} from 'lucide-react';

interface ReviewReuploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onReview: (materialId: string, result: QAResult, comments: string) => void;
  adminName: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'ppt':
      return <Presentation className="w-5 h-5" />;
    case 'game':
      return <Gamepad2 className="w-5 h-5" />;
    case 'website':
      return <Globe className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500 border-opacity-30';
    case 'image':
      return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30';
    case 'ppt':
      return 'bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500 border-opacity-30';
    case 'game':
      return 'bg-purple-500 bg-opacity-20 text-purple-400 border-purple-500 border-opacity-30';
    case 'website':
      return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500 border-opacity-30';
    default:
      return 'bg-slate-500 bg-opacity-20 text-slate-400 border-slate-500 border-opacity-30';
  }
};

export const ReviewReuploadModal = ({ isOpen, onClose, material, onReview, adminName }: ReviewReuploadModalProps) => {
  const [result, setResult] = useState<QAResult | ''>('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !material) return null;

  const handleSubmit = () => {
    if (!result) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onReview(material.id, result, comments);
      setIsSubmitting(false);
      setResult('');
      setComments('');
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setResult('');
    setComments('');
    onClose();
  };

  const handleViewOriginal = () => {
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    } else if (material.linkUrl) {
      window.open(material.linkUrl, '_blank');
    }
  };

  const handleViewReuploaded = () => {
    if (material.reuploadedFileUrl) {
      window.open(material.reuploadedFileUrl, '_blank');
    } else if (material.reuploadedLinkUrl) {
      window.open(material.reuploadedLinkUrl, '_blank');
    }
  };

  const handleDownloadOriginal = () => {
    if (material.fileUrl) {
      const link = window.document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || 'download';
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleDownloadReuploaded = () => {
    if (material.reuploadedFileUrl) {
      const link = window.document.createElement('a');
      link.href = material.reuploadedFileUrl;
      link.download = material.reuploadedFileName || 'download';
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Review Reuploaded Material</h2>
              <p className="text-sm text-slate-400">Compare and finalize QA decision</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Material Info */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg border ${getTypeColor(material.type)}`}>
                {getTypeIcon(material.type)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{material.title}</h3>
                <p className="text-sm text-slate-400">{material.category}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{material.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Developer:</span>
                <span className="text-white">{material.developerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{material.developerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Type:</span>
                <span className="text-white capitalize">{material.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Revision:</span>
                <span className="text-amber-400">{material.revisionCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Previous QA Remark */}
          {material.qaRemark && (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Previous QA Feedback
              </h4>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    material.qaRemark.result === 'passed' ? 'bg-emerald-500 text-white' :
                    material.qaRemark.result === 'failed' ? 'bg-red-500 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {material.qaRemark.result === 'needs-revision' ? 'Needs Revision' : 
                     material.qaRemark.result.charAt(0).toUpperCase() + material.qaRemark.result.slice(1)}
                  </span>
                  <span className="text-xs text-slate-500">
                    by {material.qaRemark.reviewedBy} on {new Date(material.qaRemark.reviewedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{material.qaRemark.comments}</p>
              </div>
            </div>
          )}

          {/* File Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original File */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <File className="w-4 h-4" />
                Original File
              </h4>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 mb-3">
                <p className="text-sm text-white truncate">{material.fileName || 'No file'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {material.type !== 'game' && material.type !== 'website' ? (
                  <>
                    <Button
                      onClick={handleViewOriginal}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={handleDownloadOriginal}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleViewOriginal}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </Button>
                )}
              </div>
            </div>

            {/* Reuploaded File */}
            <div className="bg-emerald-500 bg-opacity-10 rounded-xl p-4 border border-emerald-500 border-opacity-30">
              <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reuploaded File
              </h4>
              <div className="bg-slate-900 rounded-lg p-3 border border-emerald-500 border-opacity-30 mb-3">
                <p className="text-sm text-white truncate">{material.reuploadedFileName || 'No file'}</p>
                <p className="text-xs text-emerald-300 mt-1">
                  Uploaded: {material.reuploadedAt ? new Date(material.reuploadedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                {material.type !== 'game' && material.type !== 'website' ? (
                  <>
                    <Button
                      onClick={handleViewReuploaded}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={handleDownloadReuploaded}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleViewReuploaded}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* QA Decision */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-400 mb-3">QA Decision</h4>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setResult('passed')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  result === 'passed'
                    ? 'bg-emerald-500 bg-opacity-20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm font-medium">Passed</span>
              </button>
              
              <button
                onClick={() => setResult('needs-revision')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  result === 'needs-revision'
                    ? 'bg-amber-500 bg-opacity-20 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400'
                }`}
              >
                <RefreshCw className="w-6 h-6" />
                <span className="text-sm font-medium">Needs Revision</span>
              </button>
              
              <button
                onClick={() => setResult('failed')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  result === 'failed'
                    ? 'bg-red-500 bg-opacity-20 border-red-500 text-red-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400'
                }`}
              >
                <XCircle className="w-6 h-6" />
                <span className="text-sm font-medium">Failed</span>
              </button>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Comments (Required)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your feedback about the reuploaded material..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!result || !comments.trim() || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};