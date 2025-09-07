import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { freePracticeTexts, preparedWordBank } from '../data/lessons';
import { db } from '../../firebase.jsx';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import Keyboard from './Keyboard';
import './OnlineBattle.css';

const OnlineBattle = () => {
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const { user } = useAuth();
  
  // Battle states
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleComplete, setBattleComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90); // 1.5 minutes
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [words, setWords] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [battleId, setBattleId] = useState(null);
  
  // User stats
  const [userStats, setUserStats] = useState({
    wpm: 0,
    wordsTyped: 0,
    errors: 0,
    accuracy: 100
  });
  
  // Refs
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const leaderboardRef = useRef(null);

  // Add to leaderboard
  const addToLeaderboard = async (leaderboardData) => {
    try {
      // Check if user already has a better score
      const existingQuery = query(
        collection(db, 'leaderboard'),
        where('userId', '==', leaderboardData.userId),
        where('language', '==', leaderboardData.language)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      
      if (existingSnapshot.empty) {
        // No existing score, add new one
        await addDoc(collection(db, 'leaderboard'), leaderboardData);
      } else {
        // Check if new score is better
        existingSnapshot.forEach(async (doc) => {
          const existingData = doc.data();
          if (leaderboardData.wpm > existingData.wpm) {
            // Update with better score
            await updateDoc(doc.ref, {
              wpm: leaderboardData.wpm,
              accuracy: leaderboardData.accuracy,
              wordsTyped: leaderboardData.wordsTyped,
              errors: leaderboardData.errors,
              battleId: leaderboardData.battleId,
              timestamp: leaderboardData.timestamp
            });
          }
        });
      }
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
    }
  };

  // Build word pool with mixed difficulties
  const buildMixedWordPool = (maxCount = 300) => {
    const easyWords = freePracticeTexts[language]?.easy || freePracticeTexts.hebrew.easy;
    const mediumWords = preparedWordBank[language]?.medium || preparedWordBank.hebrew.medium;
    const hardWords = preparedWordBank[language]?.hard || preparedWordBank.hebrew.hard;
    
    // Mix difficulties equally (33% each)
    const mixedWords = [];
    const wordsPerDifficulty = Math.floor(maxCount / 3);
    
    // Add easy words
    const shuffledEasy = [...easyWords].sort(() => Math.random() - 0.5);
    mixedWords.push(...shuffledEasy.slice(0, wordsPerDifficulty));
    
    // Add medium words  
    const shuffledMedium = [...mediumWords].sort(() => Math.random() - 0.5);
    mixedWords.push(...shuffledMedium.slice(0, wordsPerDifficulty));
    
    // Add hard words
    const shuffledHard = [...hardWords].sort(() => Math.random() - 0.5);
    mixedWords.push(...shuffledHard.slice(0, wordsPerDifficulty));
    
    // Shuffle the final mix
    return mixedWords.sort(() => Math.random() - 0.5);
  };

  // Initialize battle
  const startBattle = async () => {
    try {
      const wordPool = buildMixedWordPool(300);
      setWords(wordPool);
      setBattleStarted(true);
      setBattleComplete(false);
      setTimeRemaining(90);
      setStartTime(Date.now());
      setEndTime(null);
      setCurrentWordIndex(0);
      setInputValue('');
      setUserStats({
        wpm: 0,
        wordsTyped: 0,
        errors: 0,
        accuracy: 100
      });

      // Create battle entry in Firestore
      const battleData = {
        userId: user?.user_id || 'anonymous',
        userName: user ? `${user.first_name} ${user.last_name}` : (language === 'hebrew' ? 'משתמש אנונימי' : 'Anonymous User'),
        wpm: 0,
        wordsTyped: 0,
        accuracy: 100,
        errors: 0,
        language: language,
        startTime: serverTimestamp(),
        isActive: true,
        isComplete: false
      };
      
      const docRef = await addDoc(collection(db, 'onlineBattles'), battleData);
      setBattleId(docRef.id);
      
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error starting battle:', error);
    }
  };

  // End battle
  const endBattle = async () => {
    setBattleStarted(false);
    setBattleComplete(true);
    const endTs = Date.now();
    setEndTime(endTs);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Update battle entry in Firestore
    if (battleId) {
      try {
        const finalWpm = calculateWPM();
        const finalAccuracy = calculateAccuracy();
        
        await updateDoc(doc(db, 'onlineBattles', battleId), {
          wpm: finalWpm,
          wordsTyped: userStats.wordsTyped,
          accuracy: finalAccuracy,
          errors: userStats.errors,
          endTime: serverTimestamp(),
          isActive: false,
          isComplete: true
        });

        // Add to leaderboard if it's a good score
        if (finalWpm > 0) {
          await addToLeaderboard({
            userId: user?.user_id || 'anonymous',
            firstName: user?.first_name || (language === 'hebrew' ? 'משתמש אנונימי' : 'Anonymous User'),
            lastName: user?.last_name || '',
            wpm: finalWpm,
            accuracy: finalAccuracy,
            wordsTyped: userStats.wordsTyped,
            errors: userStats.errors,
            language: language,
            battleId: battleId,
            timestamp: serverTimestamp()
          });
        }
      } catch (error) {
        console.error('Error ending battle:', error);
      }
    }
  };

  // Reset battle
  const resetBattle = async () => {
    setBattleStarted(false);
    setBattleComplete(false);
    setCurrentWordIndex(0);
    setInputValue('');
    setTimeRemaining(90);
    setUserStats({
      wpm: 0,
      wordsTyped: 0,
      errors: 0,
      accuracy: 100
    });
    setWords([]);
    setStartTime(null);
    setEndTime(null);
    setBattleId(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Timer effect
  useEffect(() => {
    if (battleStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endBattle();
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
  }, [battleStarted, timeRemaining]);

  // Real-time leaderboard listener
  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      where('language', '==', language),
      orderBy('wpm', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = [];
      snapshot.forEach((doc) => {
        leaderboardData.push({ id: doc.id, ...doc.data() });
      });
      setLeaderboard(leaderboardData);
    });

    return () => unsubscribe();
  }, [language]);

  // Update stats in real-time during battle
  useEffect(() => {
    if (battleStarted && battleId) {
      const updateInterval = setInterval(async () => {
        try {
          const currentWpm = calculateWPM();
          const currentAccuracy = calculateAccuracy();
          
          await updateDoc(doc(db, 'onlineBattles', battleId), {
            wpm: currentWpm,
            wordsTyped: userStats.wordsTyped,
            accuracy: currentAccuracy,
            errors: userStats.errors
          });
        } catch (error) {
          console.error('Error updating battle stats:', error);
        }
      }, 2000); // Update every 2 seconds

      return () => clearInterval(updateInterval);
    }
  }, [battleStarted, battleId, userStats]);

  // Handle input changes
  const handleInputChange = (e) => {
    if (!battleStarted) return;

    const value = e.target.value;
    const currentWord = words[currentWordIndex];
    
    if (!currentWord) return;

    setInputValue(value);

    if (value.trim() === currentWord) {
      // Correct word typed
      setUserStats(prev => ({
        ...prev,
        wordsTyped: prev.wordsTyped + 1
      }));

      setInputValue('');
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          endBattle();
          return prev;
        }
        return nextIndex;
      });
    } else if (value.length > 0) {
      // Check for errors
      if (!currentWord.startsWith(value)) {
        setUserStats(prev => ({
          ...prev,
          errors: prev.errors + 1
        }));
      }
    }
  };

  // Calculate WPM
  const calculateWPM = () => {
    if (!startTime) return 0;
    const endTimestamp = battleComplete && endTime ? endTime : Date.now();
    const elapsedMinutes = (endTimestamp - startTime) / 1000 / 60;
    return elapsedMinutes > 0 ? Math.round(userStats.wordsTyped / elapsedMinutes) : 0;
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    const total = userStats.wordsTyped + userStats.errors;
    return total > 0 ? Math.round((userStats.wordsTyped / total) * 100) : 100;
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current key for keyboard
  const getCurrentKey = () => {
    if (!battleStarted || currentWordIndex >= words.length) return null;
    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[inputValue.length];
    return currentChar || null;
  };

  // Get current keys for keyboard
  const getCurrentKeys = () => {
    if (!battleStarted || currentWordIndex >= words.length) return [];
    const currentWord = words[currentWordIndex];
    return currentWord.split('').filter((char, index) => index >= inputValue.length);
  };

  // Render battle complete screen
  if (battleComplete) {
    return (
      <div className="online-battle" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="battle-results card">
          <h2>{texts.onlineBattleComplete}</h2>
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
              <div className="stat-value">{userStats.wordsTyped}</div>
              <div>{texts.wordsTyped}</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{userStats.errors}</div>
              <div>{texts.errors}</div>
            </div>
          </div>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={resetBattle}>
              {texts.battleAgain}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              {texts.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main battle interface
  return (
    <div className="online-battle" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="battle-container">
        {/* Header */}
        <div className="battle-header">
          <h1>{texts.onlineBattle}</h1>
          <p>{texts.onlineBattleDescription}</p>
        </div>

        {/* Battle area and leaderboard */}
        <div className="battle-content">
          {/* Main battle area */}
          <div className="battle-main">
            {!battleStarted ? (
              <div className="battle-setup card">
                <h2>{texts.readyToBattle}</h2>
                <p>{texts.battleInstructions}</p>
                <div className="battle-info">
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span>{texts.battleDuration}: 1:30</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🎯</span>
                    <span>{texts.mixedDifficulty}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🏆</span>
                    <span>{texts.realTimeLeaderboard}</span>
                  </div>
                </div>
                <button className="btn btn-primary battle-start-btn" onClick={startBattle}>
                  {texts.startBattle}
                </button>
              </div>
            ) : (
              <div className="battle-active">
                {/* Battle stats */}
                <div className="battle-stats">
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
                    <div className="stat-value">{userStats.wordsTyped}</div>
                    <div>{texts.wordsTyped}</div>
                  </div>
                </div>

                {/* Words display */}
                <div className="words-display card">
                  {words.slice(currentWordIndex, currentWordIndex + 10).map((word, index) => (
                    <span
                      key={currentWordIndex + index}
                      className={`word ${index === 0 ? 'current' : ''}`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                
                {/* Input area */}
                <div className="input-area card">
                  <label>{texts.currentWord}: {words[currentWordIndex]}</label>
                  <div className="typing-input-container">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={texts.typeHere}
                      className={`typing-input ${
                        inputValue.length > 0 && words[currentWordIndex]?.startsWith(inputValue) ? 'success' : 
                        inputValue.length > 0 && !words[currentWordIndex]?.startsWith(inputValue) ? 'error' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Keyboard */}
                <Keyboard 
                  targetKeys={getCurrentKeys()}
                  currentKey={getCurrentKey()}
                />

                {/* Battle controls */}
                <div className="battle-controls">
                  <button className="btn btn-secondary" onClick={endBattle}>
                    {texts.endBattle}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>{texts.leaderboard}</h3>
            <div className="leaderboard-list">
              {leaderboard.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`leaderboard-item ${player.id === battleId ? 'current-user' : ''}`}
                >
                  <div className="player-rank">#{index + 1}</div>
                  <div className="player-info">
                    <div className="user-name">{player.userName}</div>
                    <div className="player-stats">
                      <span className="progress-percent">{player.wpm}</span>
                      <span className="stat-label">{texts.wpm}</span>
                    </div>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="no-players">
                  {texts.noActivePlayers}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineBattle;
