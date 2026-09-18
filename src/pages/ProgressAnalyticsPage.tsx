import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Activity,
  Award,
  Calendar,
  Zap,
  Flame,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const ProgressAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  // Chart data for 7-day view
  const performanceData7d = [
    { day: 'Mon', score: 91, reps: 45, caloriesBurned: 380, weight: 74.4 },
    { day: 'Tue', score: 88, reps: 38, caloriesBurned: 340, weight: 74.3 },
    { day: 'Wed', score: 0, reps: 0, caloriesBurned: 160, weight: 74.2 },
    { day: 'Thu', score: 89, reps: 42, caloriesBurned: 410, weight: 74.1 },
    { day: 'Fri', score: 94, reps: 50, caloriesBurned: 460, weight: 74.0 },
    { day: 'Sat', score: 85, reps: 20, caloriesBurned: 220, weight: 73.9 },
    { day: 'Sun', score: 87, reps: 35, caloriesBurned: 310, weight: 74.0 }
  ];

  const calorieBalanceData = [
    { day: 'Mon', consumed: 2350, burned: 2420 },
    { day: 'Tue', consumed: 2410, burned: 2390 },
    { day: 'Wed', consumed: 2200, burned: 2100 },
    { day: 'Thu', consumed: 2450, burned: 2510 },
    { day: 'Fri', consumed: 2500, burned: 2600 },
    { day: 'Sat', consumed: 2300, burned: 2250 },
    { day: 'Sun', consumed: 2380, burned: 2340 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <LineChartIcon className="w-3.5 h-3.5" /> Longitudinal Analytics
            </span>
            <span className="text-xs text-slate-400">Recharts Telemetry Graphs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Progress &amp; Biomechanical Analytics
          </h1>
          <p className="text-xs text-slate-300">
            Long-term trends across movement quality, total volume workload, and caloric expenditure balance.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === '7d' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === '30d' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === '90d' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biomechanical Performance Trend */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Form &amp; Performance Score Trend</h3>
              <p className="text-xs text-slate-400">Average joint angle score and kinematic score out of 100</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">Avg: 88.7</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" textAnchor="middle" fontSize={11} />
                <YAxis stroke="#64748b" domain={[60, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Performance Score"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep Volume & Workout Output */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daily Repetition Volume</h3>
              <p className="text-xs text-slate-400">Total validated AI-tracked exercise reps</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">230 Reps</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="reps" name="Reps Verified" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caloric Intake vs Expenditure */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Metabolic Balance (Consumed vs Burned)</h3>
              <p className="text-xs text-slate-400">Comparison of daily dietary input against total TDEE burn</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">Net Deficit: ~60 kcal/d</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[1500, 3000]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="consumed" name="Intake (kcal)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="burned" name="Expenditure (kcal)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Weight Progression */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weight Stability Curve</h3>
              <p className="text-xs text-slate-400">Lean mass tracking toward 78.0 kg target</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">74.0 kg</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[73, 76]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
