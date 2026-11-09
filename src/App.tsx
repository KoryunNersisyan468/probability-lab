import React, { lazy } from 'react';
import {  Routes, Route, Navigate } from 'react-router';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MathBackground } from './components/MathBackground';
import { ProbabilityPanel } from './components/ProbabilityPanel';
import { ToastContainer } from './components/ToastContainer';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const GamesPage = lazy(() => import('./pages/GamesPage').then(m => ({ default: m.GamesPage })));
const ExperimentLabPage = lazy(() => import('./pages/ExperimentLabPage').then(m => ({ default: m.ExperimentLabPage })));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage').then(m => ({ default: m.StatisticsPage })));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));


export function App() {
  return (
    <AppProvider>
   
        {/* Global Route Change Scroll Position Reset */}
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans transition-colors duration-200">
          {/* Dynamic Interactive Mathematical Particle Background */}
          <MathBackground />

          {/* Fixed / Sticky Navigation Bar */}
          <Navbar />

          {/* Main Application Router Viewport - responsive top padding for mobile landscape and desktop */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16 relative z-10 min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/lab" element={<ExperimentLabPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Modals & Notifications */}
          <ProbabilityPanel />
          <ToastContainer />

          {/* Footer */}
          <Footer />
        </div>
     
    </AppProvider>
  );
}

export default App;
