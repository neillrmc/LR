import { useState, useRef } from 'react';
import { Material, MaterialType } from '../types';
import { CATEGORIES, MATERIAL_TYPES } from '../utils/constants';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Upload, X, FileText, Image, Presentation, Gamepad2, Globe, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ReuploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onReupload: (materialId: string, updates: Partial<Material>) => void;
}

export const ReuploadModal = ({ isOpen, onClose, material, onReupload }: ReuploadModalProps) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!material) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updates: Partial<Material> = {
      description: description || material.description,
      status: 'pending',
      revisionCount: (material.revisionCount || 0) + 1,
      lastRevisedAt: new Date(),
    };

    if (file) {
      updates.fileUrl = URL.createObjectURL(file);
      updates.fileName = file.name;
    }

    if (linkUrl) {
      updates.linkUrl = linkUrl;
    }

    onReupload(material.id, updates);
    
    // Reset and close
    setDescription('');
    setFile(null);
    setLinkUrl('');
    setIsSubmitting(false);
    onClose();
  };

  const getTypeIcon = (type: MaterialType) => {
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

  if (!isOpen || !material) return null;

  const isLinkType = material.type === 'game' || material.type === 'website';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950 bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reupload Material</h2>
              <p className="text-sm text-slate-400">Apply recommendations and resubmit</p>
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
        <div className="p-6 space-y-6">
          {/* Previous QA Remarks */}
          {material.qaRemark && (
            <div className="bg-amber-500 bg-opacity-10 border border-amber-500 border-opacity-30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Previous QA Feedback</span>
              </div>
              <p className="text-sm text-slate-300">{material.qaRemark.comments}</p>
              <p className="text-xs text-slate-500 mt-2">
                Result: <span className="font-medium text-amber-400">{material.qaRemark.result === 'needs-revision' ? 'Needs Revision' : 'Failed'}</span>
              </p>
            </div>
          )}

          {/* Material Info */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                material.type === 'pdf' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                material.type === 'image' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                material.type === 'ppt' ? 'bg-orange-500 bg-opacity-20 text-orange-400' :
                material.type === 'game' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                'bg-blue-500 bg-opacity-20 text-blue-400'
              }`}>
                {getTypeIcon(material.type)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{material.title}</h3>
                <p className="text-sm text-slate-400">{material.category}</p>
              </div>
            </div>
            {material.revisionCount && material.revisionCount > 0 && (
              <p className="text-xs text-slate-500 mt-3">
                This will be revision #{material.revisionCount + 1}
              </p>
            )}
          </div>

          {/* File/Link Upload */}
          <div className="space-y-4">
            {isLinkType ? (
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Updated Link URL</Label>
                <Input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={material.linkUrl || 'Enter new link URL'}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                />
                <p className="text-xs text-slate-500">
                  Current: {material.linkUrl || 'No link set'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Upload Revised File</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-amber-500 transition-colors cursor-pointer bg-slate-800"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Click to upload revised file</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, Image, or PPT</p>
                    </>
                  )}
                </div>
                {material.fileName && (
                  <p className="text-xs text-slate-500">
                    Current file: {material.fileName}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Description Update */}
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Revision Notes (Optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what changes were made..."
              rows={3}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (!file && !linkUrl)}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Submit Revision
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};