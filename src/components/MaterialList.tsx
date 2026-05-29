import { memo, useCallback } from 'react';
import { Material } from '../types';
import { Button } from './ui/button';
import { Clock, FileText, User, Trash2, RefreshCw, Link as LinkIcon, Hash } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface MaterialListProps {
  materials: Material[];
  isAdmin: boolean;
  onOpenQA: (material: Material) => void;
  onOpenReupload: (material: Material) => void;
  onDelete: (materialId: string) => void;
  onViewDeveloper?: (material: Material) => void;
}

const StatusBadge = memo(({ status }: { status: Material['status'] }) => {
  const config = {
    pending: { bg: 'bg-amber-500', label: 'Pending' },
    ongoing: { bg: 'bg-blue-500', label: 'In Progress' },
    completed: { bg: 'bg-emerald-500', label: 'Completed' },
  };
  const { bg, label } = config[status] || config.pending;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} text-white`}>
      {label}
    </span>
  );
});

const MaterialIdBadge = memo(({ materialId }: { materialId: string }) => (
  <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500 bg-opacity-20 rounded border border-indigo-500 border-opacity-30">
    <Hash className="w-3 h-3 text-indigo-400" />
    <span className="text-xs font-mono font-semibold text-indigo-300">{materialId}</span>
  </div>
));

const MaterialItem = memo(({ material, isAdmin, onOpenQA, onOpenReupload, onDelete, onViewDeveloper }: {
  material: Material;
  isAdmin: boolean;
  onOpenQA: (material: Material) => void;
  onOpenReupload: (material: Material) => void;
  onDelete: (materialId: string) => void;
  onViewDeveloper?: (material: Material) => void;
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <MaterialIdBadge materialId={material.materialId} />
            {material.fileName ? (
              <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            ) : (
              <LinkIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            )}
            <h3 className="text-white font-medium truncate">{material.title}</h3>
            <StatusBadge status={material.status} />
            {material.pendingReview && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500 text-white">Revised</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {material.developerName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(material.uploadedAt)}
            </span>
            <span className="px-2 py-0.5 bg-slate-700 rounded text-xs">{material.category}</span>
          </div>

          {material.qaRemark && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                material.qaRemark.result === 'passed' 
                  ? 'bg-emerald-500 bg-opacity-20 text-emerald-400'
                  : material.qaRemark.result === 'failed'
                  ? 'bg-red-500 bg-opacity-20 text-red-400'
                  : 'bg-amber-500 bg-opacity-20 text-amber-400'
              }`}>
                {material.qaRemark.result === 'passed' ? '✓ Passed' : 
                 material.qaRemark.result === 'failed' ? '✗ Failed' : '↻ Needs Revision'}
              </span>
              <span className="text-xs text-slate-500">by {material.qaRemark.reviewedBy}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin ? (
            <>
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => onViewDeveloper?.(material)}>
                <User className="w-4 h-4" />
              </Button>
              {material.status !== 'completed' && (
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => onOpenQA(material)}>
                  Review
                </Button>
              )}
              {material.qaRemark?.result === 'needs-revision' && (
                <Button size="sm" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-500 hover:bg-opacity-20" onClick={() => onOpenReupload(material)}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
              <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-500 hover:bg-opacity-20" onClick={() => onDelete(material.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <span className="text-xs text-slate-500">Login to manage</span>
          )}
        </div>
      </div>
    </div>
  );
});

MaterialItem.displayName = 'MaterialItem';

export const MaterialList = memo(({ materials, isAdmin, onOpenQA, onOpenReupload, onDelete, onViewDeveloper }: MaterialListProps) => {
  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No materials found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {materials.map(material => (
        <MaterialItem
          key={material.id}
          material={material}
          isAdmin={isAdmin}
          onOpenQA={onOpenQA}
          onOpenReupload={onOpenReupload}
          onDelete={onDelete}
          onViewDeveloper={onViewDeveloper}
        />
      ))}
    </div>
  );
});

MaterialList.displayName = 'MaterialList';