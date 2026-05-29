import { memo } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  type: 'completed' | 'ongoing' | 'pending';
  count: number;
}

const iconMap = {
  completed: CheckCircle,
  ongoing: Clock,
  pending: AlertCircle,
};

const colorMap = {
  completed: { bg: 'bg-emerald-500', text: 'text-emerald-400' },
  ongoing: { bg: 'bg-blue-500', text: 'text-blue-400' },
  pending: { bg: 'bg-amber-500', text: 'text-amber-400' },
};

const labelMap = {
  completed: 'Quality Assured',
  ongoing: 'In Progress',
  pending: 'Pending Review',
};

export const StatsCard = memo(({ type, count }: StatsCardProps) => {
  const Icon = iconMap[type];
  const colors = colorMap[type];
  const label = labelMap[type];

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colors.bg} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{count}</p>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';