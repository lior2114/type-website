import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { texts, isRTL } = useLanguage();

  const features = [
    {
      icon: '🎯',
      title: texts.structuredLessons,
      description: texts.structuredLessonsDesc
    },
    {
      icon: '⌨️',
      title: texts.virtualKeyboard,
      description: texts.virtualKeyboardDesc
    },
    {
      icon: '📊',
      title: texts.progressTracking,
      description: texts.progressTrackingDesc
    },
    {
      icon: '🎮',
      title: texts.freePractice,
      description: texts.freePracticeDesc
    },
    {
      icon: '🎲',
      title: texts.randomWordsTest,
      description: texts.randomWordsTestDesc
    },
    {
      icon: '⚔️',
      title: texts.onlineBattle,
      description: texts.onlineBattleDescription
    },
    {
      icon: '🌙',
      title: texts.darkMode,
      description: texts.darkModeDesc
    }
  ];

  const stats = [
    { number: '10+', label: texts.lessons },
    { number: '100+', label: texts.words },
    { number: '24/7', label: texts.availability },
    { number: '100%', label: texts.free }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="welcome-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="welcome-container">
        <div className="welcome-card">
          <h1>{texts.welcomeTitle}</h1>
          <p>{texts.welcomeDescription}</p>
          
          <div className="stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="features">
            {features.map((feature, index) => (
              <div key={index} className="feature">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="actions">
            <button 
              className="btn-primary" 
              onClick={() => handleNavigation('/lessons')}
            >
              {texts.startLearning}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => handleNavigation('/free-practice')}
            >
              {texts.freePractice}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => handleNavigation('/random-words-test')}
            >
              {texts.randomWordsTest}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => handleNavigation('/online-battle')}
            >
              {texts.onlineBattle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen; 