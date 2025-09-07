import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { lessons } from '../data/lessons';
import './LessonsScreen.css';

const LessonsScreen = () => {
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const { user, getCompletedLessons } = useAuth();
  const currentLessons = lessons[language] || lessons.hebrew;
  const [completedIds, setCompletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load completed lesson ids from Firebase for logged-in users, localStorage for guests
  useEffect(() => {
    const loadCompleted = async () => {
      try {
        if (user) {
          // משתמש מחובר - טעינה מ-Firebase
          const completed = await getCompletedLessons(language);
          setCompletedIds(completed);
        } else {
          // משתמש לא מחובר - טעינה מ-localStorage
          const key = `completedLessons_${language}`;
          const stored = JSON.parse(localStorage.getItem(key) || '[]');
          // וידוא שהנתונים תקינים ומתחילים מ-0
          const validStored = Array.isArray(stored) ? stored : [];
          setCompletedIds(validStored);
        }
      } catch (error) {
        console.error('Error loading completed lessons:', error);
        setCompletedIds([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompleted();
    
    const handler = () => loadCompleted();
    window.addEventListener('lesson-completed', handler);
    window.addEventListener('user-progress-updated', handler);
    
    return () => {
      window.removeEventListener('lesson-completed', handler);
      window.removeEventListener('user-progress-updated', handler);
    };
  }, [language, user, getCompletedLessons]);

  const calculateProgress = () => {
    const total = currentLessons.length || 1;
    const completed = completedIds.length;
    const progress = Math.round((completed / total) * 100);
    // וידוא שההתקדמות לא עולה על 100% ולא יורדת מתחת ל-0%
    return Math.max(0, Math.min(100, progress));
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="lessons-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="lessons-container">
          <div className="lessons-header">
            <h1>{texts.lessons}</h1>
            <p>{isRTL ? 'טוען התקדמות...' : 'Loading progress...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="lessons-container">
        <div className="lessons-header">
          <h1>{texts.lessons}</h1>
          {user ? (
            <div className="user-progress-card">
              <div className="user-info">
                <span className="lessons-user-name">{user.first_name} {user.last_name}</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">{isRTL ? 'התקדמות אישית' : 'Personal Progress'}</span>
              </div>
            </div>
          ) : (
            <div className="user-progress-card">
              <div className="user-info">
                <span className="lessons-user-name">{isRTL ? 'אורח' : 'Guest'}</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">{isRTL ? 'התקדמות כללית' : 'General Progress'}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="lessons-grid">
          {Object.entries(currentLessons.reduce((acc, l) => {
            const key = l.group || (language === 'hebrew' ? 'כללי' : 'General');
            if (!acc[key]) acc[key] = [];
            acc[key].push(l);
            return acc;
          }, {})).map(([group, list]) => (
            <div key={group} className="lesson-group">
              <h2 className="lesson-group-title">{group}</h2>
              <div className="lesson-group-grid">
                {list.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`lesson-card ${completedIds.includes(lesson.id) ? 'completed' : ''} ${lesson.locked ? 'locked' : ''}`}
                  >
                    <div className="lesson-progress">
                      {completedIds.includes(lesson.id) ? '✓' : lesson.id}
                    </div>
                    <h3>{lesson.title}</h3>
                    <p className="lesson-description">{lesson.description}</p>
                    <div className="lesson-keys">
                      {lesson.keys.map((key, index) => (
                        <span key={index} className="lesson-key">{key}</span>
                      ))}
                    </div>
                    <div className="lesson-finger-guide">
                      <h4>{texts.fingerPosition}</h4>
                      <p>{lesson.fingerGuide}</p>
                    </div>
                    <button 
                      className="start-lesson-btn"
                      onClick={() => handleLessonClick(lesson)}
                      disabled={lesson.locked}
                    >
                      {lesson.locked ? (language === 'hebrew' ? '🔒 נעול' : '🔒 Locked') : texts.startPractice}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsScreen; 