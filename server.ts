import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK lazily if key is provided
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// In-memory Database with persistent seed data for user and admin
interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  profile: any;
  workouts: any[];
  calorieLogs: any[];
  habitData: any;
  dietPlan: any;
  challenges: any[];
}

const db = {
  users: new Map<string, DbUser>(),
  exercises: [
    {
      id: 'ex-1',
      name: 'Bodyweight Squats',
      category: 'strength',
      targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
      description: 'Foundational lower-body compound exercise. Lower hips until thighs are parallel to the ground.',
      instructions: [
        'Stand with feet shoulder-width apart, toes pointed slightly outward.',
        'Hinge at hips and bend knees, pushing knees outward aligned with toes.',
        'Lower until hip joint is below or parallel with knee caps.',
        'Drive through whole foot to return to starting position.'
      ],
      jointAngleTracked: 'Hip-Knee-Ankle',
      idealAngleDown: 90,
      idealAngleUp: 170,
      standardReps: 15
    },
    {
      id: 'ex-2',
      name: 'Standard Push-Ups',
      category: 'strength',
      targetMuscles: ['Chest', 'Triceps', 'Anterior Deltoids', 'Core'],
      description: 'Upper-body pushing movement developing chest power and core stability.',
      instructions: [
        'Place hands slightly wider than shoulder width on the floor.',
        'Maintain a straight rigid plank line from crown of head to heels.',
        'Lower chest until elbows reach 90 degrees or chest is fist-width off floor.',
        'Press floor away aggressively to full arm extension.'
      ],
      jointAngleTracked: 'Shoulder-Elbow-Wrist',
      idealAngleDown: 85,
      idealAngleUp: 165,
      standardReps: 12
    },
    {
      id: 'ex-3',
      name: 'Dumbbell Bicep Curls',
      category: 'strength',
      targetMuscles: ['Biceps Brachii', 'Brachialis'],
      description: 'Isolation exercise targeting arm flexion and hypertrophy.',
      instructions: [
        'Stand upright with dumbbells at sides, palms facing forward.',
        'Pin elbows tightly to your ribcage to prevent momentum swinging.',
        'Curl weights upward towards shoulders while contracting biceps.',
        'Lower dumbbells under controlled eccentric tempo.'
      ],
      jointAngleTracked: 'Shoulder-Elbow-Wrist',
      idealAngleDown: 160,
      idealAngleUp: 50,
      standardReps: 12
    },
    {
      id: 'ex-4',
      name: 'Walking Lunges',
      category: 'strength',
      targetMuscles: ['Glutes', 'Hamstrings', 'Quads'],
      description: 'Unilateral movement correcting muscular imbalances and knee tracking.',
      instructions: [
        'Step forward with lead leg, landing heel first.',
        'Lower body until front thigh is parallel to ground and back knee nears floor.',
        'Keep torso upright and front knee stacked directly over ankle.',
        'Push off front foot to step through into the next rep.'
      ],
      jointAngleTracked: 'Hip-Knee-Ankle',
      idealAngleDown: 90,
      idealAngleUp: 165,
      standardReps: 10
    },
    {
      id: 'ex-5',
      name: 'Overhead Shoulder Press',
      category: 'strength',
      targetMuscles: ['Deltoids', 'Trapezius', 'Triceps'],
      description: 'Vertical pressing movement for overhead strength and shoulder health.',
      instructions: [
        'Hold weights at shoulder height with elbows slightly forward of body.',
        'Brace core and glutes to avoid hyperextending the lumbar spine.',
        'Press weights straight up overhead to full elbow lockout.',
        'Lower with control back to clavicle level.'
      ],
      jointAngleTracked: 'Shoulder-Elbow-Wrist',
      idealAngleDown: 85,
      idealAngleUp: 170,
      standardReps: 10
    }
  ],
  gyms: [
    {
      id: 'gym-1',
      name: 'Iron Forge Athletic Club',
      address: '450 Metro Boulevard, Downtown',
      distanceKm: 1.2,
      rating: 4.9,
      reviewsCount: 384,
      openingHours: '24/7 Access',
      equipment: ['Eleiko Olympic Plates', 'Power Racks', 'Turf Sled Track', 'Dumbbells to 60kg'],
      facilities: ['Sauna', 'Cold Plunge', 'Physiotherapy Suite', 'Smoothie Bar'],
      recommendedPrograms: ['Hypertrophy Block', 'Olympic Weightlifting'],
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      pricingTier: 'Premium'
    },
    {
      id: 'gym-2',
      name: 'Pulse Peak Performance Center',
      address: '128 Tech Park Way, Northside',
      distanceKm: 2.8,
      rating: 4.7,
      reviewsCount: 219,
      openingHours: '05:00 - 23:00',
      equipment: ['Smart Resistance Cables', 'Woodway Treadmills', 'Kettlebell Sanctuary'],
      facilities: ['Locker Rooms', 'Steam Room', 'Recovery Lounge'],
      recommendedPrograms: ['High Intensity Functional', 'VO2 Max Conditioning'],
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
      pricingTier: 'Standard'
    },
    {
      id: 'gym-3',
      name: 'Velocity Fitness & Calisthenics Hub',
      address: '77 Riverside Drive, Waterfront',
      distanceKm: 3.5,
      rating: 4.8,
      reviewsCount: 152,
      openingHours: '06:00 - 22:00',
      equipment: ['Parallettes & Rings', 'Monkey Bars', 'Plyo Boxes', 'Assault Bikes'],
      facilities: ['Outdoor Rig', 'Locker Room', 'Showers'],
      recommendedPrograms: ['Bodyweight Mastery', 'Core Dynamics'],
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      pricingTier: 'Budget'
    }
  ],
  challenges: [
    {
      id: 'ch-1',
      title: '7-Day Workout Consistency Challenge',
      description: 'Complete a workout session every day for 7 consecutive days to cement atomic fitness habits.',
      category: 'habit',
      durationDays: 7,
      targetCount: 7,
      userProgress: 5,
      isJoined: true,
      badge: 'Consistency Champion'
    },
    {
      id: 'ch-2',
      title: '30-Day Squat Mastery Challenge',
      description: 'Accumulate 1,000 verified AI Trainer squats with proper depth and knee alignment.',
      category: 'strength',
      durationDays: 30,
      targetCount: 1000,
      userProgress: 420,
      isJoined: true,
      badge: 'Leg Day Titan'
    },
    {
      id: 'ch-3',
      title: '10K Daily Steps & Cardio Sprint',
      description: 'Maintain an active calorie output over 400 kcal per day for two weeks.',
      category: 'cardio',
      durationDays: 14,
      targetCount: 14,
      userProgress: 8,
      isJoined: false,
      badge: 'Endurance Beast'
    }
  ],
  iotEquipment: {
    equipmentId: 'SMART-LEG-PRESS-04',
    equipmentName: 'Smart Leg Press 45°',
    resistanceKg: 75,
    reps: 12,
    heartRateBpm: 134,
    powerWatts: 420,
    timestamp: new Date().toISOString(),
    recommendations: {
      resistanceAdjustment: 'Optimal load detected. Velocity was sustained across rep 1-10.',
      restSeconds: 90,
      intensityVerdict: 'Optimal',
      hydrationReminder: false
    }
  }
};

