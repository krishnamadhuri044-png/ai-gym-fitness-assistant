import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Activity,
  Apple,
  Flame,
  Bot,
  CalendarCheck,
  Building2,
  Trophy,
  LineChart,
  User,
  ShieldAlert,
  Cpu,
  Utensils
} from 'lucide-react';
import { UserRole } from '../types';

export type PageId =
  | 'dashboard'
  | 'ai-trainer'
  | 'performance'
  | 'workout-planner'
  | 'dietician'
  | 'calorie-tracker'
  | 'habits'
  | 'gym-buddy'
  | 'smart-gym'
  | 'gyms'
  | 'challenges'
  | 'analytics'
  | 'profile'
  | 'admin';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  userRole,
}) => {
  const userNavItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-trainer', label: 'AI Gym Trainer', icon: Camera, badge: 'Live CV' },
    { id: 'performance', label: 'Pose & Performance', icon: Activity },
    { id: 'workout-planner', label: 'Workout Planner', icon: CalendarCheck },
    { id: 'dietician', label: 'AI Dietician', icon: Apple, badge: 'Smart' },
    { id: 'calorie-tracker', label: 'Calorie Coach', icon: Utensils },
    { id: 'habits', label: 'Habit & Skip Predictor', icon: Flame },
    { id: 'gym-buddy', label: 'Virtual Gym Buddy', icon: Bot, badge: 'Gemini' },
    { id: 'smart-gym', label: 'Smart Gym (IoT)', icon: Cpu, badge: 'Node-RED' },
    { id: 'gyms', label: 'Gym Recommender', icon: Building2 },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'analytics', label: 'Progress & Analytics', icon: LineChart },
    { id: 'profile', label: 'Profile & Assessment', icon: User },
  ];

  const adminNavItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Admin' },
  ];

  return (
    <aside className="w-64 bg-[#0c1220] border-r border-slate-800/80 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Fitness Navigation
        </div>
        <nav className="space-y-1">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Section */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 px-3 mb-2 flex items-center justify-between">
            <span>Management</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">STAFF</span>
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-amber-500/70'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-auto p-4 border-t border-slate-800/80 bg-slate-900/40 m-2 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Biomechanical Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          MediaPipe 33-point Landmark Pipeline &amp; Gemini Flash LLM active.
        </p>
      </div>
    </aside>
  );
};
