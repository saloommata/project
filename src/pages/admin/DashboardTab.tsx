import { useState, useEffect } from 'react';
import { Coffee, FolderTree, Star, Users, Radio } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import type { Visitor } from '../../types';
import { api } from '../../utils/api';
import { maskIp } from '../../utils/helpers';

function StatCard({ icon: Icon, label, value }: { icon: typeof Coffee; label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl border border-border/70 p-5 flex items-center gap-4 shadow-soft">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <div className="text-2xl font-semibold text-secondary leading-none">{value}</div>
        <div className="text-muted text-sm mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardTab() {
  const { state } = useApp();
  const [hourlyData, setHourlyData] = useState<{ [hour: number]: number }>({});
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [totals, setTotals] = useState({ total: 0, online: 0 });

  useEffect(() => {
    let cancelled = false;
    const updateData = async () => {
      try {
        const stats = await api.visitors.getStats();
        if (!cancelled) {
          setHourlyData(stats.hourly);
          setRecentVisitors(stats.recent);
          setTotals({ total: stats.total, online: stats.online });
        }
      } catch (err) {
        console.error('Failed to load visitor stats:', err);
      }
    };
    updateData();
    const interval = setInterval(updateData, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const hourlyValues = Object.values(hourlyData);
  const maxVisitors = hourlyValues.length > 0 ? Math.max(...hourlyValues, 1) : 1;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Coffee} label="Menu Items" value={state.menuItems.length} />
        <StatCard icon={FolderTree} label="Categories" value={state.menuCategories.length} />
        <StatCard icon={Star} label="Testimonials" value={state.testimonials.length} />
        <StatCard icon={Users} label="Visitors (2 days)" value={totals.total} />
        <StatCard icon={Radio} label="Online Now" value={totals.online} />
      </div>

      <div className="bg-white rounded-2xl border border-border/70 p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-secondary mb-5">Hourly Visitor Distribution</h3>
        <div className="flex items-end gap-1 h-44">
          {Object.entries(hourlyData).map(([hour, count]) => (
            <div key={hour} className="flex-1 h-full flex flex-col items-center justify-end">
              <div
                className="w-full bg-primary/70 rounded-t transition-all hover:bg-primary"
                style={{ height: `${(count / maxVisitors) * 100}%`, minHeight: count > 0 ? '3px' : '0' }}
                title={`${hour}:00 - ${count} visitors`}
              />
              <span className="text-[10px] font-mono-label text-muted mt-2 shrink-0">{hour}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/70 shadow-soft overflow-hidden">
        <h3 className="font-display text-lg font-semibold text-secondary p-6 pb-0 mb-4">Recent Visitors</h3>
        {recentVisitors.length === 0 ? (
          <p className="text-muted text-center py-10 text-sm">No visitors recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-border/20">
                <tr>
                  <th className="text-left text-muted px-6 py-3 font-medium">Visitor</th>
                  <th className="text-left text-muted px-6 py-3 font-medium">Country</th>
                  <th className="text-left text-muted px-6 py-3 font-medium">Status</th>
                  <th className="text-left text-muted px-6 py-3 font-medium">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.map((visitor, index) => (
                  <tr key={index} className="border-t border-border/60">
                    <td className="px-6 py-3 text-secondary font-mono-label text-xs">{maskIp(visitor.ip)}</td>
                    <td className="px-6 py-3 text-foreground/70">{visitor.country ?? 'Unknown'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${visitor.isOnline ? 'bg-success/15 text-success' : 'bg-border/40 text-muted'}`}>
                        {visitor.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-foreground/70">{new Date(visitor.lastVisit).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