// Seed Default User (Alex Rivera)
const defaultUser: DbUser = {
  id: 'user-alex-1',
  name: 'Alex Rivera',
  email: 'alex@aigym.com',
  passwordHash: 'user123',
  role: 'USER',
  createdAt: '2026-02-15T08:00:00.000Z',
  profile: {
    age: 27,
    gender: 'male',
    heightCm: 178,
    weightKg: 74,
    fitnessLevel: 'intermediate',
    fitnessGoal: 'muscle_gain',
    targetWeightKg: 78,
    dietaryPreference: 'standard',
    foodAllergies: ['peanuts'],
    workoutPreference: 'gym',
    availableWorkoutDays: 4,
    dailyActivityLevel: 'moderately_active',
    bmi: 23.4,
    bmiCategory: 'Normal Weight',
    recommendedWorkoutDirection: 'Hypertrophy Upper/Lower Split with Progressive Overload',
    basicCalorieTarget: 2450,
    proteinTargetGrams: 165,
    carbsTargetGrams: 280,
    fatTargetGrams: 65
  },
  workouts: [
    {
      id: 'ws-1',
      userId: 'user-alex-1',
      exerciseName: 'Bodyweight Squats',
      completedReps: 15,
      targetReps: 15,
      formScore: 92,
      durationSeconds: 140,
      performanceScore: 90,
      breakdown: { form: 92, rangeOfMotion: 90, consistency: 88, movementEfficiency: 90 },
      feedbackLog: ['Great depth achieved', 'Knees aligned with toes throughout entire set'],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'ws-2',
      userId: 'user-alex-1',
      exerciseName: 'Standard Push-Ups',
      completedReps: 14,
      targetReps: 15,
      formScore: 88,
      durationSeconds: 110,
      performanceScore: 86,
      breakdown: { form: 88, rangeOfMotion: 85, consistency: 84, movementEfficiency: 87 },
      feedbackLog: ['Elbows tucked well', 'Slight hip sag on rep 12'],
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  calorieLogs: [
    { id: 'cl-1', userId: 'user-alex-1', foodName: 'Oatmeal with Blueberries & Whey Protein', mealType: 'breakfast', calories: 480, protein: 38, carbs: 62, fat: 8, loggedAt: new Date().toISOString() },
    { id: 'cl-2', userId: 'user-alex-1', foodName: 'Grilled Chicken Breast, Brown Rice & Broccoli', mealType: 'lunch', calories: 650, protein: 55, carbs: 70, fat: 12, loggedAt: new Date().toISOString() },
    { id: 'cl-3', userId: 'user-alex-1', foodName: 'Greek Yogurt & Almonds', mealType: 'snack', calories: 240, protein: 20, carbs: 12, fat: 14, loggedAt: new Date().toISOString() }
  ],
  habitData: {
    currentStreak: 6,
    weeklyGoalWorkouts: 4,
    weeklyCompletedWorkouts: 3,
    habitStatus: 'On Track',
    skipRisk: 'Low',
    motivationalNudge: "You are on a 6-day consistency streak! Today's session will hit your weekly goal target.",
    dynamicRecommendation: 'Target a moderate intensity session today to preserve neuromuscular recovery.',
    historicalEngagement: [
      { day: 'Mon', completed: true, loggedCalories: true },
      { day: 'Tue', completed: true, loggedCalories: true },
      { day: 'Wed', completed: false, loggedCalories: true },
      { day: 'Thu', completed: true, loggedCalories: true },
      { day: 'Fri', completed: true, loggedCalories: true },
      { day: 'Sat', completed: false, loggedCalories: false },
      { day: 'Sun', completed: true, loggedCalories: true }
    ]
  },
  dietPlan: {
    id: 'dp-alex-1',
    userId: 'user-alex-1',
    calorieTarget: 2450,
    macros: { protein: 165, carbs: 280, fat: 65 },
    meals: {
      breakfast: [
        { id: 'm-1', name: 'Rolled Oats with Berries & Whey Protein Isolate', portion: '1 bowl (80g oats, 30g whey)', calories: 480, protein: 38, carbs: 65, fat: 8 }
      ],
      lunch: [
        { id: 'm-2', name: 'Char-Grilled Chicken Breast, Steamed Jasmine Rice & Steamed Broccoli', portion: '1 plate (200g chicken, 150g rice)', calories: 680, protein: 56, carbs: 78, fat: 14 }
      ],
      dinner: [
        { id: 'm-3', name: 'Pan-Seared Wild Salmon Fillet, Roasted Sweet Potatoes & Asparagus', portion: '1 serving (180g salmon, 200g sweet potato)', calories: 720, protein: 46, carbs: 62, fat: 28 }
      ],
      snacks: [
        { id: 'm-4', name: '0% Fat Greek Yogurt with Chia Seeds & Sliced Banana', portion: '1 cup (200g yogurt)', calories: 260, protein: 22, carbs: 32, fat: 5 },
        { id: 'm-5', name: 'Rice Cakes with Crushed Walnuts', portion: '2 cakes + 15g walnuts', calories: 210, protein: 6, carbs: 26, fat: 10 }
      ]
    },
    groceryList: [
      'Rolled Oats (1kg)',
      'Whey Protein Isolate (Vanilla)',
      'Chicken Breasts (1.5kg)',
      'Wild Salmon Fillets (800g)',
      'Jasmine Rice & Sweet Potatoes',
      'Fresh Broccoli, Asparagus & Blueberries',
      '0% Fat Plain Greek Yogurt',
      'Raw Walnuts & Chia Seeds'
    ],
    dietitianAdvice: 'Hydrate with at least 3.0 Liters of water daily. Consume 30g of protein within 90 minutes post-workout for optimal muscle protein synthesis.',
    generatedAt: new Date().toISOString()
  },
  challenges: ['ch-1', 'ch-2']
};

// Seed Admin (Coach Marcus)
const defaultAdmin: DbUser = {
  id: 'admin-marcus-1',
  name: 'Coach Marcus (Admin)',
  email: 'admin@aigym.com',
  passwordHash: 'admin123',
  role: 'ADMIN',
  createdAt: '2026-01-01T00:00:00.000Z',
  profile: {
    age: 34,
    gender: 'male',
    heightCm: 185,
    weightKg: 85,
    fitnessLevel: 'advanced',
    fitnessGoal: 'general_fitness',
    targetWeightKg: 85,
    dietaryPreference: 'standard',
    foodAllergies: [],
    workoutPreference: 'gym',
    availableWorkoutDays: 5,
    dailyActivityLevel: 'very_active',
    bmi: 24.8,
    bmiCategory: 'Normal Weight',
    recommendedWorkoutDirection: 'Periodized Functional Strength & Conditioning',
    basicCalorieTarget: 2900,
    proteinTargetGrams: 190,
    carbsTargetGrams: 320,
    fatTargetGrams: 80
  },
  workouts: [],
  calorieLogs: [],
  habitData: {
    currentStreak: 21,
    weeklyGoalWorkouts: 5,
    weeklyCompletedWorkouts: 5,
    habitStatus: 'On Track',
    skipRisk: 'Low',
    motivationalNudge: 'System master coach profile.',
    dynamicRecommendation: 'System operational.',
    historicalEngagement: []
  },
  dietPlan: null,
  challenges: ['ch-1', 'ch-2', 'ch-3']
};

db.users.set(defaultUser.email, defaultUser);
db.users.set(defaultAdmin.email, defaultAdmin);

// Planned Weekly Routine
let weeklyPlan = [
  {
    dayName: 'Monday',
    focus: 'Lower Body Strength & Knee Mechanics',
    isRest: false,
    status: 'completed',
    exercises: [
      { name: 'Bodyweight Squats', sets: 4, reps: '15 reps', restSeconds: 60 },
      { name: 'Walking Lunges', sets: 3, reps: '12 reps / leg', restSeconds: 60 },
      { name: 'Glute Bridges', sets: 3, reps: '15 reps', restSeconds: 45 }
    ]
  },
  {
    dayName: 'Tuesday',
    focus: 'Upper Body Pushing & Core Stability',
    isRest: false,
    status: 'completed',
    exercises: [
      { name: 'Standard Push-Ups', sets: 4, reps: '12-15 reps', restSeconds: 60 },
      { name: 'Overhead Shoulder Press', sets: 3, reps: '10-12 reps', restSeconds: 60 },
      { name: 'Plank Hold', sets: 3, reps: '45 seconds', restSeconds: 45 }
    ]
  },
  {
    dayName: 'Wednesday',
    focus: 'Active Recovery & Mobility Flow',
    isRest: true,
    status: 'completed',
    exercises: [
      { name: 'Hip 90/90 Stretch', sets: 2, reps: '60s per side', restSeconds: 30 },
      { name: 'Thoracic Rotations', sets: 2, reps: '10 per side', restSeconds: 30 }
    ]
  },
  {
    dayName: 'Thursday',
    focus: 'Pulling & Biceps Hypertrophy',
    isRest: false,
    status: 'pending',
    exercises: [
      { name: 'Dumbbell Bicep Curls', sets: 4, reps: '12 reps', restSeconds: 60 },
      { name: 'Inverted Body Rows', sets: 3, reps: '10 reps', restSeconds: 60 },
      { name: 'Hammer Curls', sets: 3, reps: '12 reps', restSeconds: 45 }
    ]
  },
  {
    dayName: 'Friday',
    focus: 'Full Body Functional & HIIT',
    isRest: false,
    status: 'pending',
    exercises: [
      { name: 'Bodyweight Squats', sets: 3, reps: '20 reps', restSeconds: 45 },
      { name: 'Push-Ups to Pike', sets: 3, reps: '10 reps', restSeconds: 45 },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', restSeconds: 30 }
    ]
  },
  {
    dayName: 'Saturday',
    focus: 'Cardio & Outdoor Conditioning',
    isRest: false,
    status: 'pending',
    exercises: [
      { name: '5K Zone 2 Jog or Cycle', sets: 1, reps: '30 mins', restSeconds: 0 }
    ]
  },
  {
    dayName: 'Sunday',
    focus: 'Rest & Nutrient Replenishment',
    isRest: true,
    status: 'pending',
    exercises: []
  }
];

// Helper: Get user from Authorization header
function getCurrentUser(req: express.Request): DbUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return db.users.get('alex@aigym.com') || null;
  const token = authHeader.replace('Bearer ', '').trim();
  // Simple token format: user-email or jwt
  const user = Array.from(db.users.values()).find(u => u.id === token || u.email === token);
  return user || db.users.get('alex@aigym.com') || null;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'USER' } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ detail: 'Name, email, and password are required' });
  }

  if (db.users.has(email)) {
    return res.status(400).json({ detail: 'User with this email already exists' });
  }

  const newUser: DbUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: password, // in production bcrypt
    role: role === 'ADMIN' ? 'ADMIN' : 'USER',
    createdAt: new Date().toISOString(),
    profile: {
      age: 25,
      gender: 'male',
      heightCm: 175,
      weightKg: 70,
      fitnessLevel: 'beginner',
      fitnessGoal: 'general_fitness',
      targetWeightKg: 70,
      dietaryPreference: 'standard',
      foodAllergies: [],
      workoutPreference: 'gym',
      availableWorkoutDays: 3,
      dailyActivityLevel: 'moderately_active',
      bmi: 22.9,
      bmiCategory: 'Normal Weight',
      recommendedWorkoutDirection: 'Balanced 3-day Full Body Routine',
      basicCalorieTarget: 2200,
      proteinTargetGrams: 140,
      carbsTargetGrams: 250,
      fatTargetGrams: 60
    },
    workouts: [],
    calorieLogs: [],
    habitData: {
      currentStreak: 1,
      weeklyGoalWorkouts: 3,
      weeklyCompletedWorkouts: 1,
      habitStatus: 'On Track',
      skipRisk: 'Low',
      motivationalNudge: 'Welcome to AI Gym! Complete your fitness assessment to optimize your training.',
      dynamicRecommendation: 'Start with a light 15-minute introductory session.',
      historicalEngagement: []
    },
    dietPlan: null,
    challenges: []
  };

  db.users.set(email, newUser);
  res.status(201).json({
    token: newUser.id,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.get(email);

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ detail: 'Invalid email or password' });
  }

  res.json({
    token: user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// User Me
app.get('/api/users/me', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

// User Profile (GET & PUT)
app.get('/api/profile', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });
  res.json(user.profile);
});

