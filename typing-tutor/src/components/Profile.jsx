import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { lessons } from '../data/lessons';
// import AuthApi from '../api/authApi';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [userProgress, setUserProgress] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  const { user, updateProfile, getUserProgress, error, clearError, setError } = useAuth();
  const location = useLocation();
  const { texts, isRTL, language } = useLanguage();

  // בדיקה אם אנחנו במצב מתורגם
  const isTranslated = (
    location.pathname.startsWith('/translated-english-') ||
    location.pathname.startsWith('/translated-hebrew-') ||
    location.pathname === '/translated-english-lessons' ||
    location.pathname === '/translated-hebrew-lessons'
  );

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.user_email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      loadUserProgress();
    }
  }, [user]);

  // רענון נתונים כשהשפה או המצב המתורגם משתנה
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [language, isTranslated]);

  // רענון נתונים כאשר המשתמש חוזר לטאב/דף הפרופיל (ללא ריענון אוטומטי כל 30 שניות)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const [progressError, setProgressError] = useState(null);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState(new Set());

  const toggleLessonExpanded = (idx) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // פונקציה לקבלת שם השיעור לפי ID ושפה
  const getLessonTitle = (lessonId, language) => {
    const lessonData = lessons[language]?.find(lesson => lesson.id === parseInt(lessonId));
    return lessonData?.title || `${isRTL ? 'שיעור' : 'Lesson'} ${lessonId}`;
  };

  const renderRecentLesson = (lesson, idx) => {
    const isOpen = expandedLessons.has(idx);
    const completedLocal = parseServerTimestampToLocal(lesson.completed_at);
    const dateOnly = completedLocal ? completedLocal.toLocaleDateString(isRTL ? 'he-IL' : 'en-US') : '';
    const timeOnly = completedLocal ? completedLocal.toLocaleTimeString(isRTL ? 'he-IL' : 'en-US') : '';
    const title = (() => {
      if (lesson.lesson_type === 'lesson') {
        // אם יש lesson_name, השתמש בו. אחרת, קבל את השם מהנתונים
        if (lesson.lesson_name) {
          return lesson.lesson_name;
        }
        return getLessonTitle(lesson.lesson_id, language);
      }
      if (lesson.lesson_type === 'practice') {
        return isRTL ? 'תרגול חופשי' : 'Free Practice';
      }
      if (lesson.lesson_type === 'test') {
        return isRTL ? 'מבחן מילים אקראיות' : 'Random Words Test';
      }
      return String(lesson.lesson_type || '');
    })();
    return (
      <div key={`${lesson.lesson_id}-${lesson.completed_at || idx}`} className={`recent-lesson-item ${isOpen ? 'open' : ''}`} style={{
        background: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)'
      }}>
        <button
          className="recent-lesson-toggle"
          onClick={() => toggleLessonExpanded(idx)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            color: 'inherit',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'start'
          }}
        >
          <span>{title}{dateOnly ? ` · ${dateOnly}` : ''}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="recent-lesson-details" style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
            <div className="detail-box" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ opacity: 0.8, color: 'var(--text-secondary)' }}>{isRTL ? 'שעה' : 'Time'}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{timeOnly || '-'}</div>
            </div>
            <div className="detail-box" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ opacity: 0.8, color: 'var(--text-secondary)' }}>{isRTL ? 'מילים לדקה' : 'WPM'}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(lesson.wpm || 0)}</div>
            </div>
            <div className="detail-box" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ opacity: 0.8, color: 'var(--text-secondary)' }}>{isRTL ? 'דיוק' : 'Accuracy'}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(lesson.accuracy || 0)}%</div>
            </div>
            <div className="detail-box" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ opacity: 0.8, color: 'var(--text-secondary)' }}>{isRTL ? 'שגיאות' : 'Errors'}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lesson.errors || 0}</div>
            </div>
            <div className="detail-box" style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ opacity: 0.8, color: 'var(--text-secondary)' }}>{isRTL ? 'זמן' : 'Time'}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatTime(lesson.time_spent || 0)}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const loadUserProgress = async () => {
    try {
      setIsLoadingProgress(true);
      setProgressError(null);
      const progress = await getUserProgress(language, isTranslated);

      setUserProgress(progress);
      setLastRefresh(new Date());
      setIsFirstLoad(false);
    } catch (error) {
      setUserProgress(null);
      setProgressError(error.message);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  // האזן לאירועים גלובליים שמודיעים שהתבצע עדכון התקדמות, ורענן מיד
  useEffect(() => {
    const onProgressUpdated = () => {
      if (user) {
        loadUserProgress();
      }
    };
    
    const onLessonCompleted = () => {
      if (user) {
        loadUserProgress();
      }
    };
    
    window.addEventListener('user-progress-updated', onProgressUpdated);
    window.addEventListener('lesson-completed', onLessonCompleted);
    
    return () => {
      window.removeEventListener('user-progress-updated', onProgressUpdated);
      window.removeEventListener('lesson-completed', onLessonCompleted);
    };
  }, [user]);

  // רענון נתונים
  const refreshData = async () => {
    try {
      setRefreshSuccess(false);
      setProgressError(null);
      await loadUserProgress();
      setRefreshSuccess(true);
      // הודעה קצרה על הצלחה
      setTimeout(() => {
        setRefreshSuccess(false);
      }, 3000);
    } catch (error) {
      setProgressError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // ניקוי שגיאה רק כאשר המשתמש מתחיל להקליד בשדה הסיסמה הנוכחית
    if (error && name === 'currentPassword') {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = isRTL ? 'שם פרטי הוא שדה חובה' : 'First name is required';
    } else if (!/^[א-תa-zA-Z]+$/.test(formData.firstName)) {
      errors.firstName = isRTL ? 'שם פרטי יכול להכיל רק אותיות (ללא רווחים)' : 'First name can only contain letters (no spaces)';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = isRTL ? 'שם משפחה הוא שדה חובה' : 'Last name is required';
    } else if (!/^[א-תa-zA-Z]+$/.test(formData.lastName)) {
      errors.lastName = isRTL ? 'שם משפחה יכול להכיל רק אותיות (ללא רווחים)' : 'Last name can only contain letters (no spaces)';
    }

    if (!formData.email.trim()) {
      errors.email = isRTL ? 'אימייל הוא שדה חובה' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = isRTL ? 'פורמט אימייל לא תקין' : 'Invalid email format';
    }

    if (!formData.currentPassword) {
      errors.currentPassword = isRTL ? 'סיסמה נוכחית היא שדה חובה' : 'Current password is required';
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 4) {
        errors.newPassword = isRTL ? 'סיסמה חייבת להכיל לפחות 4 תווים' : 'Password must be at least 4 characters';
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        errors.confirmNewPassword = isRTL ? 'הסיסמאות אינן תואמות' : 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // לא מנקים שגיאה כאן כדי שהשגיאה תישאר אם יש בעיה עם הסיסמה

    try {
      // אימות מחדש מתבצע בתוך updateProfile (Firebase reauthenticate)

      const updateData = {
        current_password: formData.currentPassword
      };

      // בדיקה אם השדות השתנו
      if (formData.firstName !== user.first_name) {
        updateData.first_name = formData.firstName;
      }
      
      if (formData.lastName !== user.last_name) {
        updateData.last_name = formData.lastName;
      }
      
      if (formData.email !== user.user_email) {
        updateData.user_email = formData.email;
      }

      if (formData.newPassword) {
        updateData.new_password = formData.newPassword;
      }

      // בדיקה שיש לפחות שדה אחד לעדכון (חוץ מסיסמה נוכחית)
      const fieldsToUpdate = Object.keys(updateData).filter(key => key !== 'current_password');
      if (fieldsToUpdate.length === 0) {
        setError(isRTL ? 'לא בוצעו שינויים' : 'No changes made');
        setIsLoading(false);
        return;
      }

      const result = await updateProfile(updateData);
      
      // בדיקה אם העדכון הצליח
      if (result) {
        // אם הגענו לכאן, העדכון הצליח
        clearError();
        setIsEditing(false);
        
        // ניקוי שדות סיסמה
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
        
        // הצגת הודעת הצלחה
        alert(isRTL ? 'הפרופיל עודכן בהצלחה!' : 'Profile updated successfully!');
      } else {
        // אם result הוא null, מציגים שגיאה מתחת לשדה הסיסמה הנוכחית
        if (error) {
          const isWrongPassword = (
            error.includes('הסיסמה הנוכחית שגויה') ||
            error.includes('Current password is incorrect') ||
            error.toLowerCase().includes('password')
          );
          if (isWrongPassword) {
            setValidationErrors(prev => ({
              ...prev,
              currentPassword: error
            }));
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.user_email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setValidationErrors({});
    clearError(); // מנקים שגיאות בביטול
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTwoDecimals = (value) => {
    const num = Number(value) || 0;
    return num.toFixed(2);
  };

  // Convert server timestamps (e.g., "YYYY-MM-DD HH:MM:SS" in UTC) to local Date
  const parseServerTimestampToLocal = (timestamp) => {
    if (!timestamp) return null;
    try {
      // Handle Firebase Timestamp objects
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
      }
      
      // Handle regular timestamps
      const s = String(timestamp).trim();
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
        const isoUtc = s.replace(' ', 'T') + 'Z';
        const d = new Date(isoUtc);
        return isNaN(d.getTime()) ? null : d;
      }
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>{isRTL ? 'פרופיל משתמש' : 'User Profile'}</h1>
        </div>

        <div className="profile-sections">
          {/* מידע אישי */}
          <div className="profile-section">
            <div className="section-header">
              <h2>{isRTL ? 'מידע אישי' : 'Personal Information'}</h2>
              {!isEditing && (
                <button
                  className="edit-button"
                  onClick={() => {
                    setIsEditing(true);
                    clearError(); // מנקים שגיאות כשמתחילים לערוך
                  }}
                >
                  {isRTL ? 'ערוך' : 'Edit'}
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      {isRTL ? 'שם פרטי' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
                    />
                    {validationErrors.firstName && (
                      <span className="field-error">{validationErrors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      {isRTL ? 'שם משפחה' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
                    />
                    {validationErrors.lastName && (
                      <span className="field-error">{validationErrors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    {isRTL ? 'אימייל' : 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  />
                  {validationErrors.email && (
                    <span className="field-error">{validationErrors.email}</span>
                  )}
                </div>

                                 <div className="form-group">
                   <label htmlFor="currentPassword">
                     {isRTL ? 'סיסמה נוכחית *' : 'Current Password *'}
                   </label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder={isRTL ? 'הכנס סיסמה נוכחית' : 'Enter current password'}
                      className={`form-input ${validationErrors.currentPassword ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                                                                          {validationErrors.currentPassword && (
                     <span className="field-error">{validationErrors.currentPassword}</span>
                   )}
                   
                   {/* הצגת שגיאה מהשרת מתחת לשדה הסיסמה הנוכחית */}
                   {error && (error.includes('סיסמה') || error.includes('password') || error.includes('Current password') || error.includes('הסיסמה הנוכחית שגויה') || error.includes('Current password is incorrect') || error.includes('חובה להזין את הסיסמה הנוכחית') || error === 'הסיסמה הנוכחית שגויה') && (
                     <span className="field-error">
                       {error}
                     </span>
                   )}
   
                   <small className="field-hint">
                     {isRTL ? 'נדרשת לכל עדכון בפרופיל' : 'Required for any profile update'}
                   </small>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    {isRTL ? 'סיסמה חדשה (אופציונלי)' : 'New Password (Optional)'}
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder={isRTL ? 'הכנס סיסמה חדשה' : 'Enter new password'}
                      className={`form-input ${validationErrors.newPassword ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <span className="field-error">{validationErrors.newPassword}</span>
                  )}
                </div>

                {formData.newPassword && (
                  <div className="form-group">
                    <label htmlFor="confirmNewPassword">
                      {isRTL ? 'אישור סיסמה חדשה' : 'Confirm New Password'}
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder={isRTL ? 'אישור סיסמה חדשה' : 'Confirm new password'}
                        className={`form-input ${validationErrors.confirmNewPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {validationErrors.confirmNewPassword && (
                      <span className="field-error">{validationErrors.confirmNewPassword}</span>
                    )}
                  </div>
                )}

                {/* הצגת שגיאות כלליות בסוף הטופס (לא סיסמה) */}
                {error && !error.includes('סיסמה') && !error.includes('password') && !error.includes('Current password') && !error.includes('הסיסמה הנוכחית שגויה') && !error.includes('Current password is incorrect') && !error.includes('חובה להזין את הסיסמה הנוכחית') && error !== 'הסיסמה הנוכחית שגויה' && (
                  <div className="error-message" style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <strong>{isRTL ? 'שגיאה:' : 'Error:'}</strong> {error}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading-spinner">
                        <div className="spinner"></div>
                        {isRTL ? 'שומר...' : 'Saving...'}
                      </span>
                    ) : (
                      isRTL ? 'שמור' : 'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    {isRTL ? 'ביטול' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <>
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">{isRTL ? 'שם פרטי:' : 'First Name:'}</span>
                  <span className="info-value">{user?.first_name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? 'שם משפחה:' : 'Last Name:'}</span>
                  <span className="info-value">{user?.last_name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? 'אימייל:' : 'Email:'}</span>
                  <span className="info-value">{user?.user_email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? 'תפקיד:' : 'Role:'}</span>
                  <span className="info-value">
                    {user?.role_name === 'admin' ? (isRTL ? 'מנהל' : 'Admin') :
                     user?.role_name === 'moderator' ? (isRTL ? 'מנחה' : 'Moderator') :
                     isRTL ? 'משתמש' : 'User'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? 'תאריך הצטרפות:' : 'Join Date:'}</span>
                  <span className="info-value">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString(isRTL ? 'he-IL' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </span>
                </div>
              </div>

              {/* Recent lessons expandable list */}
              {Array.isArray(userProgress?.recent_lessons) && (userProgress?.recent_lessons?.length || 0) > 0 && (
                <div className="recent-lessons-section" style={{ marginTop: '24px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{isRTL ? 'שיעורים אחרונים' : 'Recent Lessons'}</h3>
                  <div className="recent-lessons-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(userProgress?.recent_lessons || []).map((lesson, idx) => renderRecentLesson(lesson, idx))}
                  </div>
                </div>
              )}
              </>
            )}
          </div>

          {/* התקדמות */}
          <div className="profile-section">
            <div className="section-header">
              <div className="section-title">
                <h2>{isRTL ? 'התקדמות' : 'Progress'}</h2>
                {lastRefresh && (
                  <small className="last-refresh">
                    {isRTL ? 'עודכן לאחרונה:' : 'Last updated:'} {lastRefresh.toLocaleTimeString(isRTL ? 'he-IL' : 'en-US')}
                  </small>
                )}
              </div>
              <button
                className={`refresh-button ${isLoadingProgress ? 'spinning' : ''}`}
                onClick={refreshData}
                disabled={isLoadingProgress}
                title={isRTL ? 'רענן נתונים' : 'Refresh data'}
              >
                🔄
              </button>
            </div>

            {isLoadingProgress && isFirstLoad ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>{isRTL ? 'טוען נתוני התקדמות...' : 'Loading progress data...'}</p>
              </div>
            ) : isLoadingProgress && !isFirstLoad ? (
              <div className="refreshing-container">
                <div className="spinner"></div>
                <p>{isRTL ? 'מרענן נתונים...' : 'Refreshing data...'}</p>
              </div>
            ) : userProgress ? (
              <>
                {refreshSuccess && (
                  <div className="success-message">
                    <span>✅ {isRTL ? 'הנתונים עודכנו בהצלחה!' : 'Data updated successfully!'}</span>
                  </div>
                )}
                <div className="progress-grid">
                <div className="progress-card">
                  <div className="progress-icon">📚</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'שיעורים שהושלמו' : 'Completed Lessons'}</h3>
                    <p className="progress-value">{userProgress.completed_lessons || 0}</p>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-icon">⚡</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'מילים לדקה ממוצע' : 'Average WPM'}</h3>
                    <p className="progress-value">{Math.round(userProgress.average_wpm || 0)}</p>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-icon">🎯</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'דיוק ממוצע' : 'Average Accuracy'}</h3>
                    <p className="progress-value">{Math.round(userProgress.average_accuracy || 0)}%</p>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-icon">⏱️</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'זמן תרגול כולל' : 'Total Practice Time'}</h3>
                    <p className="progress-value">{formatTime(userProgress.total_time_spent || 0)}</p>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-icon">📝</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'מילים שהוקלדו' : 'Words Typed'}</h3>
                    <p className="progress-value">{formatTwoDecimals(userProgress.total_words_typed || 0)}</p>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-icon">📊</div>
                  <div className="progress-info">
                    <h3>{isRTL ? 'שיעורים אחרונים' : 'Recent Lessons'}</h3>
                    <p className="progress-value">{userProgress.recent_lessons?.length || 0}</p>
                  </div>
                </div>
              </div>
              </>
            ) : progressError ? (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>{isRTL ? 'שגיאה בטעינת נתונים' : 'Error Loading Data'}</h3>
                <p>{progressError}</p>
                {!isFirstLoad && null}
                <button 
                  className="refresh-button"
                  onClick={refreshData}
                  disabled={isLoadingProgress}
                >
                  🔄 {isRTL ? 'נסה שוב' : 'Try Again'}
                </button>
              </div>
            ) : (
              <div className="no-progress">
                <div className="no-progress-icon">📊</div>
                <h3>{isRTL ? 'אין נתוני התקדמות זמינים' : 'No Progress Data Available'}</h3>
                <p>{isRTL ? 'התחל ללמוד כדי לראות את ההתקדמות שלך' : 'Start learning to see your progress'}</p>
                {!isFirstLoad && null}
                <button 
                  className="refresh-button"
                  onClick={refreshData}
                  disabled={isLoadingProgress}
                >
                  🔄 {isRTL ? 'נסה שוב' : 'Try Again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
