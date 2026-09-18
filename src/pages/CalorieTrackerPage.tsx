import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  PieChart,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { CalorieLogItem, UserProfile } from '../types';
import { api } from '../services/api';

interface CalorieTrackerPageProps {
  profile: UserProfile;
}

export const CalorieTrackerPage: React.FC<CalorieTrackerPageProps> = ({ profile }) => {
  const [logs, setLogs] = useState<CalorieLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New food entry state
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset foods
  const quickPresets = [
    { name: 'Grilled Chicken Breast (200g)', calories: 330, protein: 62, carbs: 0, fat: 7, mealType: 'lunch' as const },
    { name: 'Whey Protein Shake with Water', calories: 130, protein: 25, carbs: 3, fat: 2, mealType: 'snack' as const },
    { name: 'Oatmeal with Almond Milk & Banana', calories: 350, protein: 12, carbs: 65, fat: 6, mealType: 'breakfast' as const },
    { name: 'Salmon Fillet with Jasmine Rice', calories: 620, protein: 42, carbs: 60, fat: 22, mealType: 'dinner' as const },
    { name: '0% Greek Yogurt Cup (170g)', calories: 100, protein: 18, carbs: 6, fat: 0, mealType: 'snack' as const }
  ];

  const fetchLogs = async () => {
    try {
      const data = await api.getCalorieLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching calorie logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    setIsSubmitting(true);
    try {
      const item = await api.logCalories({
        foodName,
        mealType,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
      });

      setLogs((prev) => [item, ...prev]);
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    } catch (err) {
      console.error('Error logging food:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setFoodName(preset.name);
    setCalories(preset.calories);
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setFat(preset.fat);
    setMealType(preset.mealType);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await api.deleteCalorieLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting calorie log:', err);
    }
  };

  const totalCalories = logs.reduce((acc, l) => acc + l.calories, 0);
  const totalProtein = logs.reduce((acc, l) => acc + l.protein, 0);
  const totalCarbs = logs.reduce((acc, l) => acc + l.carbs, 0);
  const totalFat = logs.reduce((acc, l) => acc + l.fat, 0);

  const calorieTarget = profile.basicCalorieTarget || 2400;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" /> Nutritional Intake Tracker
          </span>
          <span className="text-xs text-slate-400">Daily Calorie &amp; Macro Coach</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Calorie &amp; Macronutrient Coach
        </h1>
        <p className="text-xs text-slate-300">
          Track meals, review nutritional balance, and hit your daily energy expenditure requirements.
        </p>
      </div>

      {/* Target Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Calories</span>
            <span className="text-white font-bold">{totalCalories} / {calorieTarget} kcal</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalCalories / calorieTarget) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {calorieTarget - totalCalories > 0
              ? `${calorieTarget - totalCalories} kcal remaining today`
              : `${totalCalories - calorieTarget} kcal surplus reached`}
          </span>
        </div>

        {/* Protein Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Protein</span>
            <span className="text-cyan-400 font-bold">{totalProtein} / {profile.proteinTargetGrams} g</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalProtein / profile.proteinTargetGrams) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {Math.round((totalProtein / profile.proteinTargetGrams) * 100)}% of target
          </span>
        </div>

        {/* Carbs Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Carbohydrates</span>
            <span className="text-amber-400 font-bold">{totalCarbs} / {profile.carbsTargetGrams} g</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalCarbs / profile.carbsTargetGrams) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {Math.round((totalCarbs / profile.carbsTargetGrams) * 100)}% of target
          </span>
        </div>

        {/* Fat Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Fat</span>
            <span className="text-rose-400 font-bold">{totalFat} / {profile.fatTargetGrams} g</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalFat / profile.fatTargetGrams) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {Math.round((totalFat / profile.fatTargetGrams) * 100)}% of target
          </span>
        </div>
      </div>

      {/* Manual Food Add Form & Quick Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Food &amp; Nutrient Entry</h3>
          </div>

          <form onSubmit={handleAddLog} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Breast, Rice, etc."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Calories (kcal) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={calories}
                  onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="kcal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  min={0}
                  value={protein}
                  onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="grams"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  min={0}
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="grams"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  min={0}
                  value={fat}
                  onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="grams"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-950 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Food to Daily Log
            </button>
          </form>
        </div>

        {/* Quick Presets (1 Col) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Athletic Presets</h3>
          </div>
          <p className="text-xs text-slate-400">Click to autofill frequent fitness staples:</p>

          <div className="space-y-2">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800/80 text-left text-xs transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-cyan-300">{preset.name}</p>
                  <p className="text-[10px] text-slate-400">
                    P: {preset.protein}g • C: {preset.carbs}g • F: {preset.fat}g
                  </p>
                </div>
                <span className="font-mono text-cyan-400 font-bold">{preset.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Logged Food List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Today's Logged Nutrition Items</h3>
          <span className="text-xs text-slate-400">{logs.length} items logged</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No food items logged for today yet. Use the form above or pick a quick preset.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Food Item</th>
                  <th className="pb-3">Meal Category</th>
                  <th className="pb-3">Protein</th>
                  <th className="pb-3">Carbs</th>
                  <th className="pb-3">Fat</th>
                  <th className="pb-3">Calories</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-semibold text-white">{item.foodName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 capitalize font-medium">
                        {item.mealType}
                      </span>
                    </td>
                    <td className="py-3 text-cyan-400 font-mono">{item.protein}g</td>
                    <td className="py-3 text-amber-400 font-mono">{item.carbs}g</td>
                    <td className="py-3 text-rose-400 font-mono">{item.fat}g</td>
                    <td className="py-3 font-bold text-white">{item.calories} kcal</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteLog(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