app.put('/api/profile', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const body = req.body;
  const heightM = (body.heightCm || user.profile.heightCm) / 100;
  const weight = body.weightKg || user.profile.weightKg;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Normal Weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  let calorieTarget = 2000;
  if (body.fitnessGoal === 'weight_loss') calorieTarget = Math.round(weight * 22 * 1.3 - 400);
  else if (body.fitnessGoal === 'muscle_gain') calorieTarget = Math.round(weight * 22 * 1.5 + 350);
  else calorieTarget = Math.round(weight * 22 * 1.4);

  const updatedProfile = {
    ...user.profile,
    ...body,
    bmi,
    bmiCategory,
    basicCalorieTarget: calorieTarget,
    proteinTargetGrams: Math.round(weight * 2.0),
    carbsTargetGrams: Math.round((calorieTarget * 0.45) / 4),
    fatTargetGrams: Math.round((calorieTarget * 0.25) / 9)
  };

  user.profile = updatedProfile;
  res.json(updatedProfile);
});

// Dashboard Data
app.get('/api/dashboard', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  // Today's calories consumed
  const todayCaloriesConsumed = user.calorieLogs.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalCaloriesBurned = user.workouts.reduce((acc, w) => acc + Math.round((w.durationSeconds || 120) * 0.15), 320);

  // Performance score average
  const avgPerformance = user.workouts.length > 0
    ? Math.round(user.workouts.reduce((acc, w) => acc + (w.performanceScore || 85), 0) / user.workouts.length)
    : 88;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    profile: user.profile,
    todayWorkout: {
      title: 'Thursday Pull & Arm Hypertrophy',
      focus: 'Biceps, Lats, & Core Alignment',
      estimatedMinutes: 35,
      exerciseCount: 3,
      status: 'pending'
    },
    todayCalories: {
      consumed: todayCaloriesConsumed,
      target: user.profile.basicCalorieTarget,
      burned: totalCaloriesBurned,
      proteinGrams: user.calorieLogs.reduce((acc, item) => acc + (item.protein || 0), 0),
      carbsGrams: user.calorieLogs.reduce((acc, item) => acc + (item.carbs || 0), 0),
      fatGrams: user.calorieLogs.reduce((acc, item) => acc + (item.fat || 0), 0)
    },
    weeklyWorkoutCount: user.habitData.weeklyCompletedWorkouts,
    weeklyTargetWorkouts: user.habitData.weeklyGoalWorkouts,
    currentStreak: user.habitData.currentStreak,
    performanceScore: avgPerformance,
    habitProgress: Math.min(100, Math.round((user.habitData.weeklyCompletedWorkouts / user.habitData.weeklyGoalWorkouts) * 100)),
    weeklyChart: [
      { day: 'Mon', reps: 45, caloriesBurned: 380, performance: 91 },
      { day: 'Tue', reps: 38, caloriesBurned: 340, performance: 88 },
      { day: 'Wed', reps: 0, caloriesBurned: 160, performance: 0 },
      { day: 'Thu', reps: 42, caloriesBurned: 410, performance: 89 },
      { day: 'Fri', reps: 50, caloriesBurned: 460, performance: 94 },
      { day: 'Sat', reps: 20, caloriesBurned: 220, performance: 85 },
      { day: 'Sun', reps: 35, caloriesBurned: 310, performance: 87 }
    ],
    recentWorkouts: user.workouts.slice(0, 5),
    aiRecommendations: [
      "Target depth: Ensure your femur is parallel to the ground during Squat descent for maximal hypertrophy.",
      "Hydration alert: Post-workout water intake recommended at 650ml to support recovery.",
      "Progressive overload: Ready to increase resistance by 2.5kg or add 2 reps next session."
    ]
  });
});

