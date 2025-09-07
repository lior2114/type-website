import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessons } from '../data/lessons';
import './LessonsScreen.css';

const TranslatedHebrewLessons = () => {
  const navigate = useNavigate();
  const { user, getCompletedLessons } = useAuth();
  const hebrewLessons = lessons.hebrew || [];
  const [completedIds, setCompletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          // משתמש מחובר - טעינה מ-Firebase (מצב מתורגם)
          const completed = await getCompletedLessons('hebrew', true);
          setCompletedIds(completed);
        } else {
          // משתמש לא מחובר - טעינה מ-localStorage (מצב מתורגם)
          const key = 'completedLessons_hebrew_translated';
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
    const total = hebrewLessons.length || 1;
    const progress = Math.round((completedIds.length / total) * 100);
    // וידוא שההתקדמות לא עולה על 100% ולא יורדת מתחת ל-0%
    return Math.max(0, Math.min(100, progress));
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      navigate(`/translated-hebrew-lesson/${lesson.id}`);
    }
  };

  const grouped = hebrewLessons.reduce((acc, l) => {
    const key = l.group || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  const groupTitleEn = (group) => {
    const map = {
      'כללי': 'General',
      'אצבע מורה': 'Index Finger',
      'אצבע אמצעית': 'Middle Finger',
      'אמה': 'Middle Finger',
      'אצבע קמיצה': 'Ring Finger',
      'קמיצה': 'Ring Finger',
      'זרת': 'Pinky',
    };
    return map[group] || 'General';
  };

  const buildLessonTitleEn = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `Lesson ${lesson.id}: ${keys}`;
  };

  const buildDescriptionEn = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `Practice letters: ${keys}`;
  };

  const buildFingerGuideEn = (lesson) => {
    const keys = (lesson.keys || []).join(' ');
    return `Place your fingers on the keyboard for: ${keys}`;
  };

  if (isLoading) {
    return (
      <div className="lessons-screen" dir="ltr">
        <div className="lessons-container">
          <div className="lessons-header" dir="ltr">
            <h1 dir="ltr">Translated Hebrew Lessons</h1>
            <p dir="ltr">Loading progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-screen" dir="ltr">
      <div className="lessons-container">
        <div className="lessons-header" dir="ltr">
          <h1 dir="ltr">Translated Hebrew Lessons</h1>
          {user ? (
            <div className="user-progress-card" dir="ltr">
              <div className="user-info">
                <span className="lessons-user-name">{user.first_name} {user.last_name}</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">Personal Progress</span>
              </div>
            </div>
          ) : (
            <div className="user-progress-card" dir="ltr">
              <div className="user-info">
                <span className="lessons-user-name">Guest</span>
                <span className="progress-percent">{calculateProgress()}%</span>
                <span className="user-label">General Progress</span>
              </div>
            </div>
          )}
        </div>

        <div className="lessons-grid">
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group} className="lesson-group" dir="ltr">
              <h2 className="lesson-group-title" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>{groupTitleEn(group)}</h2>
              <div className="lesson-group-grid">
                {list.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`lesson-card ${completedIds.includes(lesson.id) ? 'completed' : ''} ${lesson.locked ? 'locked' : ''}`}
                  >
                    <div className="lesson-progress">
                      {completedIds.includes(lesson.id) ? '✓' : lesson.id}
                    </div>
                    <h3>{buildLessonTitleEn(lesson)}</h3>
                    <p className="lesson-description">{buildDescriptionEn(lesson)}</p>
                    <div className="lesson-keys">
                      {lesson.keys.map((key, index) => (
                        <span key={index} className="lesson-key">{key}</span>
                      ))}
                    </div>
                    <div className="lesson-finger-guide">
                      <h4>Finger Position</h4>
                      <p>{buildFingerGuideEn(lesson)}</p>
                    </div>
                    <button 
                      className="start-lesson-btn"
                      onClick={() => handleLessonClick(lesson)}
                      disabled={lesson.locked}
                    >
                      {lesson.locked ? '🔒 Locked' : 'Start Practice'}
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

export default TranslatedHebrewLessons;
