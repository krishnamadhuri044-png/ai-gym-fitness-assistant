import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, PageId } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { AIGymTrainerPage } from './pages/AIGymTrainerPage';
import { PerformanceAnalyzerPage } from './pages/PerformanceAnalyzerPage';
import { DieticianPage } from './pages/DieticianPage';
import { CalorieTrackerPage } from './pages/CalorieTrackerPage';
import { HabitTrackerPage } from './pages/HabitTrackerPage';
import { VirtualGymBuddyPage } from './pages/VirtualGymBuddyPage';
import { SmartGymPage } from './pages/SmartGymPage';
import { GymRecommenderPage } from './pages/GymRecommenderPage';
import { WorkoutPlannerPage } from './pages/WorkoutPlannerPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { api } from './services/api';
import { DashboardData, User, UserProfile, WorkoutSession } from './types';

export default function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleToggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  const handleSwitchRole = () => {
    if (!user) return;
    const nextRole: 'USER' | 'ADMIN' = user.role === 'USER' ? 'ADMIN' : 'USER';
    const updated: User = { ...user, role: nextRole };
    setUser(updated);
    if (dashboardData) {
      setDashboardData({ ...dashboardData, user: updated });
    }
    if (nextRole === 'ADMIN') {
      setCurrentPage('admin');
    } else if (currentPage === 'admin') {
      setCurrentPage('dashboard');
    }
  };

  const handleProfileUpdated = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (dashboardData) {
      setDashboardData({ ...dashboardData, profile: updatedProfile });
    }
  };

  const handleSessionSaved = (session: WorkoutSession) => {
    loadDashboard();
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    loadDashboard();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Application Bar */}
      <Header
        user={user}
        currentStreak={dashboardData?.currentStreak || 6}
        caloriesConsumed={dashboardData?.todayCalories.consumed || 1370}
        calorieTarget={dashboardData?.todayCalories.target || 2450}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onSwitchRole={handleSwitchRole}
        onOpenProfile={() => setCurrentPage('profile')}
        onLogout={() => setAuthModalOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Fixed Left Navigation Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentPage={currentPage}
            onSelectPage={(page) => setCurrentPage(page)}
            userRole={user?.role || 'USER'}
          />
        </div>

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* Mobile Navigation Pills */}
          <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-800">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'dashboard' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('ai-trainer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'ai-trainer' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              AI Trainer
            </button>
            <button
              onClick={() => setCurrentPage('workout-planner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'workout-planner' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Planner
            </button>
            <button
              onClick={() => setCurrentPage('dietician')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'dietician' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Dietician
            </button>
            <button
              onClick={() => setCurrentPage('gym-buddy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'gym-buddy' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Gym Buddy
            </button>
            <button
              onClick={() => setCurrentPage('smart-gym')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'smart-gym' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Smart Gym
            </button>
            <button
              onClick={() => setCurrentPage('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                currentPage === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Render Active Page */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              data={dashboardData}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'ai-trainer' && (
            <AIGymTrainerPage
              onSessionSaved={handleSessionSaved}
              audioEnabled={audioEnabled}
              onToggleAudio={handleToggleAudio}
            />
          )}

          {currentPage === 'performance' && (
            <PerformanceAnalyzerPage />
          )}

          {currentPage === 'workout-planner' && (
            <WorkoutPlannerPage
              onNavigateToTrainer={() => setCurrentPage('ai-trainer')}
            />
          )}

          {currentPage === 'dietician' && profile && (
            <DieticianPage
              profile={profile}
              onNavigateToCalorieTracker={() => setCurrentPage('calorie-tracker')}
            />
          )}

          {currentPage === 'calorie-tracker' && profile && (
            <CalorieTrackerPage profile={profile} />
          )}

          {currentPage === 'habits' && (
            <HabitTrackerPage />
          )}

          {currentPage === 'gym-buddy' && profile && (
            <VirtualGymBuddyPage
              profile={profile}
              currentStreak={dashboardData?.currentStreak || 6}
            />
          )}

          {currentPage === 'smart-gym' && (
            <SmartGymPage />
          )}

          {currentPage === 'gyms' && (
            <GymRecommenderPage />
          )}

          {currentPage === 'challenges' && (
            <ChallengesPage />
          )}

          {currentPage === 'analytics' && (
            <ProgressAnalyticsPage />
          )}

          {currentPage === 'profile' && profile && (
            <ProfilePage
              user={user}
              profile={profile}
              onProfileUpdated={handleProfileUpdated}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboardPage />
          )}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
