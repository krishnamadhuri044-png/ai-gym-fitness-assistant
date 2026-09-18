import React from 'react';
import {
  Flame,
  Dumbbell,
  Apple,
  Bot,
  LineChart,
  Utensils,
  Play,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { DashboardData } from '../types';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  data: DashboardData | null;
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ data, onNavigate }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your personalized fitness ecosystem...</p>
        </div>
      </div>
    );
  }

  const { user, profile, todayWorkout, todayCalories, weeklyChart, recentWorkouts, aiRecommendations } = data;

  const quickActions: { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; page: PageId; color: string }[] = [
    { title: 'Start Workout', subtitle: "Execute today's session", icon: Play, page: 'workout-planner', color: 'from-emerald-600 to-teal-500' },
    { title: 'AI Trainer', subtitle: 'Live pose & rep counting', icon: Dumbbell, page: 'ai-trainer', color: 'from-cyan-600 to-blue-600' },
    { title: 'Dietician', subtitle: 'Macro targets & meal plan', icon: Apple, page: 'dietician', color: 'from-green-600 to-emerald-700' },
    { title: 'Gym Buddy', subtitle: 'Chat with AI motivator', icon: Bot, page: 'gym-buddy', color: 'from-purple-600 to-indigo-600' },
    { title: 'Track Calories', subtitle: 'Log today meals', icon: Utensils, page: 'calorie-tracker', color: 'from-amber-600 to-orange-600' },
    { title: 'View Progress', subtitle: 'Detailed analytics', icon: LineChart, page: 'analytics', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/40 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Fitness Intelligence Active
              </span>
              <span className="text-xs text-slate-400">
                Goal: <strong className="text-slate-200 capitalize">{profile.fitnessGoal.replace('_', ' ')}</strong>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              You are currently on a <span className="text-orange-400 font-bold">{data.currentStreak}-day workout streak</span>.
              Your biomechanical performance index is sitting at <span className="text-cyan-400 font-bold">{data.performanceScore}/100</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-trainer')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch AI Trainer
            </button>
            <button
              onClick={() => onNavigate('workout-planner')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all"
            >
              View Plan
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Weight */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Current Weight</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {profile.weightKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Target: {profile.targetWeightKg} kg
          </div>
        </div>

        {/* BMI */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Body Mass Index</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {profile.bmi}
          </div>
          <div className="text-[11px] text-cyan-400 font-medium mt-1 truncate">
            {profile.bmiCategory}
          </div>
        </div>

        {/* Calories Consumed */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Calorie Intake</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {todayCalories.consumed} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            of {todayCalories.target} kcal target
          </div>
        </div>

        {/* Calories Burned */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Calories Burned</span>
          <div className="text-xl sm:text-2xl font-bold text-orange-400 mt-1">
            {todayCalories.burned} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-orange-300/80 mt-1">
            Through workouts
          </div>
        </div>

        {/* Workouts this week */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Weekly Target</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {data.weeklyWorkoutCount} / {data.weeklyTargetWorkouts}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            {data.habitProgress}% completed
          </div>
        </div>

        {/* Performance Score */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Performance Index</span>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1 flex items-baseline gap-1">
            {data.performanceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-cyan-400" /> Pose Biomechanics
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Workout & Calorie Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Card */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Today's Scheduled Routine</span>
                  <h3 className="text-lg font-bold text-white">{todayWorkout.title}</h3>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                {todayWorkout.estimatedMinutes} Mins • {todayWorkout.exerciseCount} Exercises
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-5">
              Focus areas: <span className="text-cyan-300 font-medium">{todayWorkout.focus}</span>. Recommended warmup: 5 minutes mobility and dynamic scapular rotations.
            </p>

            {/* Exercise Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Bodyweight Squats</p>
                  <p className="text-[11px] text-slate-400">4 Sets × 15 Reps</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CV Ready</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Push-Ups</p>
                  <p className="text-[11px] text-slate-400">4 Sets × 12 Reps</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CV Ready</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Bicep Curls</p>
                  <p className="text-[11px] text-slate-400">3 Sets × 12 Reps</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CV Ready</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              Form detection, depth checks &amp; audio chimes active in Trainer.
            </span>
            <button
              onClick={() => onNavigate('ai-trainer')}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
            >
              Start AI Workout Session <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nutritional Coaching Summary */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Nutrition Coach</span>
                  <h3 className="text-base font-bold text-white">Daily Macro Fuel</h3>
                </div>
              </div>
              <button
                onClick={() => onNavigate('calorie-tracker')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
              >
                Log Meal <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Calorie Bar */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Calories: {todayCalories.consumed} kcal</span>
                <span className="text-slate-400">Target: {todayCalories.target} kcal</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayCalories.consumed / todayCalories.target) * 100)}%` }}
                />
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Protein: {todayCalories.proteinGrams}g</span>
                  <span className="text-slate-400">Target: {profile.proteinTargetGrams}g</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, (todayCalories.proteinGrams / profile.proteinTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Carbohydrates: {todayCalories.carbsGrams}g</span>
                  <span className="text-slate-400">Target: {profile.carbsTargetGrams}g</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(100, (todayCalories.carbsGrams / profile.carbsTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Healthy Fats: {todayCalories.fatGrams}g</span>
                  <span className="text-slate-400">Target: {profile.fatTargetGrams}g</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full"
                    style={{ width: `${Math.min(100, (todayCalories.fatGrams / profile.fatTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('dietician')}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              Generate AI Meal Plan &amp; Grocery List
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Fitness Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(action.page)}
                className="group p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between shadow-sm"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Visualizer & AI Coach Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Output &amp; Rep Volume</h3>
              <p className="text-xs text-slate-400">Daily verified repetitions and estimated metabolic output</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Interactive SVG Bar Chart */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {weeklyChart.map((day, idx) => {
              const maxReps = 60;
              const heightPct = Math.max(8, (day.reps / maxReps) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.reps} reps
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg overflow-hidden h-32 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        day.reps > 0
                          ? 'bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-cyan-400 group-hover:to-teal-300'
                          : 'bg-slate-700/30'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                    {day.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Active Training Day
            </span>
            <span>Total Reps Logged: <strong className="text-white">230 Reps</strong></span>
          </div>
        </div>

        {/* AI Smart Recommendations */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Biomechanics Advisor</span>
                <h3 className="text-base font-bold text-white">AI Coach Insights</h3>
              </div>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('gym-buddy')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/30"
            >
              <Bot className="w-4 h-4" />
              Discuss With Gym Buddy (Gemini)
            </button>
          </div>
        </div>
      </div>

      {/* Recent Workout Sessions */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Biomechanical Sessions</h3>
            <p className="text-xs text-slate-400">History of AI-verified exercise repetitions and form feedback</p>
          </div>
          <button
            onClick={() => onNavigate('performance')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Performance Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Exercise</th>
                <th className="pb-3">Reps Verified</th>
                <th className="pb-3">Form Score</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Biomechanics Notes</th>
                <th className="pb-3 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentWorkouts.map((workout) => (
                <tr key={workout.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    {workout.exerciseName}
                  </td>
                  <td className="py-3 text-slate-300">
                    {workout.completedReps} / {workout.targetReps} reps
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                      {workout.formScore}% Form
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {Math.floor(workout.durationSeconds / 60)}m {workout.durationSeconds % 60}s
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">
                    {workout.feedbackLog[0] || 'Good tempo and joint alignment maintained'}
                  </td>
                  <td className="py-3 text-right font-bold text-cyan-300">
                    {workout.performanceScore} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
