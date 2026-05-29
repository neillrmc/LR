import { useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, X, FileText, Link as LinkIcon, Check, AlertCircle, Hash } from 'lucide-react';
import { MaterialType } from '../types';
import { MATERIAL_TYPES, CATEGORIES, DISTRICTS } from '../utils/constants';
import { generateMaterialId } from '../utils/helpers';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (material: {
    title: string;
    description: string;
    category: string;
    type: MaterialType;
    fileUrl?: string;
    fileName?: string;
    linkUrl?: string;
    developerName: string;
    developerEmail: string;
    contactNumber?: string;
    school?: string;
    district?: string;
    status: 'pending';
  }) => void;
  existingMaterialsCount?: number;
}

export const UploadModal = ({ isOpen, onClose, onSubmit, existingMaterialsCount = 0 }: UploadModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'pdf' as MaterialType,
    file: null as File | null,
    linkUrl: '',
    developerName: '',
    developerEmail: '',
    contactNumber: '',
    school: '',
    district: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [previewMaterialId] = useState(() => {
    // Generate a preview ID for display (actual ID will be generated on submit)
    const currentYear = new Date().getFullYear();
    const nextNum = (existingMaterialsCount + 1).toString().padStart(5, '0');
    return `ADN-${currentYear}-${nextNum}`;
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file, type: getFileType(file.name) }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const getFileType = (fileName: string): MaterialType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['ppt', 'pptx'].includes(ext || '')) return 'ppt';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'others';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file, type: getFileType(file.name) }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  }, []);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.file && !formData.linkUrl) {
        newErrors.file = 'Please upload a file or provide a link';
      }
      if (formData.linkUrl && !/^https?:\/\/.+/.test(formData.linkUrl)) {
        newErrors.linkUrl = 'Please enter a valid URL';
      }
    }

    if (currentStep === 2) {
      if (!formData.developerName.trim()) newErrors.developerName = 'Developer name is required';
      if (!formData.developerEmail.trim()) newErrors.developerEmail = 'Email is required';
      if (formData.developerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.developerEmail)) {
        newErrors.developerEmail = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      fileUrl: formData.file ? URL.createObjectURL(formData.file) : undefined,
      fileName: formData.file?.name,
      linkUrl: formData.linkUrl || undefined,
      developerName: formData.developerName,
      developerEmail: formData.developerEmail,
      contactNumber: formData.contactNumber,
      school: formData.school,
      district: formData.district,
      status: 'pending',
    });

    // Reset and close
    setFormData({
      title: '',
      description: '',
      category: '',
      type: 'pdf',
      file: null,
      linkUrl: '',
      developerName: '',
      developerEmail: '',
      contactNumber: '',
      school: '',
      district: '',
    });
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-700 flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white">Upload Learning Material</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Step {step} of 2</p>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {/* Material ID Preview */}
          <div className="mb-6 p-4 bg-indigo-500 bg-opacity-10 border border-indigo-500 border-opacity-30 rounded-lg">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-slate-400">Material ID:</span>
              <span className="text-lg font-mono font-bold text-indigo-300">{previewMaterialId}</span>
              <span className="text-xs text-slate-500 ml-2">(Auto-generated)</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs font-bold">1</span>
              Material Details
            </div>
            <div className="flex-1 h-1 bg-slate-700 rounded">
              <div className={`h-full bg-indigo-600 rounded transition-all ${step === 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs font-bold">2</span>
              Developer Info
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 mb-1.5 block">Material Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter material title"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label className="text-slate-300 mb-1.5 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the material"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 min-h-20"
                />
              </div>

              <div>
                <Label className="text-slate-300 mb-1.5 block">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-indigo-500"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label className="text-slate-300 mb-1.5 block">Upload File or Provide Link *</Label>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging ? 'border-indigo-500 bg-indigo-500 bg-opacity-10' : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {formData.file ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <Check className="w-5 h-5" />
                      <span>{formData.file.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">Drag & drop or click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, PPT, or Images (max 10MB)</p>
                    </>
                  )}
                </div>
                {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}

                {/* Or divider */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-slate-700" />
                  <span className="text-slate-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-slate-700" />
                </div>

                {/* Link Input */}
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="https://example.com/your-material"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 pl-10"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">For games or websites, provide the URL</p>
                {errors.linkUrl && <p className="text-red-400 text-xs mt-1">{errors.linkUrl}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Next: Developer Info
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 mb-1.5 block">Developer Name *</Label>
                <Input
                  value={formData.developerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, developerName: e.target.value }))}
                  placeholder="Full name"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {errors.developerName && <p className="text-red-400 text-xs mt-1">{errors.developerName}</p>}
              </div>

              <div>
                <Label className="text-slate-300 mb-1.5 block">Email Address *</Label>
                <Input
                  type="email"
                  value={formData.developerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, developerEmail: e.target.value }))}
                  placeholder="email@example.com"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {errors.developerEmail && <p className="text-red-400 text-xs mt-1">{errors.developerEmail}</p>}
              </div>

              <div>
                <Label className="text-slate-300 mb-1.5 block">Contact Number</Label>
                <Input
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="09XX-XXX-XXXX"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 mb-1.5 block">School</Label>
                  <Input
                    value={formData.school}
                    onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                    placeholder="School name"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 mb-1.5 block">District</Label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-indigo-500"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-800 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Material ID:</span>
                    <span className="font-mono text-indigo-300">{previewMaterialId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Title:</span>
                    <span className="text-white">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File/Link:</span>
                    <span className="text-white">{formData.file?.name || formData.linkUrl || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                  Submit Material
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};