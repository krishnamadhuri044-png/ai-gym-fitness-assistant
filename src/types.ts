export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness' | 'flexibility';
  targetWeightKg: number;
  dietaryPreference: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean';
  foodAllergies: string[];
  workoutPreference: 'gym' | 'calisthenics' | 'home_dumbbells' | 'hybrid';
  availableWorkoutDays: number;
  dailyActivityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  bmi: number;
  bmiCategory: string;
  recommendedWorkoutDirection: string;
  basicCalorieTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'mobility' | 'core';
  targetMuscles: string[];
  description: string;
  instructions: string[];
  jointAngleTracked: string;
  idealAngleDown: number;
  idealAngleUp: number;
  standardReps: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  exerciseName: string;
  completedReps: number;
  targetReps: number;
  formScore: number;
  durationSeconds: number;
  performanceScore: number;
  breakdown: {
    form: number;
    rangeOfMotion: number;
    consistency: number;
    movementEfficiency: number;
  };
  feedbackLog: string[];
  createdAt: string;
}

export interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  id: string;
  userId: string;
  calorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snacks: MealItem[];
  };
  groceryList: string[];
  dietitianAdvice: string;
  generatedAt: string;
}

export interface CalorieLogItem {
  id: string;
  userId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
}

export interface HabitStatusData {
  currentStreak: number;
  weeklyGoalWorkouts: number;
  weeklyCompletedWorkouts: number;
  habitStatus: 'On Track' | 'At Risk' | 'Needs Attention';
  skipRisk: 'Low' | 'Medium' | 'High';
  skipRiskReason?: string;
  motivationalNudge: string;
  dynamicRecommendation: string;
  historicalEngagement: {
    day: string;
    completed: boolean;
    loggedCalories: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'discouraged' | 'inquisitive';
}

export interface GymFacility {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  equipment: string[];
  facilities: string[];
  recommendedPrograms: string[];
  imageUrl: string;
  pricingTier: 'Budget' | 'Standard' | 'Premium';
}

export interface PlannedWorkoutDay {
  dayName: string;
  focus: string;
  isRest: boolean;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
  }[];
  status: 'pending' | 'completed' | 'skipped';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'habit' | 'cardio';
  durationDays: number;
  targetCount: number;
  userProgress: number;
  isJoined: boolean;
  startDate?: string;
  endDate?: string;
  badge: string;
}

export interface IoTEquipmentData {
  equipmentId: string;
  equipmentName: string;
  resistanceKg: number;
  reps: number;
  heartRateBpm: number;
  powerWatts: number;
  timestamp: string;
  recommendations: {
    resistanceAdjustment: string;
    restSeconds: number;
    intensityVerdict: 'Optimal' | 'High Fatigue' | 'Under-loaded';
    hydrationReminder: boolean;
  };
}

export interface DashboardData {
  user: User;
  profile: UserProfile;
  todayWorkout: {
    title: string;
    focus: string;
    estimatedMinutes: number;
    exerciseCount: number;
    status: 'pending' | 'completed' | 'skipped';
  };
  todayCalories: {
    consumed: number;
    target: number;
    burned: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  weeklyWorkoutCount: number;
  weeklyTargetWorkouts: number;
  currentStreak: number;
  performanceScore: number;
  habitProgress: number;
  weeklyChart: {
    day: string;
    reps: number;
    caloriesBurned: number;
    performance: number;
  }[];
  recentWorkouts: WorkoutSession[];
  aiRecommendations: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalWorkouts: number;
  avgPerformanceScore: number;
  totalCaloriesTracked: number;
  popularExercises: { name: string; count: number; percentage: number }[];
  workoutCompletionRate: number;
  systemHealth: { status: string; uptime: string; apiLatencyMs: number; memoryUsage: string };
}