// Workouts (GET & POST)
app.get('/api/workouts', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });
  res.json(user.workouts);
});

app.post('/api/workouts', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const session = {
    ...req.body,
    id: `ws-${Date.now()}`,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  user.workouts.unshift(session);
  user.habitData.weeklyCompletedWorkouts++;
  user.habitData.currentStreak++;

  res.status(201).json(session);
});

// Workout Planner (GET weekly plan & status update)
app.get('/api/workouts/plan', (req, res) => {
  res.json(weeklyPlan);
});

app.post('/api/workouts/plan/status', (req, res) => {
  const { dayName, status } = req.body;
  weeklyPlan = weeklyPlan.map(day => day.dayName === dayName ? { ...day, status } : day);
  res.json(weeklyPlan);
});

// AI Trainer Pose Analysis API (Server-side biomechanical evaluation endpoint)
app.post('/api/trainer/analyze', (req, res) => {
  const { exercise, landmarks } = req.body;

  if (!landmarks || landmarks.length < 33) {
    return res.json({
      primaryAngle: 0,
      repCompleted: false,
      formQuality: 'Needs Improvement',
      formScore: 0,
      feedbackText: 'Position entire body within camera view'
    });
  }

  // Calculate knee or elbow angle
  // Example for Squats: left hip (23), knee (25), ankle (27)
  const hip = landmarks[23];
  const knee = landmarks[25];
  const ankle = landmarks[27];

  const radians = Math.atan2(ankle.y - knee.y, ankle.x - knee.x) - Math.atan2(hip.y - knee.y, hip.x - knee.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  angle = Math.round(angle);

  let formQuality = 'Good';
  let formScore = 90;
  let feedbackText = 'Form looks aligned. Keep your core braced.';

  if (exercise === 'squats') {
    if (angle <= 95) {
      formQuality = 'Good';
      formScore = 96;
      feedbackText = 'Deep squat reached! Drive upward through midfoot.';
    } else if (angle < 120) {
      formQuality = 'Acceptable';
      formScore = 80;
      feedbackText = 'Drop slightly lower to hit parallel depth.';
    } else {
      formQuality = 'Good';
      formScore = 90;
      feedbackText = 'Hips descending smoothly.';
    }
  }

  res.json({
    primaryAngle: angle,
    repCompleted: false,
    formQuality,
    formScore,
    feedbackText
  });
});

// Pose-to-Performance Analyzer API
app.get('/api/performance/analyze', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const totalReps = user.workouts.reduce((acc, w) => acc + (w.completedReps || 0), 185);
  const totalMinutes = Math.round(user.workouts.reduce((acc, w) => acc + (w.durationSeconds || 120), 2400) / 60);

  res.json({
    weeklyAverageScore: 89,
    breakdown: {
      form: 91,
      rangeOfMotion: 88,
      consistency: 89,
      movementEfficiency: 88
    },
    totalRepsCompleted: totalReps,
    totalMinutesTrained: totalMinutes,
    weeklyHistory: [
      { date: 'Mon', score: 92, reps: 45, duration: 18 },
      { date: 'Tue', score: 87, reps: 38, duration: 15 },
      { date: 'Thu', score: 90, reps: 42, duration: 20 },
      { date: 'Fri', score: 94, reps: 50, duration: 22 },
      { date: 'Sun', score: 88, reps: 35, duration: 16 }
    ],
    recommendations: [
      "Range of Motion: Push-ups achieved 94% depth; continue keeping elbows tucked at 45 degrees.",
      "Rep Consistency: Standard deviation across reps was under 0.4s, indicating excellent tempo control.",
      "Movement Efficiency: Minimal spinal lateral flexion detected during unilateral lunges."
    ]
  });
});

