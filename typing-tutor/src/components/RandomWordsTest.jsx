import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { freePracticeTexts, preparedWordBank } from '../data/lessons';
import Keyboard from './Keyboard';
import './RandomWordsTest.css';

const RandomWordsTest = () => {
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [selectedTime, setSelectedTime] = useState(60);
  const [userLockedTime, setUserLockedTime] = useState(false); // user-picked time persists across difficulty changes
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [typingData, setTypingData] = useState({
    characters: 0,
    errors: 0,
    wordsTyped: 0
  });
  const [hasErrorOnCurrentWord, setHasErrorOnCurrentWord] = useState(false);
  const [words, setWords] = useState([]);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const { updateUserProgress, user } = useAuth();

  const difficultyOptions = [
    { value: 'easy', label: texts.easy, time: 30 },
    { value: 'medium', label: texts.medium, time: 60 },
    { value: 'hard', label: texts.hard, time: 90 }
  ];

  const timeOptions = [
    { value: 30, label: language === 'hebrew' ? '30 שניות' : '30 seconds' },
    { value: 60, label: language === 'hebrew' ? 'דקה' : '1 minute' },
    { value: 120, label: language === 'hebrew' ? '2 דקות' : '2 minutes' },
    { value: 300, label: language === 'hebrew' ? '5 דקות' : '5 minutes' }
  ];

  // Reset test when language changes
  useEffect(() => {
    if (isTestStarted) {
      resetTest();
    }
  }, [language]);

  // Build a unique, filtered, shuffled pool (up to 300) according to difficulty
  const buildWordPool = (difficulty, maxCount = 300) => {
    // Prefer curated, prepared 300-word banks per language+difficulty
    const prepared = preparedWordBank?.[language]?.[difficulty];
    const baseList = (Array.isArray(prepared) && prepared.length > 0)
      ? prepared
      : (freePracticeTexts[language]?.[difficulty] || freePracticeTexts.hebrew.easy);

    const isSingleWord = (w) => typeof w === 'string' && !w.includes(' ');
    const isAllowedLength = (w) => {
      const len = (w || '').length;
      if (difficulty === 'medium') return len >= 5 && len <= 7;
      if (difficulty === 'hard') return len >= 6;
      return true; // easy
    };

    // Helpers to generate fallback unique words if the curated lists are not enough
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getAlphabet = () => {
      if (language === 'hebrew') {
        return Array.from('אבגדהוזחטיכלמנסעפצקרשתךםןףץ');
      }
        // english
      return Array.from('abcdefghijklmnopqrstuvwxyz');
    };
    const chooseLength = () => {
      if (difficulty === 'medium') return randomInt(5, 7);
      if (difficulty === 'hard') return randomInt(6, 10);
      return randomInt(3, 6);
    };
    const generateRandomWord = () => {
      const alphabet = getAlphabet();
      const len = chooseLength();
      let out = '';
      for (let i = 0; i < len; i += 1) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
    };

    const seen = new Set();
    const unique = [];
    for (const w of baseList) {
      if (!w || typeof w !== 'string') continue;
      if (!isSingleWord(w)) continue; // disallow multi-word entries
      if (!isAllowedLength(w)) continue;
      if (seen.has(w)) continue;
      seen.add(w);
      unique.push(w);
    }

    // If not enough unique words, try to augment from other lists (same language)
    if (unique.length < maxCount) {
      const candidates = [];
      const allLevels = ['easy', 'medium', 'hard'];
      for (const lvl of allLevels) {
        const list = freePracticeTexts[language]?.[lvl] || [];
        for (const w of list) {
          if (!w || typeof w !== 'string') continue;
          if (!isSingleWord(w)) continue;
          if (!isAllowedLength(w)) continue;
          candidates.push(w);
        }
      }
      for (const w of candidates) {
        if (unique.length >= maxCount) break;
        if (seen.has(w)) continue;
        seen.add(w);
        unique.push(w);
      }
    }

    // Do not synthesize words: only use pre-defined word lists

    // Shuffle (Fisher–Yates)
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }

    return unique.slice(0, maxCount);
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestComplete(false);
    setCurrentWordIndex(0);
    setInputValue('');
    setTimeRemaining(selectedTime);
    setHasErrorOnCurrentWord(false);
    setTypingData({ characters: 0, errors: 0, wordsTyped: 0 });
    setWords([]);
    setStartTime(null);
    setEndTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startTest = () => {
    const pool = buildWordPool(selectedDifficulty, 300);
    setWords(pool);
    setIsTestStarted(true);
    setIsTestComplete(false);
    setTimeRemaining(selectedTime);
    setStartTime(Date.now());
    setEndTime(null);
    setCurrentWordIndex(0);
    setInputValue('');
    setHasErrorOnCurrentWord(false);
    setTypingData({ characters: 0, errors: 0, wordsTyped: 0 });
    inputRef.current?.focus();
  };

  const endTest = async () => {
    setIsTestStarted(false);
    setIsTestComplete(true);
    const endTs = Date.now();
    setEndTime(endTs);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // עדכון התקדמות לשרת
    try {
      const timeElapsedSec = startTime ? Math.round((endTs - startTime) / 1000) : selectedTime;
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      if (user && typeof updateUserProgress === 'function') {
        await updateUserProgress({
          lesson_id: 'random_words',
          lesson_type: 'test',
          wpm,
          accuracy,
          errors: typingData.errors,
          time_spent: timeElapsedSec,
          language: language
        });
        // אירוע גלובלי לריענון מיידי של הפרופיל
        window.dispatchEvent(new Event('user-progress-updated'));
      }
    } catch (e) {
      // שקט – לא חוסם UI
    }
  };

  useEffect(() => {
    if (isTestStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestStarted, timeRemaining]);

  const handleInputChange = (e) => {
    if (!isTestStarted) return;

    const value = e.target.value;
    const currentWord = words[currentWordIndex];
    
    if (!currentWord) return;

    setInputValue(value);

    if (value.trim() === currentWord) {
      setTypingData(prev => ({
        ...prev,
        characters: prev.characters + currentWord.length,
        wordsTyped: prev.wordsTyped + 1
      }));

      setInputValue('');
      setHasErrorOnCurrentWord(false); // Reset error flag
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          // Exhausted the pool -> end the test and show results
          endTest();
          return prev; // keep index bounded
        }
        return nextIndex;
      });
    } else if (value.length > 0) {
      // Check if the input is now correct (user corrected the error)
      if (currentWord.startsWith(value)) {
        setHasErrorOnCurrentWord(false); // Clear error flag when user corrects
      } else if (!hasErrorOnCurrentWord) {
        // Only count as error once per word
        setTypingData(prev => ({
          ...prev,
          errors: prev.errors + 1
        }));
        setHasErrorOnCurrentWord(true);
      }
    }
  };

  const calculateWPM = () => {
    if (!startTime) return 0;
    const endTimestamp = isTestComplete && endTime ? endTime : Date.now();
    const elapsedMinutes = (endTimestamp - startTime) / 1000 / 60;
    return elapsedMinutes > 0 ? Math.round((typingData.characters / 5) / elapsedMinutes) : 0;
  };

  const calculateAccuracy = () => {
    const total = typingData.characters + typingData.errors;
    return total > 0 ? Math.round((typingData.characters / total) * 100) : 100;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentKey = () => {
    if (!isTestStarted || currentWordIndex >= words.length) return null;
    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[inputValue.length];
    return currentChar || null;
  };

  const getCurrentKeys = () => {
    if (!isTestStarted || currentWordIndex >= words.length) return [];
    const currentWord = words[currentWordIndex];
    return currentWord.split('').filter((char, index) => index >= inputValue.length);
  };

  if (isTestComplete) {
    return (
      <div className="random-test" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="test-results card">
          <h2>{texts.testComplete}</h2>
          <div className="results-stats">
            <div className="result-stat">
              <div className="stat-value">{calculateWPM()}</div>
              <div>{texts.wpm}</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{calculateAccuracy()}%</div>
              <div>{texts.accuracy}</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{typingData.wordsTyped}</div>
              <div>{texts.wordsTyped}</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{typingData.errors}</div>
              <div>{texts.errors}</div>
            </div>
          </div>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={resetTest}>
              {texts.tryAgain}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              {texts.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="random-test" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="test-setup card">
          <h2>{texts.testSettings}</h2>
          
          <div className="setup-section">
            <h3>{texts.selectDifficulty}</h3>
            <div className="difficulty-options">
                {difficultyOptions.map(option => (
                <button
                  key={option.value}
                  className={`btn ${selectedDifficulty === option.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setSelectedDifficulty(option.value);
                    if (!userLockedTime) {
                      setSelectedTime(60); // default to 1 minute when switching difficulty
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <h3>{texts.selectTime}</h3>
            <div className="time-options">
              {timeOptions.map(option => (
                <button
                  key={option.value}
                  className={`btn ${selectedTime === option.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setSelectedTime(option.value); setUserLockedTime(true); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-actions">
            <button className="btn btn-primary" onClick={startTest}>
              {texts.startTest}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              {texts.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="random-test" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="test-header">
        <h2>{texts.randomWordsTest}</h2>
        <div className="test-stats">
          <div className="stat">
            <div className="stat-value">{formatTime(timeRemaining)}</div>
            <div>{texts.secondsLeft}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{calculateWPM()}</div>
            <div>{texts.wpm}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{calculateAccuracy()}%</div>
            <div>{texts.accuracy}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{typingData.wordsTyped}</div>
            <div>{texts.wordsTyped}</div>
          </div>
        </div>
      </div>

      <div className="test-area card">
        <div className="words-display">
          {words.slice(currentWordIndex, currentWordIndex + 10).map((word, index) => (
            <span
              key={currentWordIndex + index}
              className={`word ${index === 0 ? 'current' : ''}`}
            >
              {word}
            </span>
          ))}
        </div>
        
        <div className="input-area">
          <label>{texts.currentWord}: {words[currentWordIndex]}</label>
          <div className="typing-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={texts.typeHere}
              className={`typing-input ${
                hasErrorOnCurrentWord ? 'error' : 
                inputValue.length > 0 && words[currentWordIndex]?.startsWith(inputValue) ? 'success' : ''
              }`}
            />
          </div>
        </div>
      </div>

      <Keyboard 
        targetKeys={getCurrentKeys()}
        currentKey={getCurrentKey()}
      />

      <div className="test-controls">
        <button className="btn btn-secondary" onClick={endTest}>
          {texts.pause}
        </button>
      </div>
    </div>
  );
};

export default RandomWordsTest; 