import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Stats } from '../types';

interface StatsChartProps {
  stats: Stats;
}

export const StatsChart = memo(({ stats }: StatsChartProps) => {
  const total = stats.total || 1;
  const completedPercent = Math.round((stats.completed / total) * 100);
  const ongoingPercent = Math.round((stats.ongoing / total) * 100);
  const pendingPercent = Math.round((stats.pending / total) * 100);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="text-lg font-semibold text-white">QA Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-800">
            {stats.completed > 0 && (
              <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${completedPercent}%` }} />
            )}
            {stats.ongoing > 0 && (
              <div className="bg-blue-500 transition-all duration-500" style={{ width: `${ongoingPercent}%` }} />
            )}
            {stats.pending > 0 && (
              <div className="bg-amber-500 transition-all duration-500" style={{ width: `${pendingPercent}%` }} />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-400">Completed</span>
            </div>
            <span className="text-sm font-medium text-white">{stats.completed} ({completedPercent}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-400">In Progress</span>
            </div>
            <span className="text-sm font-medium text-white">{stats.ongoing} ({ongoingPercent}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-400">Pending</span>
            </div>
            <span className="text-sm font-medium text-white">{stats.pending} ({pendingPercent}%)</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Materials</span>
            <span className="text-lg font-bold text-white">{stats.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StatsChart.displayName = 'StatsChart';