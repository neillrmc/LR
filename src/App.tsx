import { useState, useMemo, useCallback, useEffect } from 'react';
import { Material, MaterialStatus } from './types';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { useNotifications } from './hooks/useMaterials';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { StatsCard } from './components/StatsCard';
import { StatsChart } from './components/StatsChart';
import { MaterialList } from './components/MaterialList';
import { UploadModal } from './components/UploadModal';
import { LoginModal } from './components/LoginModal';
import { QAModal } from './components/QAModal';
import { ReuploadModal } from './components/ReuploadModal';
import { NotificationPanel } from './components/NotificationPanel';
import { SettingsModal } from './components/SettingsModal';
import { DeveloperInfoModal } from './components/DeveloperInfoModal';
import { OverdueAlert } from './components/OverdueAlert';
import { Upload, Shield, Search, LogOut, User as UserIcon, FileText, Eye, Download, X, Hash } from 'lucide-react';
import { storage, calculateStats, getOverdueMaterials, generateMaterialId } from './utils/helpers';
import { sampleMaterials } from './utils/sampleData';

const STORAGE_KEY = 'adnlrms_materials';

function App() {
  // Initialize materials from storage or sample data
  const [materials, setMaterials] = useState<Material[]>(() => {
    const stored = storage.get<Material[]>(STORAGE_KEY, []);
    if (stored.length === 0) {
      // First time - use sample data
      storage.set(STORAGE_KEY, sampleMaterials);
      return sampleMaterials;
    }
    return stored;
  });

  // Custom hooks for state management
  const { user, login, logout, isAdmin } = useAuth();
  const { settings, updateSettings, activeGuidelines } = useSettings();
  const { notifications, markAsRead: markNotificationRead, clearAll: clearNotifications, unreadCount } = useNotifications(materials, isAdmin);

  // Calculate stats
  const stats = useMemo(() => calculateStats(materials), [materials]);
  const overdueMaterials = useMemo(() => getOverdueMaterials(materials), [materials]);

  // Local UI state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaterialStatus | 'all'>('all');
  const [showOverdueAlert, setShowOverdueAlert] = useState(true);

  // Persist materials to storage
  useEffect(() => {
    storage.set(STORAGE_KEY, materials);
  }, [materials]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.materialId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [materials, searchQuery, statusFilter]);

  // Handlers
  const handleOpenQA = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsQAModalOpen(true);
  }, []);

  const handleOpenReupload = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsReuploadModalOpen(true);
  }, []);

  const handleViewDeveloper = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsDeveloperInfoOpen(true);
  }, []);

  const handleAddMaterial = useCallback((materialData: Omit<Material, 'id' | 'materialId' | 'uploadedAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: `internal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      materialId: generateMaterialId(materials),
      uploadedAt: new Date(),
    };
    setMaterials(prev => [newMaterial, ...prev]);
    setIsUploadModalOpen(false);
  }, [materials]);

  const handleUpdateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates, lastUpdated: new Date() } : m
    ));
  }, []);

  const handleDeleteMaterial = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  }, []);

  const handleQASubmit = useCallback((materialId: string, result: 'passed' | 'failed' | 'needs-revision', comments: string) => {
    if (!user) return;
    setMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        const newStatus = result === 'passed' ? 'completed' : 
                         result === 'failed' ? 'pending' : 'ongoing';
        return { 
          ...m, 
          status: newStatus, 
          qaRemark: {
            result,
            comments,
            reviewedAt: new Date(),
            reviewedBy: user.name,
          },
          pendingReview: false,
        };
      }
      return m;
    }));
    setIsQAModalOpen(false);
    setSelectedMaterial(null);
  }, [user]);

  const handleReupload = useCallback((materialId: string, updates: Partial<Material>) => {
    handleUpdateMaterial(materialId, {
      ...updates,
      pendingReview: true,
      reuploadedAt: new Date(),
    });
    setIsReuploadModalOpen(false);
    setSelectedMaterial(null);
  }, [handleUpdateMaterial]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ADNLRMS QAT</h1>
                <p className="text-xs text-slate-400">Quality Assurance Tool</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markNotificationRead}
                    onClearAll={clearNotifications}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                  />
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{user.name}</span>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded">Admin</span>
                  </div>
                  <Button onClick={logout} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                  <Button onClick={() => setIsUploadModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsUploadModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Material</span>
                  </Button>
                  <Button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {user ? `Welcome, ${user.name}` : 'Quality Assurance Dashboard'}
          </h2>
          <p className="text-slate-400">Monitor and manage learning materials for quality review</p>
        </div>

        {/* Overdue Alert */}
        {isAdmin && showOverdueAlert && overdueMaterials.length > 0 && (
          <OverdueAlert
            overdueMaterials={overdueMaterials}
            onReview={handleOpenQA}
            onDismiss={() => setShowOverdueAlert(false)}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard type="completed" count={stats.completed} />
          <StatsCard type="ongoing" count={stats.ongoing} />
          <StatsCard type="pending" count={stats.pending} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Materials List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-white">Recent Materials</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search by title, ID, developer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as MaterialStatus | 'all')}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-300"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="ongoing">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <MaterialList 
                  materials={filteredMaterials} 
                  isAdmin={isAdmin}
                  onOpenQA={handleOpenQA}
                  onOpenReupload={handleOpenReupload}
                  onDelete={handleDeleteMaterial}
                  onViewDeveloper={handleViewDeveloper}
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Chart & Guidelines */}
          <div className="lg:col-span-1">
            <StatsChart stats={stats} />
            
            {/* Material ID Legend */}
            <Card className="mt-6 bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Material ID Format</h3>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="font-mono text-lg text-indigo-300 mb-2">ADN-2024-00001</div>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p><span className="text-indigo-400 font-medium">ADN</span> - ADNLRMS Prefix</p>
                    <p><span className="text-indigo-400 font-medium">2024</span> - Year Uploaded</p>
                    <p><span className="text-indigo-400 font-medium">00001</span> - Sequential Number</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Each material receives a unique ID upon upload for easy tracking and reference.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mt-6 bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">QA Guidelines</h3>
                </div>
                
                {activeGuidelines.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No guidelines uploaded yet</p>
                    {isAdmin && (
                      <Button 
                        onClick={() => setIsSettingsModalOpen(true)} 
                        variant="outline" 
                        className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Upload Guidelines
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeGuidelines.map(g => (
                      <button
                        key={g.id}
                        className="w-full flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left"
                      >
                        <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{g.title}</p>
                          <p className="text-xs text-slate-400">v{g.version}</p>
                        </div>
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleAddMaterial}
        existingMaterialsCount={materials.length}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
      />

      {selectedMaterial && (
        <>
          <QAModal
            isOpen={isQAModalOpen}
            onClose={() => { setIsQAModalOpen(false); setSelectedMaterial(null); }}
            material={selectedMaterial}
            onSubmit={handleQASubmit}
          />

          <ReuploadModal
            isOpen={isReuploadModalOpen}
            onClose={() => { setIsReuploadModalOpen(false); setSelectedMaterial(null); }}
            material={selectedMaterial}
            onSubmit={handleReupload}
          />

          <DeveloperInfoModal
            isOpen={isDeveloperInfoOpen}
            onClose={() => { setIsDeveloperInfoOpen(false); setSelectedMaterial(null); }}
            material={selectedMaterial}
          />
        </>
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
}

export default App;