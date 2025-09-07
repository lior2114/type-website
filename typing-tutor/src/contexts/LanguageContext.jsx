import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      return saved === 'english' || saved === 'hebrew' ? saved : 'hebrew';
    } catch {
      return 'hebrew';
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    } catch {}
    return false;
  });

  const isRTL = language === 'hebrew';

  const texts = {
    hebrew: {
      // Header
      title: 'מורה להקלדה עיוורת',
      language: 'שפה',
      darkMode: 'מוד לילה',
      
      // Welcome Screen
      welcomeTitle: 'ברוכים הבאים למורה להקלדה עיוורת',
      welcomeDescription: 'למד להקליד מהר ובדיוק עם השיעורים שלנו',
      startLearning: 'התחל ללמוד',
      startTraining: 'התחל אימון',
      
      // Features
      structuredLessons: 'שלבים מובנים',
      structuredLessonsDesc: 'לימוד הדרגתי עם שלבים מתקדמים',
      virtualKeyboard: 'מקלדת וירטואלית',
      virtualKeyboardDesc: 'תמונות מדריכות למיקום נכון של האצבעות',
      progressTracking: 'מעקב התקדמות',
      progressTrackingDesc: 'ניתוח מפורט של מהירות, דיוק ושגיאות',
      freePractice: 'תרגול חופשי',
      freePracticeDesc: 'תרגולים אינטראקטיביים עם משוב מיידי',
      randomWordsTest: 'מבחן מילים רנדומליות',
      randomWordsTestDesc: 'תרגול עם מילים אקראיות ברמות קושי שונות',
      translatedEnglishLessons: 'אנגלית מתורגמת',
      translatedHebrewLessons: 'עברית מתורגמת',
      translatedToggle: 'החלף מצב מתורגם',
      darkModeDesc: 'ממשק נוח לעיניים גם בחושך',
      
      // Stats
      statsLessons: 'שיעורים',
      statsWords: 'מילים',
      availability: 'זמינות',
      statsFree: 'חינמי',
      
      // Navigation
      home: 'בית',
      lessons: 'שיעורים',
      navFreePractice: 'תרגול חופשי',
      navRandomWordsTest: 'מבחן מילים רנדומליות',
      backToHome: 'חזרה לבית',
      backToLessons: 'חזרה לשיעורים',
      backToMenu: 'חזרה לתפריט',
      
      // Lesson related
      startPractice: 'התחל אימון',
      pause: 'השהה',
      restart: 'התחל מחדש',
      completed: 'הושלם',
      wpm: 'מילים לדקה',
      cpm: 'אותיות לדקה',
      accuracy: 'דיוק',
      errors: 'שגיאות',
      currentWord: 'מילה נוכחית',
      typeHere: 'הקלד כאן...',
      fingerPosition: 'מיקום אצבעות',
      
      // Test settings
      selectDifficulty: 'בחר רמת קושי',
      selectTime: 'בחר זמן',
      easy: 'קל',
      medium: 'בינוני',
      hard: 'קשה',
      secondsLeft: 'שניות נותרו',
      wordsTyped: 'מילים שהוקלדו',
      testComplete: 'המבחן הושלם',
      tryAgain: 'נסה שוב',
      
      // Results
      testResults: 'תוצאות המבחן',
      timeElapsed: 'זמן שחלף',
      totalWords: 'סה"כ מילים',
      averageWPM: 'ממוצע מילים לדקה',
      averageAccuracy: 'ממוצע דיוק',
      practiceTime: 'זמן התרגול',
      characters: 'תווים שהוקלדו',
      resultsTitle: 'תוצאות',
      passed: 'עברת!',
      failed: 'נכשלת',
      focusAccuracy: 'התמקד בשיפור הדיוק',
      increaseSpeed: 'נסה להגדיל את המהירות',
      practiceMore: 'תרגל יותר כדי לשפר את הביצועים',
      greatJob: 'עבודה מצוינת! המשך כך!',
      
      // Practice types
      lesson: 'שיעור',
      free: 'תרגול חופשי',
      random: 'מילים רנדומליות',
      
      // Additional texts
      additionalLessons: 'שיעורים',
      additionalFree: 'חינמי',
      additionalWordsTyped: 'מילים שהוקלדו',
      testSettings: 'הגדרות מבחן',
      errorAnalysis: 'ניתוח שגיאות',
      recommendations: 'המלצות',
      startTest: 'התחל מבחן',
      
      // Lessons Screen
      chooseLesson: 'בחר שיעור',
      overallProgress: 'התקדמות כללית',
      locked: 'נעול',
      // New texts for lesson results
      lessonPassed: '🎉 מעולה! עברת את השיעור!',
      lessonFailed: '😔 נכשלת בשיעור',
      time: 'זמן',
      passCriteria: 'קריטריונים שצריך כדי לעבור:',
      accuracyRequired: 'דיוק: {accuracy}% {status} (נדרש: 80%)',
      nextLesson: 'השיעור הבא',
      backToLessonsResult: 'חזור לשיעורים',
      tryAgainResult: 'נסה שוב',
      // New texts for custom words
      choosePracticeType: 'בחר סוג תרגול:',
      preMadeWords: 'מילים מוכנות',
      customWords: 'מילים מותאמות אישית',
      enterCustomWords: 'הכנס מילים משלך (עד 500 מילים):',
      customWordsPlaceholder: 'הקלד מילים כאן, מופרדות ברווחים...',
      wordCount: 'מספר מילים:',
      timeLeft: 'זמן נותר',
      finish: 'סיים',
      
      // Online Battle texts
      onlineBattle: 'קרב באונליין',
      onlineBattleDescription: 'התחרה עם משתמשים אחרים במבחן הקלדה של דקה וחצי',
      readyToBattle: 'מוכן לקרב?',
      battleInstructions: 'הקלד מילים רנדומליות במשך דקה וחצי והתחרה במשתמשים אחרים בזמן אמת!',
      battleDuration: 'משך הקרב',
      mixedDifficulty: 'רמות קושי מעורבות',
      realTimeLeaderboard: 'לוח מובילים בזמן אמת',
      startBattle: 'התחל קרב!',
      leaderboard: 'לוח המובילים',
      noActivePlayers: 'אין שחקנים פעילים כרגע',
      onlineBattleComplete: 'הקרב הסתיים!',
      battleAgain: 'קרב נוסף',
      endBattle: 'סיים קרב',
      battleWordsTyped: 'מילים שהוקלדו'
    },
    english: {
      // Header
      title: 'Touch Typing Tutor',
      language: 'Language',
      darkMode: 'Dark Mode',
      
      // Welcome Screen
      welcomeTitle: 'Welcome to Touch Typing Tutor',
      welcomeDescription: 'Learn to type fast and accurately with our lessons',
      startLearning: 'Start Learning',
      startTraining: 'Start Training',
      
      // Features
      structuredLessons: 'Structured Lessons',
      structuredLessonsDesc: 'Progressive learning with advanced stages',
      virtualKeyboard: 'Virtual Keyboard',
      virtualKeyboardDesc: 'Guiding images for correct finger placement',
      progressTracking: 'Progress Tracking',
      progressTrackingDesc: 'Detailed analysis of speed, accuracy and errors',
      freePractice: 'Free Practice',
      freePracticeDesc: 'Interactive practice with immediate feedback',
      randomWordsTest: 'Random Words Test',
      translatedEnglishLessons: 'Translated English Lessons',
      translatedHebrewLessons: 'Translated Hebrew Lessons',
      translatedToggle: 'Toggle Translated Mode',
      randomWordsTestDesc: 'Practice with random words at different difficulty levels',
      darkModeDesc: 'Eye-friendly interface even in the dark',
      
      // Stats
      statsLessons: 'Lessons',
      statsWords: 'Words',
      availability: 'Availability',
      statsFree: 'Free',
      
      // Navigation
      home: 'Home',
      lessons: 'Lessons',
      navFreePractice: 'Free Practice',
      navRandomWordsTest: 'Random Words Test',
      backToHome: 'Back to Home',
      navBackToLessons: 'Back to Lessons',
      backToMenu: 'Back to Menu',
      
      // Lesson related
      startPractice: 'Start Practice',
      pause: 'Pause',
      restart: 'Restart',
      completed: 'Completed',
      wpm: 'WPM',
      cpm: 'CPM',
      accuracy: 'Accuracy',
      errors: 'Errors',
      currentWord: 'Current Word',
      typeHere: 'Type here...',
      fingerPosition: 'Finger Position',
      
      // Test settings
      selectDifficulty: 'Select Difficulty',
      selectTime: 'Select Time',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      secondsLeft: 'Seconds Left',
      testWordsTyped: 'Words Typed',
      testComplete: 'Test Complete',
      testTryAgain: 'Try Again',
      
      // Results
      testResults: 'Test Results',
      timeElapsed: 'Time Elapsed',
      totalWords: 'Total Words',
      averageWPM: 'Average WPM',
      averageAccuracy: 'Average Accuracy',
      practiceTime: 'Practice Time',
      characters: 'Characters Typed',
      resultsTitle: 'Results',
      passed: 'Passed!',
      failed: 'Failed',
      focusAccuracy: 'Focus on improving accuracy',
      increaseSpeed: 'Try to increase your speed',
      practiceMore: 'Practice more to improve your performance',
      greatJob: 'Great job! Keep it up!',
      
      // Practice types
      lesson: 'Lesson',
      free: 'Free Practice',
      random: 'Random Words',
      
      // Additional texts
      additionalLessons: 'Lessons',
      additionalFree: 'Free',
      additionalWordsTyped: 'Words Typed',
      testSettings: 'Test Settings',
      errorAnalysis: 'Error Analysis',
      recommendations: 'Recommendations',
      startTest: 'Start Test',
      
      // Lessons Screen
      chooseLesson: 'Choose Lesson',
      overallProgress: 'Overall Progress',
      locked: 'Locked',
      // New texts for lesson results
      lessonPassed: '🎉 Great! You passed the lesson!',
      lessonFailed: '😔 You failed the lesson',
      time: 'Time',
      passCriteria: 'Criteria needed to pass:',
      accuracyRequired: 'Accuracy: {accuracy}% {status} (Required: 80%)',
      nextLesson: 'Next Lesson',
      backToLessonsResult: 'Back to Lessons',
      tryAgainResult: 'Try Again',
      // New texts for custom words
      choosePracticeType: 'Choose practice type:',
      preMadeWords: 'Pre-made words',
      customWords: 'Custom words',
      enterCustomWords: 'Enter your own words (up to 500 words):',
      customWordsPlaceholder: 'Type words here, separated by spaces...',
      wordCount: 'Word count:',
      timeLeft: 'Time Left',
      finish: 'Finish',
      
      // Online Battle texts
      onlineBattle: 'Online Battle',
      onlineBattleDescription: 'Compete with other users in a 1.5-minute typing test',
      readyToBattle: 'Ready to Battle?',
      battleInstructions: 'Type random words for 1.5 minutes and compete with other users in real-time!',
      battleDuration: 'Battle Duration',
      mixedDifficulty: 'Mixed Difficulty Levels',
      realTimeLeaderboard: 'Real-time Leaderboard',
      startBattle: 'Start Battle!',
      leaderboard: 'Leaderboard',
      noActivePlayers: 'No active players right now',
      onlineBattleComplete: 'Battle Complete!',
      battleAgain: 'Battle Again',
      endBattle: 'End Battle',
      wordsTyped: 'Words Typed'
    }
  };

  const currentTexts = texts[language];

  const toggleLanguage = () => {
    const newLanguage = language === 'hebrew' ? 'english' : 'hebrew';
    setLanguage(newLanguage);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Set initial theme and handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Persist dark mode preference
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    } catch {}
  }, [darkMode]);

  // Persist language and update document direction
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch {}
    document.documentElement.setAttribute('dir', language === 'hebrew' ? 'rtl' : 'ltr');
  }, [language]);

  const value = {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    isRTL,
    texts: currentTexts,
    toggleLanguage,
    toggleDarkMode
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 