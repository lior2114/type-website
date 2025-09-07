import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { lessons } from '../data/lessons';
import Keyboard from './Keyboard';
import './LessonContent.css';

const LessonContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeText, setActiveText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [typingData, setTypingData] = useState({
    errors: 0,
    errorsByChar: new Map(),
    startTime: null,
    endTime: null
  });
  const [hasErrorOnCurrentChar, setHasErrorOnCurrentChar] = useState(false);
  const [inputStatus, setInputStatus] = useState('normal');
  const inputRef = useRef(null);
  const { updateUserProgress, user } = useAuth();

  useEffect(() => {
    const lessonId = parseInt(id);
    const lesson = lessons[language].find(l => l.id === lessonId);
    
    if (!lesson) {
      navigate('/lessons');
      return;
    }
    
    setCurrentLesson(lesson);
    // Build a shuffled variant by tokens (words/letter groups), preserving readability
    const shuffleTokens = (text) => {
      if (!text) return '';
      const tokens = text.split(' ');
      for (let i = tokens.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
      }
      return tokens.join(' ');
    };
    setActiveText(shuffleTokens(lesson.text));
    setCurrentCharIndex(0);
    setInputValue('');
    setIsActive(false);
    setIsCompleted(false);
    setStartTime(null);
    setEndTime(null);
    setHasErrorOnCurrentChar(false);
    setTypingData({
      errors: 0,
      errorsByChar: new Map(),
      startTime: null,
      endTime: null
    });
  }, [id, language, navigate]);

  useEffect(() => {
    if (currentLesson && inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
  }, [currentLesson, isCompleted]);

  const handleInputChange = async (e) => {
    if (!isActive || isCompleted) return;

    const input = e.target.value;
    const currentChar = activeText[currentCharIndex];
    
    // Update input value to show what user is typing
    setInputValue(input);
    
    if (input === currentChar) {
      // Correct character
      setCurrentCharIndex(prev => prev + 1);
      setInputValue('');
      setHasErrorOnCurrentChar(false); // Reset error flag
      setInputStatus('normal');
      
      if (currentCharIndex + 1 >= activeText.length) {
        // Lesson completed
        setEndTime(Date.now());
        setTypingData(prev => ({ ...prev, endTime: Date.now() }));
        setIsActive(false);
        setIsCompleted(true);

        // עדכון התקדמות לשרת
        try {
          const timeElapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          const accuracy = (() => {
            const total = (currentCharIndex + 1) + (typingData.errors);
            return total > 0 ? Math.round(((currentCharIndex + 1) / total) * 100) : 100;
          })();
          const cpm = (() => {
            if (!startTime) return 0;
            const elapsed = (Date.now() - startTime) / 1000 / 60;
            return elapsed > 0 ? Math.round((currentCharIndex + 1) / elapsed) : 0;
          })();
          if (user && typeof updateUserProgress === 'function') {
            await updateUserProgress({
              lesson_id: String(currentLesson.id),
              lesson_name: currentLesson.title,
              lesson_type: 'lesson',
              wpm: Math.round(cpm / 5),
              accuracy,
              errors: typingData.errors,
              time_spent: timeElapsed,
              language: language
            });
            window.dispatchEvent(new Event('user-progress-updated'));
          }
          // Mark lesson as completed locally (for guests) and trigger progress update
          try {
            const key = `completedLessons_${language}`;
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            const set = new Set(Array.isArray(stored) ? stored : []);
            set.add(currentLesson.id);
            localStorage.setItem(key, JSON.stringify(Array.from(set)));
            window.dispatchEvent(new Event('lesson-completed'));
          } catch {}
        } catch (e) {}
      }
    } else if (input.length > 0) {
      // Check if current input is correct so far
      const isCorrectSoFar = activeText.substring(currentCharIndex).startsWith(input);
      
      if (isCorrectSoFar) {
        setInputStatus('normal');
      } else {
        // Input is incorrect - keep red border
        setInputStatus('error');
        // Only count as error once per character
        if (input.length === 1 && !hasErrorOnCurrentChar) {
          setTypingData(prev => ({
            ...prev,
            errors: prev.errors + 1,
            errorsByChar: new Map(prev.errorsByChar).set(currentChar, (prev.errorsByChar.get(currentChar) || 0) + 1)
          }));
          setHasErrorOnCurrentChar(true);
        }
      }
    } else {
      // If input is empty, check if there was an error on current char
      if (hasErrorOnCurrentChar) {
        setInputStatus('error');
      } else {
        setInputStatus('normal');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      navigate('/lessons');
    }
  };

  const handleKeyUp = () => {
    // Don't reset error status here - let it persist until corrected
    // setHasErrorOnCurrentChar(false);
    // setInputStatus('normal');
  };

  const restartLesson = () => {
    setCurrentCharIndex(0);
    setInputValue('');
    setIsActive(false);
    setIsCompleted(false);
    setStartTime(null);
    setEndTime(null);
    setHasErrorOnCurrentChar(false);
    setInputStatus('normal');
    setTypingData({
      errors: 0,
      errorsByChar: new Map(),
      startTime: null,
      endTime: null
    });
    // Re-shuffle the tokens when restarting the lesson
    if (currentLesson?.text) {
      const tokens = currentLesson.text.split(' ');
      for (let i = tokens.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
      }
      setActiveText(tokens.join(' '));
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const pauseLesson = () => {
    setIsActive(false);
  };

  const calculateProgress = () => {
    if (!currentLesson) return 0;
    const total = activeText.length || 1;
    return Math.round((currentCharIndex / total) * 100);
  };

  const calculateCPM = () => {
    if (!startTime) return 0;
    const endTs = isCompleted && endTime ? endTime : (isActive ? Date.now() : null);
    if (!endTs) return 0;
    const elapsed = (endTs - startTime) / 1000 / 60; // minutes
    return elapsed > 0 ? Math.round(currentCharIndex / elapsed) : 0;
  };

  const calculateAccuracy = () => {
    const total = currentCharIndex + typingData.errors;
    return total > 0 ? Math.round((currentCharIndex / total) * 100) : 100;
  };

  const getCurrentKey = () => {
    if (!currentLesson || currentCharIndex >= activeText.length) return null;
    return activeText[currentCharIndex];
  };

  const getCurrentKeys = () => {
    if (!currentLesson) return [];
    return currentLesson.keys;
  };

  const isPassed = () => {
    const accuracy = calculateAccuracy();
    return accuracy >= 80; // Pass if accuracy >= 80% only
  };

  const getNextLessonId = () => {
    const currentIndex = lessons[language].findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons[language][currentIndex + 1];
    return nextLesson ? nextLesson.id : null;
  };

  const goToNextLesson = () => {
    const nextId = getNextLessonId();
    if (nextId) {
      navigate(`/lesson/${nextId}`);
    } else {
      navigate('/lessons');
    }
  };

  if (!currentLesson) {
    return <div>Loading...</div>;
  }

  // Show results screen when lesson is completed
  if (isCompleted) {
    const passed = isPassed();
    const finalCPM = calculateCPM();
    const finalAccuracy = calculateAccuracy();
    const timeElapsed = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;

    return (
      <div className="lesson-content" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="lesson-container">
          <div className="lesson-results card">
            <h2>{passed ? texts.lessonPassed : texts.lessonFailed}</h2>
            
            <div className="results-stats">
              <div className="result-stat">
                <div className="stat-value">{finalCPM}</div>
                <div>{texts.cpm}</div>
              </div>
              <div className="result-stat">
                <div className="stat-value">{finalAccuracy}%</div>
                <div>{texts.accuracy}</div>
              </div>
              <div className="result-stat">
                <div className="stat-value">{timeElapsed}s</div>
                <div>{texts.time}</div>
              </div>
              <div className="result-stat">
                <div className="stat-value">{typingData.errors}</div>
                <div>{texts.errors}</div>
              </div>
            </div>

            <div className="pass-criteria">
              <h3>{texts.passCriteria}</h3>
              <ul>
                <li className={finalAccuracy >= 80 ? 'passed' : 'failed'}>
                  {texts.accuracyRequired.replace('{accuracy}', finalAccuracy).replace('{status}', finalAccuracy >= 80 ? '✅' : '❌')}
                </li>
              </ul>
            </div>

            <div className="results-actions">
              {passed ? (
                <button className="btn btn-primary" onClick={goToNextLesson}>
                  {getNextLessonId() ? texts.nextLesson : texts.backToLessons}
                </button>
              ) : (
                <button className="btn btn-primary" onClick={restartLesson}>
                  {texts.tryAgain}
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => navigate('/lessons')}>
                {texts.backToLessons}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-content" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="lesson-container">
        <div className="lesson-header">
          <h1>{currentLesson.title}</h1>
          <p>{currentLesson.description}</p>
          <div className="lesson-description">
            <h4>{texts.fingerPosition}</h4>
            <p dir="auto">{currentLesson.fingerGuide}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{calculateProgress()}%</h3>
            <p>{language === 'hebrew' ? 'הושלם' : 'Completed'}</p>
          </div>
          <div className="stat-card">
            <h3>{calculateCPM()}</h3>
            <p>{texts.cpm}</p>
          </div>
          <div className="stat-card">
            <h3>{calculateAccuracy()}%</h3>
            <p>{texts.accuracy}</p>
          </div>
          <div className="stat-card">
            <h3>{typingData.errors}</h3>
            <p>{texts.errors}</p>
          </div>
        </div>

        <div className="typing-area">
          <div className="text-display">
            {activeText.split('').map((char, index) => (
              <span
                key={index}
                className={`char ${
                  index < currentCharIndex ? 'correct' :
                  index === currentCharIndex ? 'current' : ''
                }`}
              >
                {index === currentCharIndex && <span className="current-char">{char}</span>}
                {index !== currentCharIndex && char}
              </span>
            ))}
          </div>
          
          <div className="typing-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              placeholder={texts.typeHere}
              disabled={!isActive && currentCharIndex > 0}
              className={`typing-input ${inputStatus}`}
            />
          </div>
        </div>

        <div className="control-buttons">
          {!isActive && currentCharIndex === 0 ? (
            <button className="control-btn" onClick={() => {
              setIsActive(true);
              setStartTime(Date.now());
              setTypingData(prev => ({ ...prev, startTime: Date.now() }));
              inputRef.current?.focus();
            }}>
              {texts.startPractice}
            </button>
          ) : (
            <button className="control-btn secondary" onClick={pauseLesson}>
              {texts.pause}
            </button>
          )}
          <button className="control-btn secondary" onClick={restartLesson}>
            {texts.restart}
          </button>
          <button className="control-btn secondary" onClick={() => navigate('/lessons')}>
            {texts.backToLessons}
          </button>
        </div>

        <div className="keyboard-section">
          <Keyboard 
            targetKeys={getCurrentKeys()}
            currentKey={getCurrentKey()}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonContent; 