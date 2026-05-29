import { useState, useRef } from 'react';
import { AppSettings, QAGuideline } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  X, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  FileText, 
  Upload,
  Trash2,
  Download,
  Eye,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  adminName: string;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave,
  adminName 
}: SettingsModalProps) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'guidelines' | 'security'>('general');
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    version: '',
    fileUrl: '',
    fileName: '',
  });
  const [showGuidelineForm, setShowGuidelineForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    
    // Validate file type
    const allowedTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadError('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setNewGuideline(prev => ({
      ...prev,
      fileName: file.name,
      title: prev.title || file.name.replace('.pdf', '').replace('.PDF', ''),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    setNewGuideline(prev => ({
      ...prev,
      fileName: '',
      fileUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddGuideline = () => {
    if (!newGuideline.title || !uploadedFile) {
      setUploadError('Please provide a title and upload a PDF file');
      return;
    }
    
    // Create a local URL for the uploaded file
    const fileUrl = URL.createObjectURL(uploadedFile);
    
    const guideline: QAGuideline = {
      id: Math.random().toString(36).substring(2, 15),
      title: newGuideline.title,
      version: newGuideline.version || '1.0',
      fileUrl: fileUrl,
      fileName: newGuideline.fileName || uploadedFile.name,
      uploadedAt: new Date(),
      uploadedBy: adminName,
      isActive: true,
    };

    setLocalSettings(prev => ({
      ...prev,
      guidelines: [...(prev.guidelines || []), guideline],
    }));

    // Reset form
    setNewGuideline({ title: '', version: '', fileUrl: '', fileName: '' });
    setUploadedFile(null);
    setUploadError(null);
    setShowGuidelineForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveGuideline = (id: string) => {
    const guideline = (localSettings.guidelines || []).find(g => g.id === id);
    
    // Revoke the object URL to free memory
    if (guideline?.fileUrl && guideline.fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(guideline.fileUrl);
    }
    
    setLocalSettings(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).filter(g => g.id !== id),
    }));
  };

  const handleToggleGuideline = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).map(g => 
        g.id === id ? { ...g, isActive: !g.isActive } : g
      ),
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'guidelines', label: 'QA Guidelines', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Settings</h2>
              <p className="text-xs text-slate-400">Configure your quality assurance preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800 bg-opacity-50'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800 hover:bg-opacity-30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <Label className="text-white">Auto-Approve Materials</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Automatically approve materials that meet all criteria
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.autoApproveEnabled}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, autoApproveEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <Label className="text-white">Maximum Revision Attempts</Label>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      Number of times a developer can reupload before admin review is required
                    </p>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={localSettings.maxRevisionAttempts}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, maxRevisionAttempts: parseInt(e.target.value) || 3 }))}
                      className="bg-slate-700 border-slate-600 text-white w-32"
                    />
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <Label className="text-white">Allowed File Types</Label>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      File extensions permitted for upload (comma-separated)
                    </p>
                    <Input
                      type="text"
                      value={localSettings.allowedFileTypes.join(', ')}
                      onChange={(e) => setLocalSettings(prev => ({ 
                        ...prev, 
                        allowedFileTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder=".pdf, .ppt, .png"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Receive email alerts for new material uploads
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.emailNotifications}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <Label className="text-white">Overdue Material Alerts</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Get notified when materials exceed 1 week without QA
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <Label className="text-white">Revision Upload Alerts</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Get notified when developers reupload materials
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">QA Guidelines</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload and manage quality assurance guideline documents (PDF only)
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowGuidelineForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Guideline
                  </Button>
                </div>

                {/* Add Guideline Form */}
                {showGuidelineForm && (
                  <div className="mb-4 p-5 bg-slate-800 rounded-lg border border-indigo-500 border-opacity-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Upload New Guideline</h4>
                      <button
                        onClick={() => {
                          setShowGuidelineForm(false);
                          handleRemoveFile();
                        }}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Title Input */}
                      <div>
                        <Label className="text-slate-300 text-sm">Guideline Title *</Label>
                        <Input
                          value={newGuideline.title}
                          onChange={(e) => setNewGuideline(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                          placeholder="e.g., QA Checklist for Interactive Materials"
                        />
                      </div>

                      {/* Version Input */}
                      <div>
                        <Label className="text-slate-300 text-sm">Version</Label>
                        <Input
                          value={newGuideline.version}
                          onChange={(e) => setNewGuideline(prev => ({ ...prev, version: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                          placeholder="e.g., 1.0"
                        />
                      </div>

                      {/* File Upload Area */}
                      <div>
                        <Label className="text-slate-300 text-sm">PDF File *</Label>
                        
                        {!uploadedFile ? (
                          <div
                            className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                              isDragging 
                                ? 'border-indigo-500 bg-indigo-500 bg-opacity-10' 
                                : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-700'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileInputChange}
                              className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-3 bg-slate-700 rounded-full">
                                <Upload className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {isDragging ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                  PDF files only (max 10MB)
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 p-4 bg-slate-700 rounded-lg border border-slate-600">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg">
                                  <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{uploadedFile.name}</p>
                                  <p className="text-slate-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
                                </div>
                              </div>
                              <button
                                onClick={handleRemoveFile}
                                className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {uploadError && (
                        <div className="flex items-center gap-2 p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <p className="text-red-400 text-sm">{uploadError}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          onClick={() => {
                            setShowGuidelineForm(false);
                            handleRemoveFile();
                          }}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddGuideline}
                          disabled={!uploadedFile || !newGuideline.title}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Upload Guideline
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guidelines List */}
                {(localSettings.guidelines || []).length === 0 ? (
                  <div className="text-center py-8 bg-slate-800 rounded-lg border border-slate-700">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No guidelines uploaded</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Upload QA guidelines PDF for developers to reference
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(localSettings.guidelines || []).map((guideline) => (
                      <div
                        key={guideline.id}
                        className={`p-4 bg-slate-800 rounded-lg border ${
                          guideline.isActive ? 'border-slate-700' : 'border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-lg ${guideline.isActive ? 'bg-red-500 bg-opacity-20' : 'bg-slate-700'}`}>
                              <FileText className={`w-5 h-5 ${guideline.isActive ? 'text-red-400' : 'text-slate-500'}`} />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{guideline.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                {guideline.version && (
                                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                    v{guideline.version}
                                  </span>
                                )}
                                <span className="text-xs text-slate-500">
                                  {guideline.fileName}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Uploaded by {guideline.uploadedBy} • {new Date(guideline.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => window.open(guideline.fileUrl, '_blank')}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                              title="View PDF"
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = guideline.fileUrl;
                                link.download = guideline.fileName;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleToggleGuideline(guideline.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                guideline.isActive 
                                  ? 'bg-emerald-500 bg-opacity-20 hover:bg-opacity-30' 
                                  : 'bg-slate-700 hover:bg-slate-600'
                              }`}
                              title={guideline.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <Check className={`w-4 h-4 ${guideline.isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                            </button>
                            <button
                              onClick={() => handleRemoveGuideline(guideline.id)}
                              className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <Label className="text-white">Require Comments on Review</Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Admins must add comments when reviewing materials
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.requireComments}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, requireComments: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <Label className="text-white">Admin Session Timeout</Label>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      Automatically logout after inactivity (in minutes)
                    </p>
                    <Input
                      type="number"
                      min={5}
                      max={120}
                      defaultValue={30}
                      className="bg-slate-700 border-slate-600 text-white w-32"
                    />
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <Label className="text-white">Change Admin Password</Label>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      Update your admin account password
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="password"
                        placeholder="Current Password"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4 flex justify-end gap-3 bg-slate-900 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};