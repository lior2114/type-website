import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessons } from '../data/lessons';
import './LessonsScreen.css';

const TranslatedEnglishLessons = () => {
  const navigate = useNavigate();
  const { user, getCompletedLessons } = useAuth();
  // In US->IL mode, hide lesson 15 as requested
  const englishLessons = (lessons.english || []).filter(l => l.id !== 15);
  const [completedIds, setCompletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          // משתמש מחובר - טעינה מ-Firebase (מצב מתורגם)
          const completed = await getCompletedLessons('english', true);
          setCompletedIds(completed);
        } else {
          // משתמש לא מחובר - טעינה מ-localStorage (מצב מתורגם)
          const key = 'completedLessons_english_translated';
          const arr = JSON.parse(localStorage.getItem(key) || '[]');
          setCompletedIds(Array.isArray(arr) ? arr : []);
        }
      } catch (error) {
        console.error('Error loading completed lessons:', error);
        setCompletedIds([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    load();
    const handler = () => load();
    window.addEventListener('lesson-completed', handler);
    window.addEventListener('user-progress-updated', handler);
    return () => {
      window.removeEventListener('lesson-completed', handler);
      window.removeEventListener('user-progress-updated', handler);
    };
  }, [user, getCompletedLessons]);

  const calculateProgress = () => {
    const total = englishLessons.length || 1;
    const progress = Math.round((completedIds.length / total) * 100);
    // וידוא שההתקדמות לא עולה על 100% ולא יורדת מתחת ל-0%
    return Math.max(0, Math.min(100, progress));
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      navigate(`/translated-english-lesson/${lesson.id}`);
    }
  };

  const grouped = englishLessons.reduce((acc, l) => {
    const key = l.group || 'כללי';
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  const groupTitleHe = (group) => {
    const map = {
      'Index Finger': 'אצבע מורה',
      'Middle Finger': 'אצבע אמצעית',
      'Ring Finger': 'אצבע קמיצה',
      'Pinky': 'זרת',
      'General': 'כללי',
    };
    return map[group] || group || 'כללי';
  };

  const buildLessonTitleHe = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `שיעור ${lesson.id}: ${keys}`;
  };

  const buildDescriptionHe = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `תרגול אותיות: ${keys}`;
  };

  const buildFingerGuideHe = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `מקמו את האצבעות בהתאם על המקלדת לאותיות: ${keys}`;
  };

  if (isLoading) {
    return (
      <div className="lessons-screen" dir="rtl">
        <div className="lessons-container">
          <div className="lessons-header">
            <h1>שיעורי אנגלית מתורגמים</h1>
            <p>טוען התקדמות...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-screen" dir="rtl">
      <div className="lessons-container">
        <div className="lessons-header">
          <h1>שיעורי אנגלית מתורגמים</h1>
          {user ? (
            <div className="user-progress-card">
              <div className="user-info">
                <span className="lessons-user-name">{user.first_name} {user.last_name}</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">התקדמות אישית</span>
              </div>
            </div>
          ) : (
            <div className="user-progress-card">
              <div className="user-info">
                <span className="lessons-user-name">אורח</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">התקדמות כללית</span>
              </div>
            </div>
          )}
        </div>

        <div className="lessons-grid">
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group} className="lesson-group">
              <h2 className="lesson-group-title">{groupTitleHe(group)}</h2>
              <div className="lesson-group-grid">
                {list.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`lesson-card ${completedIds.includes(lesson.id) ? 'completed' : ''} ${lesson.locked ? 'locked' : ''}`}
                  >
                    <div className="lesson-progress">
                      {completedIds.includes(lesson.id) ? '✓' : lesson.id}
                    </div>
                    <h3>{buildLessonTitleHe(lesson)}</h3>
                    <p className="lesson-description">{buildDescriptionHe(lesson)}</p>
                    <div className="lesson-keys">
                      {lesson.keys.map((key, index) => (
                        <span key={index} className="lesson-key">{key}</span>
                      ))}
                    </div>
                    <div className="lesson-finger-guide">
                      <h4>מיקום אצבעות</h4>
                      <p>{buildFingerGuideHe(lesson)}</p>
                    </div>
                    <button 
                      className="start-lesson-btn"
                      onClick={() => handleLessonClick(lesson)}
                      disabled={lesson.locked}
                    >
                      {lesson.locked ? '🔒 נעול' : 'התחל תרגול'}
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

export default TranslatedEnglishLessons;
