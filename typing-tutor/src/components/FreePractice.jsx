import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { freePracticeTexts } from '../data/lessons';
import Keyboard from './Keyboard';
import './FreePractice.css';

const FreePractice = () => {
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [difficulty, setDifficulty] = useState('medium');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [typingData, setTypingData] = useState({
    characters: 0,
    errors: 0,
    errorsByChar: new Map()
  });
  const [customWords, setCustomWords] = useState('');
  // Force custom words mode only
  const [useCustomWords, setUseCustomWords] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(true);
  const [inputStatus, setInputStatus] = useState('normal'); // 'normal', 'error', 'success'
  const [showWordsCompletedDialog, setShowWordsCompletedDialog] = useState(false);
  const [repeatCustomWords, setRepeatCustomWords] = useState(false);
  const [customInputStatus, setCustomInputStatus] = useState('normal'); // 'normal' | 'error' | 'success'
  const [customInputMessage, setCustomInputMessage] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const { updateUserProgress, user } = useAuth();

  const practiceTexts = freePracticeTexts[language]?.[difficulty] || freePracticeTexts.hebrew.easy;
  const words = customWords.split(/\s+/).filter(word => word.trim().length > 0);

  const timeOptions = [
    { value: 30, label: language === 'hebrew' ? '30 שניות' : '30 seconds' },
    { value: 60, label: language === 'hebrew' ? 'דקה' : '1 minute' },
    { value: 120, label: language === 'hebrew' ? '2 דקות' : '2 minutes' },
    { value: 300, label: language === 'hebrew' ? '5 דקות' : '5 minutes' }
  ];

  // Reset practice when language or difficulty changes
  useEffect(() => {
    if (isActive) {
      restartPractice();
    }
  }, [language, difficulty, useCustomWords]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endPractice();
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
  }, [isActive, timeRemaining]);

  const startPractice = () => {
    if (customWords.trim().length === 0) {
      alert(language === 'hebrew' ? 'אנא הכנס מילים לתרגול' : 'Please enter words to practice');
      return;
    }
    
    setIsActive(true);
    setStartTime(Date.now());
    setTimeRemaining(timeLimit);
    setCurrentWordIndex(0);
    setInputValue('');
    setInputStatus('normal');
    setTypingData({ characters: 0, errors: 0, errorsByChar: new Map() });
    inputRef.current?.focus();
  };

  const pausePractice = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const restartPractice = () => {
    setIsActive(false);
    setIsCompleted(false);
    setCurrentWordIndex(0);
    setInputValue('');
    setInputStatus('normal');
    setTimeRemaining(timeLimit);
    setTypingData({ characters: 0, errors: 0, errorsByChar: new Map() });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const endPractice = useCallback(async () => {
    setIsActive(false);
    setIsCompleted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : timeLimit;
    const wpm = timeElapsed > 0 ? Math.round((typingData.characters / 5) / (timeElapsed / 60)) : 0;
    const accuracy = (typingData.characters + typingData.errors) > 0 ? 
      Math.round((typingData.characters / (typingData.characters + typingData.errors)) * 100) : 100;

    // עדכון התקדמות לשרת
    try {
      if (user && typeof updateUserProgress === 'function') {
        await updateUserProgress({
          lesson_id: 'free_practice',
          lesson_type: 'practice',
          wpm,
          accuracy,
          errors: typingData.errors,
          time_spent: Math.round(timeElapsed),
          language: language
        });
        window.dispatchEvent(new Event('user-progress-updated'));
      }
    } catch (e) {}
    
    navigate('/results', {
      state: {
        lessonId: null,
        practiceType: 'free',
        difficulty,
        typingData: {
          characters: typingData.characters,
          errors: typingData.errors,
          errorsByChar: typingData.errorsByChar
        },
        timeElapsed,
        wordsCompleted: currentWordIndex,
        wpm,
        accuracy,
        customWords: useCustomWords
      }
    });
  }, [navigate, difficulty, typingData, timeLimit, timeRemaining, currentWordIndex, words.length, useCustomWords, startTime, updateUserProgress, user]);

  const handleInputChange = (e) => {
    if (!isActive) return;

    const value = e.target.value;
    const currentWord = words[currentWordIndex];
    
    if (!currentWord) return;

    setInputValue(value);

    // Check if the input matches the current word
    if (value === currentWord) {
      // Word completed successfully
      setInputStatus('success');
      setTypingData(prev => ({
        ...prev,
        characters: prev.characters + currentWord.length
      }));

      // Move to next word after a short delay
      setTimeout(() => {
        setInputValue('');
        setInputStatus('normal');
        const nextWordIndex = currentWordIndex + 1;
        
        // Check if we've completed all custom words
        if (nextWordIndex >= words.length) {
          if (repeatCustomWords) {
            // Reset to first word and continue
            setCurrentWordIndex(0);
          } else {
            // End practice
            endPractice();
          }
        } else {
          setCurrentWordIndex(nextWordIndex);
        }
      }, 200);
    } else if (value.length > 0) {
      // Check if current input is correct so far
      const isCorrectSoFar = currentWord.startsWith(value);
      
      if (isCorrectSoFar) {
        setInputStatus('normal');
      } else {
        // Input is incorrect
        setInputStatus('error');
        setTypingData(prev => ({
          ...prev,
          errors: prev.errors + 1,
          errorsByChar: new Map(prev.errorsByChar).set(
            currentWord, 
            (prev.errorsByChar.get(currentWord) || 0) + 1
          )
        }));
      }
    } else {
      setInputStatus('normal');
    }
  };

  const calculateWPM = () => {
    if (!startTime || !isActive) return 0;
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    return elapsed > 0 ? Math.round((typingData.characters / 5) / elapsed) : 0;
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
    if (!isActive || currentWordIndex >= words.length) return null;
    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[inputValue.length];
    return currentChar || null;
  };

  const getCurrentKeys = () => {
    if (!isActive || currentWordIndex >= words.length) return [];
    const currentWord = words[currentWordIndex];
    return currentWord.split('').filter((char, index) => index >= inputValue.length);
  };

  const handleCustomWordsChange = (e) => {
    const inputValue = e.target.value;
    // Block mixed-language input: keep only the active language letters
    const filtered = language === 'hebrew'
      ? inputValue.replace(/[A-Za-z]/g, '')
      : inputValue.replace(/[\u0590-\u05FF]/g, '');
    if (filtered.split(/\s+/).filter(word => word.trim().length > 0).length <= 500) {
      setCustomWords(filtered);
    }

    if (inputValue !== filtered && inputValue.length > 0) {
      if (language === 'hebrew') {
        setCustomInputMessage('אתה על אנגלית');
      } else {
        setCustomInputMessage("You're on Hebrew");
      }
      setCustomInputStatus('error');
    } else if (filtered.trim().length > 0) {
      // Valid input present
      if (language === 'hebrew') {
        setCustomInputMessage('קלט תקין');
      } else {
        setCustomInputMessage('Valid input');
      }
      setCustomInputStatus('success');
    } else {
      setCustomInputMessage('');
      setCustomInputStatus('normal');
    }
  };

  const getWordCount = () => {
    return customWords.split(/\s+/).filter(word => word.trim().length > 0).length;
  };

  if (isCompleted) {
    return null; // Will navigate to results
  }

  return (
    <div className="free-practice" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="practice-container">
        {!isActive ? (
            <div className="practice-settings card">
            <h2>{texts.freePractice}</h2>
            

            {showCustomInput && (
              <div className="setting-group">
                <h3>{texts.enterCustomWords}</h3>
                <textarea
                  value={customWords}
                  onChange={handleCustomWordsChange}
                  placeholder={texts.customWordsPlaceholder}
                  className={`custom-words-input ${customInputStatus}`}
                  rows={6}
                />
                {customInputMessage && (
                  <div className={`input-hint ${customInputStatus}`}>
                    {customInputMessage}
                  </div>
                )}
                <div className="word-count">
                  {texts.wordCount} {getWordCount()}/500
                </div>
                
                <div className="setting-group">
                  <h3>{language === 'hebrew' ? 'כשהמילים יסתיימו:' : 'When words are completed:'}</h3>
                  <div className="repeat-options">
                    <button
                      className={`btn ${!repeatCustomWords ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setRepeatCustomWords(false)}
                    >
                      {language === 'hebrew' ? 'סיים את התרגול' : 'Finish Practice'}
                    </button>
                    <button
                      className={`btn ${repeatCustomWords ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setRepeatCustomWords(true)}
                    >
                      {language === 'hebrew' ? 'המשך עם אותן מילים' : 'Continue with Same Words'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="setting-group">
              <h3>{texts.selectTime}</h3>
              <div className="time-options">
                {timeOptions.map(option => (
                  <button
                    key={option.value}
                    className={`btn ${timeLimit === option.value ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTimeLimit(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="practice-actions">
              <button className="btn btn-primary" onClick={startPractice}>
                {texts.startPractice}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                {texts.backToMenu}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="practice-header">
              <h2>{texts.freePractice}</h2>
              <div className="practice-stats">
                <div className="stat">
                  <div className="stat-value">{formatTime(timeRemaining)}</div>
                  <div>{texts.timeLeft}</div>
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
                  <div className="stat-value">{currentWordIndex}</div>
                  <div>{texts.wordsTyped}</div>
                </div>
              </div>
            </div>

            <div className="typing-area card">
              <div className="text-to-type">
                {words.slice(currentWordIndex, currentWordIndex + 10).map((word, index) => (
                  <span
                    key={currentWordIndex + index}
                    className={`word ${index === 0 ? 'current' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
              
              <div className="typing-input-container">
                <label>{texts.currentWord}: {words[currentWordIndex]}</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={texts.typeHere}
                  className={`typing-input ${inputStatus}`}
                />
              </div>
            </div>

            <Keyboard 
              targetKeys={getCurrentKeys()}
              currentKey={getCurrentKey()}
            />

            <div className="practice-controls">
              <button className="btn btn-secondary" onClick={pausePractice}>
                {texts.pause}
              </button>
              <button className="btn btn-secondary" onClick={restartPractice}>
                {texts.restart}
              </button>
              <button className="btn btn-secondary" onClick={endPractice}>
                {texts.finish}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreePractice; 