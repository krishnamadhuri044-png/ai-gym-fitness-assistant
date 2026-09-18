import React, { useState, useEffect } from 'react';
import {
  Flame,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';
import { HabitStatusData } from '../types';
import { api } from '../services/api';

export const HabitTrackerPage: React.FC = () => {
  const [habitData, setHabitData] = useState<HabitStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [togglingDay, setTogglingDay] = useState<string | null>(null);

  const fetchHabits = async () => {
    try {
      const data = await api.getHabits();
      setHabitData(data);
    } catch (err) {
      console.error('Error fetching habit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleToggleHabitDay = async (day: string, completed: boolean) => {
    setTogglingDay(day);
    try {
      const updated = await api.logHabitCompletion(day, !completed);
      setHabitData(updated);
    } catch (err) {
      console.error('Error toggling habit day:', err);
    } finally {
      setTogglingDay(null);
    }
  };

  if (loading || !habitData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const {
    currentStreak,
    weeklyGoalWorkouts,
    weeklyCompletedWorkouts,
    habitStatus,
    skipRisk,
    skipRiskReason,
    motivationalNudge,
    dynamicRecommendation,
    historicalEngagement
  } = habitData;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Behavioral AI Engine
          </span>
          <span className="text-xs text-slate-400">Habit Retention &amp; Skip Predictor</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Fitness Habit Tracker &amp; Skip Predictor
        </h1>
        <p className="text-xs text-slate-300">
          Identifies behavioral burnout, micro-habit adherence, and proactively adjusts training schedules to prevent lapses.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-orange-400 my-2">
            {currentStreak} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <span className="text-[11px] text-slate-400">Consistent training momentum</span>
        </div>

        {/* Weekly Goal */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Weekly Goal</span>
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white my-2">
            {weeklyCompletedWorkouts} <span className="text-sm font-normal text-slate-400">/ {weeklyGoalWorkouts}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Status: {habitStatus}</span>
        </div>

        {/* Habit Status */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Habit Adherence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 my-2">
            {habitStatus}
          </div>
          <span className="text-[11px] text-slate-400">High Psychological Momentum</span>
        </div>

        {/* Optimal Window */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Optimal Window</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-white my-2">
            07:00 - 08:30 AM
          </div>
          <span className="text-[11px] text-slate-400">Peak CNS Output Window</span>
        </div>
      </div>

      {/* AI Behavioral Skip Risk Predictor Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Behavioral Skip Risk Diagnostic
              </span>
              <h3 className="text-lg font-bold text-white">Next Session Likeliness &amp; Protection</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Calculated Skip Risk:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(skipRisk)}`}>
              {skipRisk} Risk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 block">Behavioral Pattern Analysis</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {skipRiskReason || 'Fatigue signals and workout regularity indicate low risk of skipping the next session.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-cyan-400 block">Proactive Schedule Recommendation</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {dynamicRecommendation || 'Maintain standard scheduled rest interval. High likelihood of hitting target volume.'}
            </p>
          </div>
        </div>

        {/* Motivational Nudge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 to-slate-950 border border-orange-500/20 flex items-start gap-3">
          <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-orange-300 uppercase">AI Motivational Nudge</span>
            <p className="text-xs text-slate-300 mt-0.5">{motivationalNudge}</p>
          </div>
        </div>
      </div>

      {/* Interactive Weekly Adherence Grid */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Weekly Workout Adherence Log</h3>
            <p className="text-xs text-slate-400">Click any day to toggle your logged training session</p>
          </div>
          <span className="text-xs text-slate-400">
            {weeklyCompletedWorkouts} of {historicalEngagement.length} days logged
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {historicalEngagement.map((item: { day: string; completed: boolean; loggedCalories: boolean }) => {
            const isPending = togglingDay === item.day;
            return (
              <button
                key={item.day}
                disabled={isPending}
                onClick={() => handleToggleHabitDay(item.day, item.completed)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                  item.completed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                    : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-300">{item.day}</span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      item.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-700'
                    }`}
                  />
                </div>

                <div className="mt-auto">
                  <span
                    className={`text-[11px] font-semibold block ${
                      item.completed ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {item.completed ? 'Completed' : 'Rest / Skipped'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.loggedCalories ? 'Macros Logged' : 'No Food Log'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
