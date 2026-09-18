import React, { useState, useEffect } from 'react';
import {
  Activity,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Dumbbell,
  FileText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';

export const PerformanceAnalyzerPage: React.FC = () => {
  const [report, setReport] = useState<{
    weeklyAverageScore: number;
    breakdown: { form: number; rangeOfMotion: number; consistency: number; movementEfficiency: number };
    totalRepsCompleted: number;
    totalMinutesTrained: number;
    weeklyHistory: { date: string; score: number; reps: number; duration: number }[];
    recommendations: string[];
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getPerformanceReport().then((data) => {
      setReport(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { weeklyAverageScore, breakdown, totalRepsCompleted, totalMinutesTrained, weeklyHistory, recommendations } = report;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            Biomechanical Diagnostics
          </span>
          <span className="text-xs text-slate-400">Weekly Performance Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Pose-to-Performance Analyzer
        </h1>
        <p className="text-xs text-slate-300">
          Synthesizes frame-by-frame joint angles, rep velocity curves, and eccentric/concentric consistency.
        </p>
      </div>

      {/* Main Score & Metric Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-slate-400">Composite Biometric Score</span>
              <Award className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-cyan-400/40 flex flex-col items-center justify-center bg-cyan-500/5">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{weeklyAverageScore}</span>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">/ 100</span>
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-white mt-3">Elite Biomechanical Rating</h3>
              <p className="text-xs text-slate-400 mt-1">
                +4.2% improvement over last 7 days of training.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60">
              <span className="text-slate-400 block text-[10px] uppercase">Total Reps</span>
              <span className="font-bold text-white text-base">{totalRepsCompleted}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60">
              <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
              <span className="font-bold text-emerald-400 text-base">{totalMinutesTrained}m</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Four Pillars of Movement Quality</h3>
            <p className="text-xs text-slate-400">Real-time kinematic scoring criteria</p>
          </div>

          <div className="space-y-4">
            {/* Form Quality */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Form &amp; Alignment Score
                </span>
                <span className="text-cyan-400 font-bold">{breakdown.form} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${breakdown.form}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Measures knee-valgus tracking, lumbar spine neutral posture, and scapular retraction.
              </p>
            </div>

            {/* Range of Motion */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Range of Motion (ROM)
                </span>
                <span className="text-emerald-400 font-bold">{breakdown.rangeOfMotion} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${breakdown.rangeOfMotion}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluates maximum joint flexion angle against gold-standard anatomical benchmarks.
              </p>
            </div>

            {/* Rep Consistency */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Cadence &amp; Consistency
                </span>
                <span className="text-purple-400 font-bold">{breakdown.consistency} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${breakdown.consistency}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluates time-under-tension regularity from the first repetition to final eccentric failure.
              </p>
            </div>

            {/* Movement Efficiency */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Movement Efficiency
                </span>
                <span className="text-amber-400 font-bold">{breakdown.movementEfficiency} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${breakdown.movementEfficiency}%` }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Detects unforced parasitic movements, barbell sway, or jerky momentum cheating.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Reports Table & Timeline */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Weekly Performance Reports &amp; Log</h3>
            <p className="text-xs text-slate-400">Historic sessions evaluated by the Pose-to-Performance engine</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
            Progress Trending: +6.8%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Session Date</th>
                <th className="pb-3">Reps Verified</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Consistency Grade</th>
                <th className="pb-3 text-right">Performance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {weeklyHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {item.date} Session
                  </td>
                  <td className="py-3 text-slate-300">{item.reps} reps</td>
                  <td className="py-3 text-slate-400">{item.duration} mins</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-medium">
                      {item.score >= 90 ? 'Grade A (Optimal)' : 'Grade B+ (Good)'}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-white">
                    <span className="text-cyan-300">{item.score}</span> / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Biomechanical Coach Insights */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Biomechanical Diagnostic Notes</h3>
            <p className="text-xs text-slate-400">Automated feedback generated from joint angle analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.map((note, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Insight #{idx + 1}</span>
              <p className="leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
