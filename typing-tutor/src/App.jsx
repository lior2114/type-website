import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LessonsScreen from './components/LessonsScreen';
import LessonContent from './components/LessonContent';
import TranslatedEnglishLessons from './components/TranslatedEnglishLessons';
import TranslatedEnglishLesson from './components/TranslatedEnglishLesson';
import TranslatedHebrewLessons from './components/TranslatedHebrewLessons';
import TranslatedHebrewLesson from './components/TranslatedHebrewLesson';
import FreePractice from './components/FreePractice';
import RandomWordsTest from './components/RandomWordsTest';
import OnlineBattle from './components/OnlineBattle';
import ResultsScreen from './components/ResultsScreen';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const AppContent = () => {
  const { darkMode } = useLanguage();
  const { user, loading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ניקוי localStorage ישן בהתחלה
  useEffect(() => {
    // ניקוי נתונים ישנים של התקדמות שלא קשורים לשפה
    const oldKeys = [
      'completedLessons', 
      'userProgress', 
      'completed_lessons',
      'completedLessons_hebrew',
      'completedLessons_english',
      'user_stats',
      'typing_progress'
    ];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Cleared old localStorage key: ${key}`);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/lessons" element={<LessonsScreen />} />
        <Route path="/lesson/:id" element={<LessonContent />} />
        <Route path="/translated-english-lessons" element={<TranslatedEnglishLessons />} />
        <Route path="/translated-english-lesson/:id" element={<TranslatedEnglishLesson />} />
        <Route path="/translated-hebrew-lessons" element={<TranslatedHebrewLessons />} />
        <Route path="/translated-hebrew-lesson/:id" element={<TranslatedHebrewLesson />} />
        <Route path="/free-practice" element={<FreePractice />} />
        <Route path="/random-words-test" element={<RandomWordsTest />} />
        <Route path="/online-battle" element={<OnlineBattle />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/profile" element={user ? <Profile /> : <AuthScreen />} />
        <Route path="/admin" element={user && user.role_name === 'admin' ? <AdminPanel /> : <AuthScreen />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App; 