// AI Dietician & Calorie Coach (Generate & View)
app.get('/api/diet/plan', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });
  res.json(user.dietPlan || defaultUser.dietPlan);
});

app.post('/api/diet/generate', async (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const ai = getGemini();
  const profile = { ...user.profile, ...req.body };

  if (ai) {
    try {
      const prompt = `You are an elite sports dietician. Generate a daily meal plan with estimated calories, protein, carbohydrates, and fat for this client:
- Goal: ${profile.fitnessGoal}
- Weight: ${profile.weightKg} kg, Height: ${profile.heightCm} cm, BMI: ${profile.bmi}
- Dietary Preference: ${profile.dietaryPreference}
- Food Allergies: ${profile.foodAllergies.join(', ') || 'None'}
- Target Calories: ${profile.basicCalorieTarget} kcal
Return ONLY valid JSON matching this structure (no markdown fences):
{
  "calorieTarget": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "meals": {
    "breakfast": [{ "id": "b1", "name": string, "portion": string, "calories": number, "protein": number, "carbs": number, "fat": number }],
    "lunch": [{ "id": "l1", "name": string, "portion": string, "calories": number, "protein": number, "carbs": number, "fat": number }],
    "dinner": [{ "id": "d1", "name": string, "portion": string, "calories": number, "protein": number, "carbs": number, "fat": number }],
    "snacks": [{ "id": "s1", "name": string, "portion": string, "calories": number, "protein": number, "carbs": number, "fat": number }]
  },
  "groceryList": [string],
  "dietitianAdvice": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const generatedPlan = {
        id: `dp-${Date.now()}`,
        userId: user.id,
        ...parsed,
        generatedAt: new Date().toISOString()
      };
      user.dietPlan = generatedPlan;
      return res.json(generatedPlan);
    } catch (err) {
      console.warn('Gemini dietician generation fallback:', err);
    }
  }

  // Algorithmic Dietician Fallback
  const proteinTarget = Math.round(profile.weightKg * 2.0);
  const calorieTarget = profile.basicCalorieTarget || 2400;
  const fatTarget = Math.round((calorieTarget * 0.25) / 9);
  const carbsTarget = Math.round((calorieTarget - (proteinTarget * 4 + fatTarget * 9)) / 4);

  const fallbackPlan = {
    id: `dp-${Date.now()}`,
    userId: user.id,
    calorieTarget,
    macros: { protein: proteinTarget, carbs: carbsTarget, fat: fatTarget },
    meals: {
      breakfast: [
        { id: 'fb-1', name: 'Scrambled Eggs with Avocado & Whole Grain Toast', portion: '3 eggs, 1/2 avocado, 2 slices toast', calories: 520, protein: 32, carbs: 42, fat: 22 }
      ],
      lunch: [
        { id: 'fb-2', name: 'Turkey Breast Bowl with Quinoa, Roasted Veggies & Olive Oil', portion: '1 bowl (200g turkey, 150g quinoa)', calories: 680, protein: 54, carbs: 68, fat: 18 }
      ],
      dinner: [
        { id: 'fb-3', name: 'Grilled Lean Sirloin Steak with Sweet Potato & Green Beans', portion: '1 serving (180g beef, 220g sweet potato)', calories: 740, protein: 50, carbs: 64, fat: 26 }
      ],
      snacks: [
        { id: 'fb-4', name: 'Protein Shake with Almond Milk & Banana', portion: '1 shaker cup (30g protein)', calories: 290, protein: 30, carbs: 34, fat: 4 },
        { id: 'fb-5', name: 'Mixed Pumpkin Seeds & Dark Chocolate (85%)', portion: '30g seeds, 15g chocolate', calories: 220, protein: 9, carbs: 14, fat: 16 }
      ]
    },
    groceryList: [
      'Free-Range Eggs (1 dozen)',
      'Whole Grain Sourdough Bread',
      'Turkey Breast & Lean Sirloin Steak',
      'Organic Quinoa & Sweet Potatoes',
      'Fresh Avocado, Broccoli & Green Beans',
      'Whey / Plant Protein Powder',
      'Raw Pumpkin Seeds & 85% Dark Chocolate'
    ],
    dietitianAdvice: 'Notice: This nutrition plan is designed for performance and body composition goals and does not constitute medical advice. Hydrate adequately throughout training.',
    generatedAt: new Date().toISOString()
  };

  user.dietPlan = fallbackPlan;
  res.json(fallbackPlan);
});

// Calorie Logs (GET, POST, DELETE)
app.get('/api/calories/logs', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });
  res.json(user.calorieLogs);
});

app.post('/api/calories/log', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const newLog = {
    id: `cl-${Date.now()}`,
    userId: user.id,
    ...req.body,
    loggedAt: new Date().toISOString()
  };

  user.calorieLogs.unshift(newLog);
  res.status(201).json(newLog);
});

app.delete('/api/calories/log/:id', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  user.calorieLogs = user.calorieLogs.filter(l => l.id !== req.params.id);
  res.json({ success: true });
});

// Habits & Behavioral Skip Predictor
app.get('/api/habits', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  // Analyze behavioral skip risk based on historical completion
  const logs = user.habitData.historicalEngagement || [];
  let skipRisk = 'Low';
  let skipRiskReason = 'High historical mid-week consistency detected.';

  if (user.habitData.weeklyCompletedWorkouts < 2 && new Date().getDay() >= 4) {
    skipRisk = 'High';
    skipRiskReason = 'Mid-to-late week workout volume is currently below trajectory. High risk of missing weekly goal.';
  } else if (user.habitData.currentStreak < 2) {
    skipRisk = 'Medium';
    skipRiskReason = 'Streak disrupted earlier this week. Recommended 15-min restart session.';
  }

  res.json({
    ...user.habitData,
    skipRisk,
    skipRiskReason
  });
});

app.post('/api/habits', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ detail: 'Unauthorized' });

  const { day, completed } = req.body;
  if (completed) {
    user.habitData.currentStreak++;
    user.habitData.weeklyCompletedWorkouts++;
  } else {
    user.habitData.currentStreak = 0;
  }

  const existingIndex = user.habitData.historicalEngagement.findIndex((e: any) => e.day === day);
  if (existingIndex >= 0) {
    user.habitData.historicalEngagement[existingIndex].completed = completed;
  } else {
    user.habitData.historicalEngagement.push({ day, completed, loggedCalories: true });
  }

  res.json(user.habitData);
});

// Virtual Gym Buddy (Chat with Gemini 3.8 Flash)
let chatMessagesMemory: Record<string, any[]> = {};

app.post('/api/chat', async (req, res) => {
  const user = getCurrentUser(req);
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ detail: 'Message content is required' });
  }

  const ai = getGemini();
  const userName = user?.name || 'Athlete';
  const streak = user?.habitData.currentStreak || 5;
  const completedWorkouts = user?.habitData.weeklyCompletedWorkouts || 3;
  const goal = user?.profile?.fitnessGoal || 'muscle gain';

  // Sentiment Analysis
  let sentiment: 'positive' | 'neutral' | 'discouraged' | 'inquisitive' = 'neutral';
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('tired') || lowerMsg.includes('unmotivated') || lowerMsg.includes('give up') || lowerMsg.includes('hard') || lowerMsg.includes("don't feel")) {
    sentiment = 'discouraged';
  } else if (lowerMsg.includes('great') || lowerMsg.includes('pumped') || lowerMsg.includes('crushed') || lowerMsg.includes('ready')) {
    sentiment = 'positive';
  } else if (lowerMsg.includes('how') || lowerMsg.includes('what') || lowerMsg.includes('why') || lowerMsg.includes('should i')) {
    sentiment = 'inquisitive';
  }

  if (ai) {
    try {
      const systemInstruction = `You are "Gym Buddy", an empathetic, energetic, and highly knowledgeable AI gym partner and personal trainer.
Client Context:
- Name: ${userName}
- Current Streak: ${streak} days
- Weekly Workouts Completed: ${completedWorkouts}
- Primary Goal: ${goal}
- Detected Client State/Sentiment: ${sentiment}

Guidelines:
- If the user feels unmotivated, give a compassionate yet empowering response: acknowledge their effort, remind them of their ${streak}-day streak, and suggest a simplified 10-minute session or warm-up.
- Keep responses concise (2 to 4 sentences), punchy, and actionable.
- Provide scientifically sound exercise and nutrition advice.`;

      const contents = [
        ...history.slice(-4).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: { systemInstruction }
      });

      const reply = response.text || "Let's keep your momentum going! What exercise are we tackling today?";
      return res.json({ reply, sentiment });
    } catch (err) {
      console.warn('Gemini chat fallback:', err);
    }
  }

  // Conversational Rule-based Fallback
  let reply = "Keep showing up! Consistency beats intensity every single time.";
  if (sentiment === 'discouraged') {
    reply = `You've already conquered ${completedWorkouts} workouts this week and hold a ${streak}-day streak! Let's keep today's session super simple: start with a light 5-minute warm-up and just one set of squats. Momentum follows action.`;
  } else if (sentiment === 'positive') {
    reply = `Love that energy, ${userName}! That mindset is exactly how PRs are broken. Channel that drive into controlled eccentric tempos today!`;
  } else if (lowerMsg.includes('protein') || lowerMsg.includes('diet')) {
    reply = `For your goal of ${goal}, aim for roughly 1.6 to 2.2 grams of protein per kilogram of body weight spread evenly across 3-4 meals.`;
  } else if (lowerMsg.includes('squat')) {
    reply = "Keep your chest tall, screw your feet into the floor to activate your glutes, and ensure your knees track in line with your middle toes.";
  }

  res.json({ reply, sentiment });
});

app.get('/api/chat/history', (req, res) => {
  res.json([
    {
      id: 'm-init-1',
      sender: 'assistant',
      text: "Hey Alex! Ready to crush today's training? I have your pull routine lined up. How are your energy levels feeling today?",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
});

// Gym Recommendations
app.get('/api/gyms/recommendations', (req, res) => {
  res.json(db.gyms);
});

// Challenges (GET, JOIN, PROGRESS)
app.get('/api/challenges', (req, res) => {
  res.json(db.challenges);
});

app.post('/api/challenges/:id/join', (req, res) => {
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ detail: 'Challenge not found' });
  challenge.isJoined = !challenge.isJoined;
  res.json(challenge);
});

app.post('/api/challenges/:id/progress', (req, res) => {
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ detail: 'Challenge not found' });
  const { amount = 1 } = req.body;
  challenge.userProgress = Math.min(challenge.targetCount, challenge.userProgress + amount);
  res.json(challenge);
});

