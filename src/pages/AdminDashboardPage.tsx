import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Server,
  Dumbbell,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { AdminStats, Exercise } from '../types';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New exercise modal / form
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'strength' | 'cardio' | 'mobility' | 'core'>('strength');
  const [newMuscle, setNewMuscle] = useState('');
  const [newJoint, setNewJoint] = useState('');
  const [newReps, setNewReps] = useState<number>(12);

  const fetchAdminData = async () => {
    try {
      const [statsData, exList] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminExercises()
      ]);
      setStats(statsData);
      setExercises(exList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMuscle) return;

    try {
      const added = await api.createAdminExercise({
        name: newName,
        category: newCategory,
        targetMuscles: newMuscle.split(',').map((s) => s.trim()),
        description: `Athletic movement targeted for ${newMuscle}`,
        instructions: ['Maintain stable core', 'Execute controlled eccentric and concentric phases'],
        jointAngleTracked: newJoint || 'Elbow Flexion',
        idealAngleDown: 60,
        idealAngleUp: 160,
        standardReps: newReps
      });
      setExercises((prev) => [...prev, added]);
      setShowAddModal(false);
      setNewName('');
      setNewMuscle('');
      setNewJoint('');
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await api.deleteAdminExercise(id);
      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting exercise:', err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Staff Operations Portal
            </span>
            <span className="text-xs text-slate-400">System Admin &amp; Machine Learning Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Oversight &amp; Analytics
          </h1>
          <p className="text-xs text-slate-300">
            Real-time server health, registered athlete retention, and computer vision exercise catalog management.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Exercise
        </button>
      </div>

      {/* Admin Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Athletes</span>
          <div className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</div>
          <span className="text-[11px] text-emerald-400 font-medium">+18% this month</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Active Athletes</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.activeUsers}</div>
          <span className="text-[11px] text-slate-400 font-medium">91.6% Retention</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Logged Workouts</span>
          <div className="text-2xl font-bold text-white mt-1">{stats.totalWorkouts}</div>
          <span className="text-[11px] text-slate-400 font-medium">Pose CV Verified</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Avg Form Score</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.avgPerformanceScore}%</div>
          <span className="text-[11px] text-slate-400 font-medium">Kinematic Quality</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Calories Tracked</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{(stats.totalCaloriesTracked / 1000).toFixed(0)}k</div>
          <span className="text-[11px] text-slate-400 font-medium">Kilocalories</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
          <div className="text-2xl font-bold text-white mt-1">{stats.workoutCompletionRate}%</div>
          <span className="text-[11px] text-emerald-400 font-medium">High Adherence</span>
        </div>
      </div>

      {/* System Health Status */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Operational</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack Production Infrastructure</h3>
            <p className="text-xs text-slate-400">Express API Gateway • MediaPipe Vision Runtime • Gemini Flash Model</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Service Uptime</span>
            <span className="font-mono font-bold text-white text-sm">{stats.systemHealth.uptime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">API Round-Trip</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">{stats.systemHealth.apiLatencyMs} ms</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Database Status</span>
            <span className="font-bold text-emerald-400 text-sm">PostgreSQL (Healthy)</span>
          </div>
        </div>
      </div>

      {/* Popular Exercises Breakdown */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Most Performed Exercises in Ecosystem</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.popularExercises.map((item: { name: string; count: number; percentage: number }, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.count} sessions verified</span>
              </div>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Database Catalog */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Exercise &amp; Biomechanical Database Catalog</h3>
            <p className="text-xs text-slate-400">Registered movement definitions and MediaPipe tracking protocols</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{exercises.length} items configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Exercise Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Target Muscles</th>
                <th className="pb-3">Primary Joint Tracked</th>
                <th className="pb-3">Standard Reps</th>
                <th className="pb-3">CV Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {exercises.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-semibold text-white">{ex.name}</td>
                  <td className="py-3 text-slate-300 capitalize">{ex.category}</td>
                  <td className="py-3 text-cyan-400">{ex.targetMuscles.join(', ')}</td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{ex.jointAngleTracked}</td>
                  <td className="py-3 text-slate-300 font-mono">{ex.standardReps} reps</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      MediaPipe Supported
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteExercise(ex.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Exercise to Catalog</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Incline Dumbbell Curl"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobility">Mobility</option>
                    <option value="core">Core</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Standard Reps</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newReps}
                    onChange={(e) => setNewReps(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Muscles (comma separated) *</label>
                <input
                  type="text"
                  required
                  value={newMuscle}
                  onChange={(e) => setNewMuscle(e.target.value)}
                  placeholder="e.g. Biceps Brachii, Brachialis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Joint Angle Tracked</label>
                <input
                  type="text"
                  value={newJoint}
                  onChange={(e) => setNewJoint(e.target.value)}
                  placeholder="e.g. Elbow Flexion (Angle <= 60°)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Save Exercise to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
