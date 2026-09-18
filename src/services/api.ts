import {
  User,
  UserProfile,
  DashboardData,
  WorkoutSession,
  DietPlan,
  CalorieLogItem,
  HabitStatusData,
  ChatMessage,
  GymFacility,
  PlannedWorkoutDay,
  Challenge,
  IoTEquipmentData,
  Exercise
} from '../types';

const TOKEN_KEY = 'ai_gym_token';
const USER_KEY = 'ai_gym_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.detail || errorData.message || 'API request failed');
    }

    return await res.json();
  } catch (err: unknown) {
    // If backend endpoint is temporarily unreachable or returned error, we rethrow for handler
    throw err;
  }
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async register(name: string, email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async getMe(): Promise<User> {
    return request<User>('/users/me');
  },

  // Profile & Assessment
  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>('/profile');
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    return request<DashboardData>('/dashboard');
  },

  // Workouts & Sessions
  async getWorkouts(): Promise<WorkoutSession[]> {
    return request<WorkoutSession[]>('/workouts');
  },

  async saveWorkoutSession(session: Omit<WorkoutSession, 'id' | 'createdAt'>): Promise<WorkoutSession> {
    return request<WorkoutSession>('/workouts', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  // Pose / Performance Analyzer
  async analyzePose(exercise: string, landmarks: unknown[]): Promise<{
    primaryAngle: number;
    repCompleted: boolean;
    formQuality: string;
    formScore: number;
    feedbackText: string;
  }> {
    return request('/trainer/analyze', {
      method: 'POST',
      body: JSON.stringify({ exercise, landmarks }),
    });
  },

  async getPerformanceReport(): Promise<{
    weeklyAverageScore: number;
    breakdown: { form: number; rangeOfMotion: number; consistency: number; movementEfficiency: number };
    totalRepsCompleted: number;
    totalMinutesTrained: number;
    weeklyHistory: { date: string; score: number; reps: number; duration: number }[];
    recommendations: string[];
  }> {
    return request('/performance/analyze');
  },

  // Diet & Calories
  async getDietPlan(): Promise<DietPlan> {
    return request<DietPlan>('/diet/plan');
  },

  async generateDietPlan(preferences?: Partial<UserProfile>): Promise<DietPlan> {
    return request<DietPlan>('/diet/generate', {
      method: 'POST',
      body: JSON.stringify(preferences || {}),
    });
  },

  async getCalorieLogs(): Promise<CalorieLogItem[]> {
    return request<CalorieLogItem[]>('/calories/logs');
  },

  async logCalories(item: Omit<CalorieLogItem, 'id' | 'userId' | 'loggedAt'>): Promise<CalorieLogItem> {
    return request<CalorieLogItem>('/calories/log', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async deleteCalorieLog(id: string): Promise<{ success: boolean }> {
    return request(`/calories/log/${id}`, { method: 'DELETE' });
  },

  // Habits & Behavior
  async getHabits(): Promise<HabitStatusData> {
    return request<HabitStatusData>('/habits');
  },

  async logHabitCompletion(day: string, completed: boolean): Promise<HabitStatusData> {
    return request<HabitStatusData>('/habits', {
      method: 'POST',
      body: JSON.stringify({ day, completed }),
    });
  },

  // Chat / Gym Buddy
  async sendChat(message: string, history: ChatMessage[]): Promise<{ reply: string; sentiment: string }> {
    return request<{ reply: string; sentiment: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    return request<ChatMessage[]>('/chat/history');
  },

  // Gym Recommendations
  async getGyms(goal?: string, location?: string): Promise<GymFacility[]> {
    const params = new URLSearchParams();
    if (goal) params.append('goal', goal);
    if (location) params.append('location', location);
    return request<GymFacility[]>(`/gyms/recommendations?${params.toString()}`);
  },

  // Workout Planner
  async getWeeklyPlan(): Promise<PlannedWorkoutDay[]> {
    return request<PlannedWorkoutDay[]>('/workouts/plan');
  },

  async updatePlanDayStatus(dayName: string, status: 'pending' | 'completed' | 'skipped'): Promise<PlannedWorkoutDay[]> {
    return request<PlannedWorkoutDay[]>('/workouts/plan/status', {
      method: 'POST',
      body: JSON.stringify({ dayName, status }),
    });
  },

  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    return request<Challenge[]>('/challenges');
  },

  async toggleJoinChallenge(challengeId: string): Promise<Challenge> {
    return request<Challenge>(`/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  },

  async updateChallengeProgress(challengeId: string, amount: number): Promise<Challenge> {
    return request<Challenge>(`/challenges/${challengeId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  // IoT Equipment
  async getIoTEquipment(): Promise<IoTEquipmentData> {
    return request<IoTEquipmentData>('/iot/equipment-data');
  },

  async simulateIoTData(payload: Partial<IoTEquipmentData>): Promise<IoTEquipmentData> {
    return request<IoTEquipmentData>('/iot/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Analytics
  async getAnalytics(period: 'daily' | 'weekly' | 'monthly'): Promise<{
    period: string;
    weightProgression: { date: string; weight: number }[];
    bmiProgression: { date: string; bmi: number }[];
    calorieIntakeVsBurned: { date: string; consumed: number; burned: number }[];
    workoutFrequency: { label: string; count: number }[];
    repVolume: { date: string; reps: number }[];
    performanceScores: { date: string; score: number }[];
  }> {
    return request(`/analytics/progress?period=${period}`);
  },

  // Admin APIs
  async getAdminAnalytics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalWorkouts: number;
    avgPerformanceScore: number;
    totalCaloriesTracked: number;
    popularExercises: { name: string; count: number; percentage: number }[];
    workoutCompletionRate: number;
    systemHealth: { status: string; uptime: string; apiLatencyMs: number; memoryUsage: string };
  }> {
    return request('/admin/analytics');
  },

  async getAdminUsers(): Promise<(User & { profile?: UserProfile; workoutCount: number })[]> {
    return request('/admin/users');
  },

  async getAdminExercises(): Promise<Exercise[]> {
    return request('/admin/exercises');
  },

  async createAdminExercise(exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
    return request<Exercise>('/admin/exercises', {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
  },

  async deleteAdminExercise(id: string): Promise<{ success: boolean }> {
    return request(`/admin/exercises/${id}`, { method: 'DELETE' });
  },
};
