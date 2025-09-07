import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { lessons } from '../data/lessons';
import './ResultsScreen.css';

const ResultsScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { texts, language, isRTL } = useLanguage();
  const { state } = location;

  if (!state) {
    navigate('/');
    return null;
  }

  const { 
    lessonId, 
    practiceType, 
    difficulty, 
    typingData, 
    timeElapsed, 
    wordsCompleted,
    wpm,
    accuracy
  } = state;

  // Use provided values or calculate them
  const finalWpm = wpm || Math.round((typingData.characters / 5) / (timeElapsed / 60));
  const finalAccuracy = accuracy || Math.round((typingData.characters / (typingData.characters + typingData.errors)) * 100);
  const passed = practiceType === 'free' ? finalAccuracy >= 80 : typingData.errors <= 6;

  const getMostCommonErrors = () => {
    if (!typingData.errorsByChar) return [];
    const errors = Array.from(typingData.errorsByChar.entries());
    return errors
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (finalAccuracy < 90) {
      recommendations.push(texts.focusAccuracy);
    }
    if (finalWpm < 30) {
      recommendations.push(texts.increaseSpeed);
    }
    if (typingData.errors > 10) {
      recommendations.push(texts.practiceMore);
    }
    
    return recommendations.length > 0 ? recommendations : [texts.greatJob];
  };

  const getLessonTitle = () => {
    if (practiceType === 'free') {
      // Don't show difficulty for custom words
      const isCustomWords = state.customWords;
      if (isCustomWords) {
        return texts.freePractice;
      }
      return `${texts.freePractice} - ${texts[difficulty] || difficulty}`;
    }
    const lesson = lessons[language]?.find(l => l.id === parseInt(lessonId));
    return lesson ? lesson.title : '';
  };

  return (
    <div className="results-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2>{texts.resultsTitle}</h2>
      <h3>{getLessonTitle()}</h3>

      <div className={`result-status ${passed ? 'passed' : 'failed'}`}>
        <h1>{passed ? texts.passed : texts.failed}</h1>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <div className="result-value">{finalWpm}</div>
          <div className="result-label">{texts.wpm}</div>
        </div>
        <div className="result-card">
          <div className="result-value">{finalAccuracy}%</div>
          <div className="result-label">{texts.accuracy}</div>
        </div>
        <div className="result-card">
          <div className="result-value">{typingData.errors}</div>
          <div className="result-label">{texts.errors}</div>
        </div>
        <div className="result-card">
          <div className="result-value">{wordsCompleted}</div>
          <div className="result-label">{texts.wordsTyped}</div>
        </div>
        <div className="result-card">
          <div className="result-value">{Math.round(timeElapsed)}s</div>
          <div className="result-label">{texts.practiceTime}</div>
        </div>
        <div className="result-card">
          <div className="result-value">{typingData.characters}</div>
          <div className="result-label">{texts.characters}</div>
        </div>
      </div>

      {typingData.errors > 0 && (
        <div className="error-analysis">
          <h3>{texts.errorAnalysis}</h3>
          <div className="error-list">
            {getMostCommonErrors().map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-text">{error.error}</span>
                <span className="error-count">{error.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recommendations">
        <h3>{texts.recommendations}</h3>
        <ul>
          {getRecommendations().map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="results-actions">
        {practiceType === 'free' ? (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/free-practice')}
          >
            🔄 {texts.tryAgain}
          </button>
        ) : (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/lesson/${lessonId}`)}
            >
              🔄 {texts.tryAgain}
            </button>
            {passed && (
              <button 
                className={`btn btn-secondary ${(() => {
                  const nextLessonId = parseInt(lessonId) + 1;
                  const currentLessons = lessons[language];
                  const nextLesson = currentLessons.find(l => l.id === nextLessonId);
                  return !nextLesson ? 'completed-all' : '';
                })()}`}
                onClick={() => {
                  const nextLessonId = parseInt(lessonId) + 1;
                  const currentLessons = lessons[language];
                  const nextLesson = currentLessons.find(l => l.id === nextLessonId);
                  
                  if (nextLesson) {
                    navigate(`/lesson/${nextLessonId}`);
                  } else {
                    // אם זה השיעור האחרון, נווט לתפריט השיעורים עם הודעה
                    navigate('/lessons', { 
                      state: { 
                        message: language === 'hebrew' ? 'כל הכבוד! סיימת את כל השיעורים!' : 'Congratulations! You completed all lessons!' 
                      } 
                    });
                  }
                }}
              >
                {(() => {
                  const nextLessonId = parseInt(lessonId) + 1;
                  const currentLessons = lessons[language];
                  const nextLesson = currentLessons.find(l => l.id === nextLessonId);
                  
                  if (nextLesson) {
                    return '➡️ ' + texts.nextLesson;
                  } else {
                    return '🎉 ' + (language === 'hebrew' ? 'סיים את כל השיעורים' : 'Complete All Lessons');
                  }
                })()}
              </button>
            )}
          </>
        )}
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          🏠 {texts.backToMenu}
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen; 