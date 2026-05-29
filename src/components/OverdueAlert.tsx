import { Material } from '../types';
import { getDaysDifference } from '../utils/helpers';
import { Button } from './ui/button';
import { AlertTriangle, Clock, Eye, X } from 'lucide-react';

interface OverdueAlertProps {
  overdueMaterials: Material[];
  onReview: (material: Material) => void;
  onDismiss?: () => void;
}

export const OverdueAlert = ({ overdueMaterials, onReview, onDismiss }: OverdueAlertProps) => {
  if (overdueMaterials.length === 0) return null;

  const getDaysPending = (uploadedAt: Date): number => {
    return getDaysDifference(uploadedAt, new Date());
  };

  return (
    <div className="bg-gradient-to-r from-red-900 to-orange-900 border border-red-700 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-red-500 p-2 rounded-lg flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              Overdue Materials Alert
            </h3>
            <p className="text-red-200 text-sm mt-1">
              {overdueMaterials.length} material{overdueMaterials.length > 1 ? 's' : ''} pending for more than 1 week without quality assurance
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-red-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-300" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
        {overdueMaterials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between bg-red-950 bg-opacity-50 rounded-lg p-3 border border-red-800"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{material.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-red-300 text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {getDaysPending(material.uploadedAt)} days pending
                </span>
                <span className="text-red-400 text-xs">
                  by {material.developerName}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-500 text-white ml-3"
              onClick={() => onReview(material)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Review Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};