// Smart Gym Assistant (IoT / MQTT compatible endpoints)
app.get('/api/iot/equipment-data', (req, res) => {
  res.json(db.iotEquipment);
});

app.post('/api/iot/simulate', (req, res) => {
  const { resistanceKg, reps, heartRateBpm, equipmentName } = req.body;

  let intensityVerdict: 'Optimal' | 'High Fatigue' | 'Under-loaded' = 'Optimal';
  let restSeconds = 90;
  let resistanceAdjustment = 'Maintain current resistance.';

  if (heartRateBpm > 165) {
    intensityVerdict = 'High Fatigue';
    restSeconds = 120;
    resistanceAdjustment = 'High cardiovascular stress detected. Consider dropping resistance by 5-10kg.';
  } else if (heartRateBpm < 110 && reps >= 12) {
    intensityVerdict = 'Under-loaded';
    restSeconds = 60;
    resistanceAdjustment = 'Low RPE detected. Increase resistance by 2.5-5kg on next set for progressive overload.';
  }

  const updatedIoT = {
    equipmentId: 'SMART-EQUIP-01',
    equipmentName: equipmentName || db.iotEquipment.equipmentName,
    resistanceKg: resistanceKg || db.iotEquipment.resistanceKg,
    reps: reps || db.iotEquipment.reps,
    heartRateBpm: heartRateBpm || db.iotEquipment.heartRateBpm,
    powerWatts: Math.round((resistanceKg || 60) * (reps || 10) * 0.45),
    timestamp: new Date().toISOString(),
    recommendations: {
      resistanceAdjustment,
      restSeconds,
      intensityVerdict,
      hydrationReminder: heartRateBpm > 150
    }
  };

  db.iotEquipment = updatedIoT;
  res.json(updatedIoT);
});

