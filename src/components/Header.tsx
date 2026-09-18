import React from 'react';
import {
  Flame,
  User as UserIcon,
  ShieldCheck,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  currentStreak: number;
  caloriesConsumed: number;
  calorieTarget: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onSwitchRole: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentStreak,
  caloriesConsumed,
  calorieTarget,
  audioEnabled,
  onToggleAudio,
  onSwitchRole,
  onOpenProfile,
  onLogout,
}) => {
  return (
    <header className="h-16 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">AI GYM</span>
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
              PRO ASSISTANT
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Real-Time Biomechanical Coaching &amp; Health Hub</p>
        </div>
      </div>

      {/* Right Stats & Controls */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Streak Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span>{currentStreak} Day Streak</span>
        </div>

        {/* Calorie Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{caloriesConsumed} / {calorieTarget} kcal</span>
        </div>

        {/* Audio Cue Toggle */}
        <button
          onClick={onToggleAudio}
          title={audioEnabled ? 'Workout audio chimes enabled' : 'Workout audio muted'}
          className={`p-2 rounded-lg border transition-colors ${
            audioEnabled
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Role Switcher Demo Button */}
        <button
          onClick={onSwitchRole}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          title="Switch view between User and Admin roles"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Role:</span>
          <span className="font-bold text-cyan-300">{user?.role || 'USER'}</span>
        </button>

        {/* User Avatar Menu */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs group-hover:border-cyan-400 transition-colors">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                {user?.name || 'Athlete'}
              </p>
              <p className="text-[11px] text-slate-400 leading-none">{user?.email || 'Logged In'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
