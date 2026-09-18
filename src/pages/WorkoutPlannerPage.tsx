import React, { useState } from 'react';
import {
  CalendarCheck,
  Dumbbell,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface WorkoutPlannerPageProps {
  onNavigateToTrainer: () => void;
}

export const WorkoutPlannerPage: React.FC<WorkoutPlannerPageProps> = ({ onNavigateToTrainer }) => {
  const [activeDay, setActiveDay] = useState<number>(3); // 0=Mon, 3=Thu
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({
    'thu-1': true
  });

  const weeklySchedule = [
    {
      dayName: 'Monday',
      title: 'Upper Body Hypertrophy (Chest & Triceps)',
      focus: 'Pectoralis Major, Anterior Deltoids, Triceps',
      duration: '45 mins',
      exercises: [
        { id: 'mon-1', name: 'Standard Push-Ups', sets: '4 Sets', reps: '15 Reps', rest: '60s', cvEnabled: true },
        { id: 'mon-2', name: 'Dumbbell Incline Bench Press', sets: '4 Sets', reps: '10 Reps', rest: '90s', cvEnabled: false },
        { id: 'mon-3', name: 'Overhead Tricep Extensions', sets: '3 Sets', reps: '12 Reps', rest: '60s', cvEnabled: true },
      ]
    },
    {
      dayName: 'Tuesday',
      title: 'Lower Body Strength (Quads & Calves)',
      focus: 'Quadriceps, Adductors, Gastrocnemius',
      duration: '40 mins',
      exercises: [
        { id: 'tue-1', name: 'Bodyweight Squats', sets: '4 Sets', reps: '15 Reps', rest: '90s', cvEnabled: true },
        { id: 'tue-2', name: 'Walking Lunges', sets: '3 Sets', reps: '12 Reps/leg', rest: '60s', cvEnabled: true },
        { id: 'tue-3', name: 'Standing Calf Raises', sets: '4 Sets', reps: '20 Reps', rest: '45s', cvEnabled: false },
      ]
    },
    {
      dayName: 'Wednesday',
      title: 'Active Recovery & Core Alignment',
      focus: 'Core Stabilization & Hip Mobility',
      duration: '25 mins',
      exercises: [
        { id: 'wed-1', name: 'Forearm Planks', sets: '3 Sets', reps: '60 Secs', rest: '45s', cvEnabled: false },
        { id: 'wed-2', name: 'Deadbugs', sets: '3 Sets', reps: '12 Reps/side', rest: '45s', cvEnabled: true },
        { id: 'wed-3', name: 'Cat-Cow Dynamic Stretches', sets: '2 Sets', reps: '15 Reps', rest: '30s', cvEnabled: false },
      ]
    },
    {
      dayName: 'Thursday (Today)',
      title: 'Pull & Arm Hypertrophy (Back & Biceps)',
      focus: 'Latissimus Dorsi, Biceps Brachii, Rear Deltoids',
      duration: '35 mins',
      exercises: [
        { id: 'thu-1', name: 'Dumbbell Bicep Curls', sets: '4 Sets', reps: '12 Reps', rest: '60s', cvEnabled: true },
        { id: 'thu-2', name: 'Bent-Over Dumbbell Rows', sets: '4 Sets', reps: '10 Reps', rest: '90s', cvEnabled: false },
        { id: 'thu-3', name: 'Overhead Shoulder Press', sets: '3 Sets', reps: '10 Reps', rest: '75s', cvEnabled: true },
      ]
    },
    {
      dayName: 'Friday',
      title: 'Lower Posterior Chain & Glutes',
      focus: 'Hamstrings, Gluteus Maximus, Erectors',
      duration: '45 mins',
      exercises: [
        { id: 'fri-1', name: 'Bodyweight Deep Squats', sets: '4 Sets', reps: '15 Reps', rest: '90s', cvEnabled: true },
        { id: 'fri-2', name: 'Romanian Dumbbell Deadlifts', sets: '4 Sets', reps: '10 Reps', rest: '90s', cvEnabled: false },
        { id: 'fri-3', name: 'Bulgarian Split Squats', sets: '3 Sets', reps: '10 Reps/leg', rest: '60s', cvEnabled: true },
      ]
    },
    {
      dayName: 'Saturday',
      title: 'Full Body HIIT Conditioning',
      focus: 'Metabolic Conditioning & VO2 Max',
      duration: '30 mins',
      exercises: [
        { id: 'sat-1', name: 'Push-Up to Burpee Combo', sets: '4 Sets', reps: '10 Reps', rest: '45s', cvEnabled: true },
        { id: 'sat-2', name: 'Jump Squats', sets: '4 Sets', reps: '15 Reps', rest: '45s', cvEnabled: true },
        { id: 'sat-3', name: 'Mountain Climbers', sets: '4 Sets', reps: '30 Secs', rest: '30s', cvEnabled: false },
      ]
    },
    {
      dayName: 'Sunday',
      title: 'Full Rest & Cellular Recovery',
      focus: 'Hydration, Glycogen Replenishment & Sleep',
      duration: 'Rest Day',
      exercises: []
    }
  ];

  const currentRoutine = weeklySchedule[activeDay];

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" /> Progressive Overload Periodization
            </span>
            <span className="text-xs text-slate-400">Weekly Split Routine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Workout Planner &amp; Split Routine
          </h1>
          <p className="text-xs text-slate-300">
            Scientifically planned hypertrophy split with built-in MediaPipe CV support for key compound lifts.
          </p>
        </div>

        <button
          onClick={onNavigateToTrainer}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          Launch AI Trainer with Camera
        </button>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {weeklySchedule.map((item, idx) => {
          const active = activeDay === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-start ${
                active
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold uppercase opacity-80">{item.dayName.split(' ')[0]}</span>
              <span className="font-bold">{item.exercises.length > 0 ? `${item.exercises.length} Exercises` : 'Rest'}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Routine Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{currentRoutine.dayName}</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{currentRoutine.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Muscle Target: <span className="text-slate-200">{currentRoutine.focus}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
              {currentRoutine.duration}
            </span>
          </div>
        </div>

        {/* Exercises List */}
        {currentRoutine.exercises.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-cyan-400" />
            <h4 className="text-base font-bold text-white">Full Recovery Day</h4>
            <p className="text-xs max-w-sm mx-auto">
              Your muscles synthesize protein and adapt during rest. Drink 3L of water, hit your macro goals, and sleep at least 8 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentRoutine.exercises.map((ex, index) => {
              const isDone = !!completedExercises[ex.id];
              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExercise(ex.id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-700 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{ex.name}</span>
                        {ex.cvEnabled && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            MediaPipe Vision
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{ex.sets}</span>
                        <span>•</span>
                        <span>{ex.reps}</span>
                        <span>•</span>
                        <span>Rest: {ex.rest}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ex.cvEnabled && (
                      <button
                        onClick={onNavigateToTrainer}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3" /> Train with AI
                      </button>
                    )}
                    <button
                      onClick={() => toggleExercise(ex.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      {isDone ? 'Mark Incomplete' : 'Complete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