// Analytics (Daily, Weekly, Monthly)
app.get('/api/analytics/progress', (req, res) => {
  const period = (req.query.period as string) || 'weekly';

  if (period === 'monthly') {
    return res.json({
      period: 'monthly',
      weightProgression: [
        { date: 'Week 1', weight: 75.8 },
        { date: 'Week 2', weight: 75.2 },
        { date: 'Week 3', weight: 74.5 },
        { date: 'Week 4', weight: 74.0 }
      ],
      bmiProgression: [
        { date: 'Week 1', bmi: 23.9 },
        { date: 'Week 2', bmi: 23.7 },
        { date: 'Week 3', bmi: 23.5 },
        { date: 'Week 4', bmi: 23.4 }
      ],
      calorieIntakeVsBurned: [
        { date: 'Week 1', consumed: 17200, burned: 4200 },
        { date: 'Week 2', consumed: 16800, burned: 4600 },
        { date: 'Week 3', consumed: 17100, burned: 4900 },
        { date: 'Week 4', consumed: 16900, burned: 5100 }
      ],
      workoutFrequency: [
        { label: 'Week 1', count: 4 },
        { label: 'Week 2', count: 4 },
        { label: 'Week 3', count: 5 },
        { label: 'Week 4', count: 4 }
      ],
      repVolume: [
        { date: 'Week 1', reps: 420 },
        { date: 'Week 2', reps: 480 },
        { date: 'Week 3', reps: 540 },
        { date: 'Week 4', reps: 610 }
      ],
      performanceScores: [
        { date: 'Week 1', score: 84 },
        { date: 'Week 2', score: 87 },
        { date: 'Week 3', score: 89 },
        { date: 'Week 4', score: 91 }
      ]
    });
  }

  // Default: Weekly view
  res.json({
    period: 'weekly',
    weightProgression: [
      { date: 'Mon', weight: 74.6 },
      { date: 'Tue', weight: 74.4 },
      { date: 'Wed', weight: 74.3 },
      { date: 'Thu', weight: 74.2 },
      { date: 'Fri', weight: 74.1 },
      { date: 'Sat', weight: 74.0 },
      { date: 'Sun', weight: 74.0 }
    ],
    bmiProgression: [
      { date: 'Mon', bmi: 23.6 },
      { date: 'Tue', bmi: 23.5 },
      { date: 'Wed', bmi: 23.5 },
      { date: 'Thu', bmi: 23.4 },
      { date: 'Fri', bmi: 23.4 },
      { date: 'Sat', bmi: 23.4 },
      { date: 'Sun', bmi: 23.4 }
    ],
    calorieIntakeVsBurned: [
      { date: 'Mon', consumed: 2420, burned: 460 },
      { date: 'Tue', consumed: 2380, burned: 410 },
      { date: 'Wed', consumed: 2150, burned: 180 },
      { date: 'Thu', consumed: 2490, burned: 520 },
      { date: 'Fri', consumed: 2440, burned: 490 },
      { date: 'Sat', consumed: 2600, burned: 310 },
      { date: 'Sun', consumed: 2390, burned: 350 }
    ],
    workoutFrequency: [
      { label: 'Mon', count: 1 },
      { label: 'Tue', count: 1 },
      { label: 'Wed', count: 0 },
      { label: 'Thu', count: 1 },
      { label: 'Fri', count: 1 },
      { label: 'Sat', count: 0 },
      { label: 'Sun', count: 1 }
    ],
    repVolume: [
      { date: 'Mon', reps: 60 },
      { date: 'Tue', reps: 50 },
      { date: 'Wed', reps: 0 },
      { date: 'Thu', reps: 55 },
      { date: 'Fri', reps: 65 },
      { date: 'Sat', reps: 20 },
      { date: 'Sun', reps: 45 }
    ],
    performanceScores: [
      { date: 'Mon', score: 91 },
      { date: 'Tue', score: 88 },
      { date: 'Wed', score: 0 },
      { date: 'Thu', score: 89 },
      { date: 'Fri', score: 94 },
      { date: 'Sat', score: 85 },
      { date: 'Sun', score: 88 }
    ]
  });
});

