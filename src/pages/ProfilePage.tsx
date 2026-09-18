import React, { useState } from 'react';
import {
  User,
  Scale,
  Activity,
  Heart,
  Target,
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, User as UserType } from '../types';
import { api } from '../services/api';

interface ProfilePageProps {
  user: UserType | null;
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, profile, onProfileUpdated }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Recalculate BMI dynamically
  const heightM = formData.heightCm / 100;
  const calculatedBmi = heightM > 0 ? Number((formData.weightKg / (heightM * heightM)).toFixed(1)) : 22.0;

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const calculatedCategory = getBmiCategory(calculatedBmi);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergiesChange = (str: string) => {
    const list = str.split(',').map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, foodAllergies: list }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await api.updateProfile({
        ...formData,
        bmi: calculatedBmi,
        bmiCategory: calculatedCategory
      });
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Biometric Profile &amp; Clinical Assessment
          </span>
          <span className="text-xs text-slate-400">Baseline Health Metrics</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Athlete Profile &amp; Fitness Assessment
        </h1>
        <p className="text-xs text-slate-300">
          This comprehensive biometric assessment calibrates all AI workout intensity curves, macro targets, and form feedback algorithms.
        </p>
      </div>

      {/* Live Biometric Assessment Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BMI Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Real-Time Body Mass Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{calculatedBmi}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {calculatedCategory}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Calculated as {formData.weightKg}kg / ({formData.heightCm}cm / 100)²
          </p>
        </div>

        {/* Target Calorie Projection */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Calibrated Daily Calorie Target</span>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formData.basicCalorieTarget} <span className="text-sm font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            TDEE adjusted for {formData.dailyActivityLevel.replace('_', ' ')}
          </p>
        </div>

        {/* Target Weight Delta */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Body Composition Objective</span>
          <div className="text-3xl font-extrabold text-cyan-400">
            {formData.weightKg} → {formData.targetWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            {formData.fitnessGoal.replace('_', ' ').toUpperCase()} Program
          </p>
        </div>
      </div>

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Biometric Assessment Parameters</h3>
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Profile committed to PostgreSQL database!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Age */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Age (Years)</label>
            <input
              type="number"
              min={14}
              max={95}
              required
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Biological Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Height (cm)</label>
            <input
              type="number"
              min={100}
              max={250}
              required
              value={formData.heightCm}
              onChange={(e) => handleChange('heightCm', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Current Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={300}
              step="0.5"
              required
              value={formData.weightKg}
              onChange={(e) => handleChange('weightKg', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Target Weight */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Target Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={300}
              step="0.5"
              required
              value={formData.targetWeightKg}
              onChange={(e) => handleChange('targetWeightKg', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Fitness Level */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Current Fitness Experience</label>
            <select
              value={formData.fitnessLevel}
              onChange={(e) => handleChange('fitnessLevel', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="beginner">Beginner (&lt; 6 months)</option>
              <option value="intermediate">Intermediate (1 - 3 years)</option>
              <option value="advanced">Advanced (3+ years compound lifting)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Primary Fitness Goal</label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => handleChange('fitnessGoal', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="muscle_gain">Muscle Hypertrophy &amp; Strength</option>
              <option value="weight_loss">Fat Loss &amp; Metabolic Conditioning</option>
              <option value="endurance">Cardiovascular &amp; Muscular Endurance</option>
              <option value="general_fitness">General Longevity &amp; Mobility</option>
            </select>
          </div>

          {/* Workout Preference */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Training Environment</label>
            <select
              value={formData.workoutPreference}
              onChange={(e) => handleChange('workoutPreference', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="gym">Commercial Gym (Barbells &amp; Machines)</option>
              <option value="home">Home Gym (Dumbbells &amp; Bands)</option>
              <option value="calisthenics">Calisthenics &amp; Bodyweight</option>
              <option value="outdoor">Outdoor Running &amp; Cross-Training</option>
            </select>
          </div>

          {/* Available Workout Days */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Available Training Days / Week</label>
            <select
              value={formData.availableWorkoutDays}
              onChange={(e) => handleChange('availableWorkoutDays', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value={2}>2 Days / Week (Full Body Split)</option>
              <option value={3}>3 Days / Week (Push/Pull/Legs)</option>
              <option value={4}>4 Days / Week (Upper/Lower Split)</option>
              <option value={5}>5 Days / Week (Body Part Specialization)</option>
              <option value={6}>6 Days / Week (Intense PPL Split)</option>
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Daily Lifestyle Activity</label>
            <select
              value={formData.dailyActivityLevel}
              onChange={(e) => handleChange('dailyActivityLevel', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="sedentary">Sedentary (Desk Job)</option>
              <option value="lightly_active">Lightly Active (1-3 days active)</option>
              <option value="moderately_active">Moderately Active (Daily walking &amp; work)</option>
              <option value="very_active">Very Active (Construction / Heavy Manual)</option>
            </select>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Dietary Strategy</label>
            <select
              value={formData.dietaryPreference}
              onChange={(e) => handleChange('dietaryPreference', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            >
              <option value="standard">Standard Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>

          {/* Food Allergies */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Food Allergies / Intolerances</label>
            <input
              type="text"
              value={formData.foodAllergies.join(', ')}
              onChange={(e) => handleAllergiesChange(e.target.value)}
              placeholder="e.g. peanuts, dairy, shellfish"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Recalibrating Algorithms...' : 'Save & Recalibrate Metrics'}
          </button>
        </div>
      </form>
    </div>
  );
};
