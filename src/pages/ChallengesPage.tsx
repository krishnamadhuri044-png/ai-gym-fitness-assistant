import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Users,
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Challenge } from '../types';
import { api } from '../services/api';

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getChallenges().then((data) => {
      setChallenges(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleToggleJoin = async (id: string) => {
    try {
      const updated = await api.toggleJoinChallenge(id);
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Error toggling challenge join:', err);
    }
  };

  const handleIncrementProgress = async (id: string, current: number, target: number) => {
    const nextVal = Math.min(target, current + 5);
    try {
      const updated = await api.updateChallengeProgress(id, nextVal);
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Error updating challenge progress:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Gamification &amp; Milestones
          </span>
          <span className="text-xs text-slate-400">Community Fitness Challenges</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Fitness Challenges &amp; Badges
        </h1>
        <p className="text-xs text-slate-300">
          Push your athletic boundaries, earn certified badges, and maintain ironclad consistency.
        </p>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c) => {
            const pct = Math.min(100, Math.round((c.userProgress / c.targetCount) * 100));
            const isCompleted = c.userProgress >= c.targetCount;
            return (
              <div
                key={c.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" /> {c.category} Track
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>

                  <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Unlockable Reward:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {c.badge}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {c.isJoined && (
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Your Progress</span>
                        <span className="text-white font-mono">{c.userProgress} / {c.targetCount}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>{pct}% complete</span>
                        {isCompleted && <span className="text-emerald-400 font-bold">Badge Unlocked!</span>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {c.isJoined ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleIncrementProgress(c.id, c.userProgress, c.targetCount)}
                        disabled={isCompleted}
                        className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Log Progress (+5)
                      </button>
                      <button
                        onClick={() => handleToggleJoin(c.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium transition-colors"
                      >
                        Leave
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleJoin(c.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950 flex items-center justify-center gap-1.5 transition-all"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