// Admin Management APIs
app.get('/api/admin/analytics', (req, res) => {
  const usersArray = Array.from(db.users.values());
  const totalUsers = usersArray.length;
  const activeUsers = usersArray.filter(u => u.workouts.length > 0 || u.calorieLogs.length > 0).length;
  const totalWorkouts = usersArray.reduce((acc, u) => acc + u.workouts.length, 142);
  const totalCaloriesTracked = usersArray.reduce((acc, u) => acc + u.calorieLogs.reduce((c, l) => c + l.calories, 0), 125400);

  res.json({
    totalUsers,
    activeUsers,
    totalWorkouts,
    avgPerformanceScore: 89.2,
    totalCaloriesTracked,
    popularExercises: [
      { name: 'Bodyweight Squats', count: 840, percentage: 38 },
      { name: 'Standard Push-Ups', count: 620, percentage: 28 },
      { name: 'Dumbbell Bicep Curls', count: 430, percentage: 19 },
      { name: 'Overhead Press', count: 320, percentage: 15 }
    ],
    workoutCompletionRate: 84.6,
    systemHealth: {
      status: 'Healthy',
      uptime: '99.98%',
      apiLatencyMs: 24,
      memoryUsage: '142 MB'
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  const users = Array.from(db.users.values()).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    profile: u.profile,
    workoutCount: u.workouts.length
  }));
  res.json(users);
});

app.get('/api/admin/exercises', (req, res) => {
  res.json(db.exercises);
});

app.post('/api/admin/exercises', (req, res) => {
  const newEx = {
    ...req.body,
    id: `ex-${Date.now()}`
  };
  db.exercises.push(newEx);
  res.status(201).json(newEx);
});

app.delete('/api/admin/exercises/:id', (req, res) => {
  db.exercises = db.exercises.filter(e => e.id !== req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// VITE & STATIC FILES SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI GYM & FITNESS ASSISTANT] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
