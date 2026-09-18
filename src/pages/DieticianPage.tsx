import React, { useState, useEffect } from 'react';
import {
  Apple,
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle2,
  RefreshCw,
  Plus,
  Flame,
  ArrowRight
} from 'lucide-react';
import { DietPlan, UserProfile } from '../types';
import { api } from '../services/api';

interface DieticianPageProps {
  profile: UserProfile;
  onNavigateToCalorieTracker: () => void;
}

export const DieticianPage: React.FC<DieticianPageProps> = ({ profile, onNavigateToCalorieTracker }) => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'grocery' | 'preferences'>('meals');
  const [checkedGrocery, setCheckedGrocery] = useState<Record<string, boolean>>({});

  // Customized preferences form state
  const [goal, setGoal] = useState(profile.fitnessGoal);
  const [dietaryPref, setDietaryPref] = useState(profile.dietaryPreference);
  const [allergiesText, setAllergiesText] = useState(profile.foodAllergies.join(', '));

  useEffect(() => {
    api.getDietPlan().then((plan) => {
      setDietPlan(plan);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleRegeneratePlan = async () => {
    setIsRegenerating(true);
    try {
      const updated = await api.generateDietPlan({
        fitnessGoal: goal,
        dietaryPreference: dietaryPref,
        foodAllergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setDietPlan(updated);
      setActiveTab('meals');
    } catch (err) {
      console.error('Error generating diet plan:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleGroceryItem = (item: string) => {
    setCheckedGrocery((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  if (loading || !dietPlan) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { calorieTarget, macros, meals, groceryList, dietitianAdvice } = dietPlan;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5" /> AI Clinical Sports Dietician
            </span>
            <span className="text-xs text-slate-400">Personalized Macro Blueprint</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Dietician &amp; Meal Planner
          </h1>
          <p className="text-xs text-slate-300">
            Scientifically calibrated to your BMI ({profile.bmi}), body mass ({profile.weightKg}kg), and metabolic expenditure.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToCalorieTracker}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
          >
            Log Calories <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRegeneratePlan}
            disabled={isRegenerating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Analyzing...' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Certified Sports Nutrition Notice:</strong> Generated nutrition information, macros, and suggested meal plans are designed for general athletic fitness optimization and do not constitute formal medical or clinical advice. Consult a healthcare provider for clinical medical conditions.
        </p>
      </div>

      {/* Macro Target Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Target Calories</span>
          <div className="text-2xl font-bold text-white mt-1">
            {calorieTarget} <span className="text-xs text-slate-400 font-normal">kcal</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            Baseline TDEE Adjusted
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Target Protein</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {macros.protein} <span className="text-xs text-slate-400 font-normal">g</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ~{(macros.protein * 4)} kcal (Muscle Synthesis)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Carbohydrates</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {macros.carbs} <span className="text-xs text-slate-400 font-normal">g</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Glycogen &amp; Training Energy
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Healthy Fats</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {macros.fat} <span className="text-xs text-slate-400 font-normal">g</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Hormonal &amp; Joint Health
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('meals')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'meals'
              ? 'border-emerald-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Meal Plan
        </button>
        <button
          onClick={() => setActiveTab('grocery')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'grocery'
              ? 'border-emerald-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Grocery List ({groceryList.length})
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'preferences'
              ? 'border-emerald-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Dietary Settings &amp; Allergies
        </button>
      </div>

      {/* TAB 1: MEAL PLAN */}
      {activeTab === 'meals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakfast */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Breakfast
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {meals.breakfast.reduce((acc, m) => acc + m.calories, 0)} kcal
                </span>
              </div>
              <div className="space-y-2">
                {meals.breakfast.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>{m.name}</span>
                      <span className="text-cyan-400">{m.calories} kcal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Portion: {m.portion}</p>
                    <div className="flex gap-3 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                      <span>P: {m.protein}g</span>
                      <span>C: {m.carbs}g</span>
                      <span>F: {m.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Lunch
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {meals.lunch.reduce((acc, m) => acc + m.calories, 0)} kcal
                </span>
              </div>
              <div className="space-y-2">
                {meals.lunch.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>{m.name}</span>
                      <span className="text-cyan-400">{m.calories} kcal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Portion: {m.portion}</p>
                    <div className="flex gap-3 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                      <span>P: {m.protein}g</span>
                      <span>C: {m.carbs}g</span>
                      <span>F: {m.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Dinner
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {meals.dinner.reduce((acc, m) => acc + m.calories, 0)} kcal
                </span>
              </div>
              <div className="space-y-2">
                {meals.dinner.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>{m.name}</span>
                      <span className="text-cyan-400">{m.calories} kcal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Portion: {m.portion}</p>
                    <div className="flex gap-3 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                      <span>P: {m.protein}g</span>
                      <span>C: {m.carbs}g</span>
                      <span>F: {m.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Snacks */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Fuel &amp; Snacks
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {meals.snacks.reduce((acc, m) => acc + m.calories, 0)} kcal
                </span>
              </div>
              <div className="space-y-2">
                {meals.snacks.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>{m.name}</span>
                      <span className="text-cyan-400">{m.calories} kcal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Portion: {m.portion}</p>
                    <div className="flex gap-3 text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                      <span>P: {m.protein}g</span>
                      <span>C: {m.carbs}g</span>
                      <span>F: {m.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dietitian Advice Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Sports Dietician Performance Strategy
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{dietitianAdvice}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GROCERY LIST */}
      {activeTab === 'grocery' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Smart Grocery Checklist</h3>
            <p className="text-xs text-slate-400">All required whole foods to fuel your weekly macro plan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {groceryList.map((item, idx) => {
              const isChecked = !!checkedGrocery[item];
              return (
                <button
                  key={idx}
                  onClick={() => toggleGroceryItem(item)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-slate-950/80 border-slate-800 text-slate-500 line-through'
                      : 'bg-slate-950/50 hover:bg-slate-850 border-slate-800/90 text-slate-200'
                  }`}
                >
                  <span>{item}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PREFERENCES & ALLERGIES */}
      {activeTab === 'preferences' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">Nutrition Preferences &amp; Target Goal</h3>
            <p className="text-xs text-slate-400">Update preferences and regenerate meal suggestions with Gemini</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Primary Body Composition Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
              >
                <option value="muscle_gain">Muscle Hypertrophy &amp; Strength (+350 kcal)</option>
                <option value="weight_loss">Fat Loss &amp; Definition (-400 kcal deficit)</option>
                <option value="endurance">Endurance &amp; Glycogen Stamina</option>
                <option value="general_fitness">Lean Health &amp; Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Dietary Philosophy</label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
              >
                <option value="standard">Standard Balanced Athletic</option>
                <option value="vegetarian">High-Protein Vegetarian</option>
                <option value="vegan">Plant-Based High-Performance Vegan</option>
                <option value="mediterranean">Mediterranean Heart &amp; Omega-3</option>
                <option value="keto">Ketogenic Low-Carb High-Fat</option>
                <option value="paleo">Paleo Whole Foods</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Known Food Allergies / Dislikes (comma separated)</label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. peanuts, dairy, shellfish"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <button
              onClick={handleRegeneratePlan}
              disabled={isRegenerating}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              Update Preferences &amp; Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
