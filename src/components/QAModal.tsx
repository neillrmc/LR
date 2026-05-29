import { useState } from 'react';
import { Material, QAResult } from '../types';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { CheckCircle2, XCircle, AlertCircle, FileCheck, Send } from 'lucide-react';

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onSubmit: (materialId: string, result: QAResult, comments: string) => void;
  adminName: string;
}

const QA_OPTIONS: { value: QAResult; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'passed',
    label: 'Passed',
    description: 'Material meets all quality assurance standards',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500',
  },
  {
    value: 'failed',
    label: 'Failed',
    description: 'Material does not meet quality standards',
    icon: <XCircle className="w-5 h-5" />,
    color: 'bg-red-600 hover:bg-red-500 border-red-500',
  },
  {
    value: 'needs-revision',
    label: 'Needs Revision',
    description: 'Apply recommendations indicated in the QA tool',
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'bg-amber-600 hover:bg-amber-500 border-amber-500',
  },
];

export const QAModal = ({ isOpen, onClose, material, onSubmit, adminName }: QAModalProps) => {
  const [selectedResult, setSelectedResult] = useState<QAResult | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedResult || !material) return;
    
    setIsSubmitting(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(material.id, selectedResult, comments);
    setIsSubmitting(false);
    
    // Reset and close
    setSelectedResult(null);
    setComments('');
    onClose();
  };

  const handleClose = () => {
    setSelectedResult(null);
    setComments('');
    onClose();
  };

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950 bg-opacity-80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-xl">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quality Assurance Review</h2>
              <p className="text-sm text-slate-400">Review and evaluate material</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Material Info */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-1">{material.title}</h3>
            <p className="text-sm text-slate-400 mb-2">{material.category}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Developer: {material.developerName}</span>
              <span>•</span>
              <span>Uploaded: {material.uploadedAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* QA Result Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Quality Assurance Result *</Label>
            <div className="space-y-2">
              {QA_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedResult(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                    selectedResult === option.value
                      ? `${option.color} border-opacity-100 text-white`
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className={`mt-0.5 ${selectedResult === option.value ? 'text-white' : 'text-slate-500'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className={`text-sm ${selectedResult === option.value ? 'text-white text-opacity-80' : 'text-slate-500'}`}>
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-slate-300 font-medium">
              Comments & Recommendations
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your feedback, recommendations, or notes..."
              rows={4}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 resize-none"
            />
            {selectedResult === 'needs-revision' && (
              <p className="text-xs text-amber-400">
                Please provide detailed recommendations for improvement.
              </p>
            )}
          </div>

          {/* Reviewer Info */}
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Reviewed by:</span>
              <span className="text-white font-medium">{adminName}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedResult || isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};