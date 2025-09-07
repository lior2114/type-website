import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Login.css';

const CreateFirstAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasAdmin, setHasAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  const { createFirstAdmin, error, clearError } = useAuth();
  const { texts, isRTL } = useLanguage();

  useEffect(() => {
    checkForExistingAdmin();
  }, []);

  const checkForExistingAdmin = async () => {
    try {
      const adminExists = await createFirstAdmin.hasAdmin?.();
      setHasAdmin(adminExists);
    } catch (error) {
      console.error('Error checking for admin:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = isRTL ? 'שם פרטי הוא שדה חובה' : 'First name is required';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(formData.firstName)) {
      errors.firstName = isRTL ? 'שם פרטי יכול להכיל רק אותיות' : 'First name can only contain letters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = isRTL ? 'שם משפחה הוא שדה חובה' : 'Last name is required';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(formData.lastName)) {
      errors.lastName = isRTL ? 'שם משפחה יכול להכיל רק אותיות' : 'Last name can only contain letters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = isRTL ? 'אימייל הוא שדה חובה' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = isRTL ? 'פורמט אימייל לא תקין' : 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      errors.password = isRTL ? 'סיסמה היא שדה חובה' : 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = isRTL ? 'סיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = isRTL ? 'אישור סיסמה הוא שדה חובה' : 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = isRTL ? 'הסיסמאות אינן תואמות' : 'Passwords do not match';
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
    clearError();

    try {
      await createFirstAdmin(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      
      // Success - redirect to login or dashboard
      window.location.href = '/login';
    } catch (error) {
      console.error('Admin creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{isRTL ? 'בודק אם קיים אדמין...' : 'Checking for existing admin...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isRTL ? 'אדמין כבר קיים' : 'Admin Already Exists'}</h2>
            <p>{isRTL ? 'כבר קיים משתמש אדמין במערכת' : 'An admin user already exists in the system'}</p>
          </div>
          <div className="auth-footer">
            <a href="/login" className="link-button">
              {isRTL ? 'התחבר כאן' : 'Login here'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isRTL ? 'יצירת אדמין ראשון' : 'Create First Admin'}</h2>
          <p>{isRTL ? 'צור את המשתמש האדמין הראשון במערכת' : 'Create the first admin user for the system'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder={isRTL ? 'הכנס שם פרטי' : 'Enter first name'}
                required
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
                placeholder={isRTL ? 'הכנס שם משפחה' : 'Enter last name'}
                required
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
              placeholder={isRTL ? 'הכנס את האימייל שלך' : 'Enter your email'}
              required
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {isRTL ? 'סיסמה' : 'Password'}
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isRTL ? 'הכנס סיסמה (לפחות 6 תווים)' : 'Enter password (min 6 characters)'}
                required
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              {isRTL ? 'אישור סיסמה' : 'Confirm Password'}
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={isRTL ? 'אישור סיסמה' : 'Confirm password'}
                required
                className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className="field-error">{validationErrors.confirmPassword}</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <div className="spinner"></div>
                {isRTL ? 'יוצר אדמין...' : 'Creating admin...'}
              </span>
            ) : (
              isRTL ? 'צור אדמין' : 'Create Admin'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRTL ? 'יש לך כבר חשבון?' : 'Already have an account?'}
            <a href="/login" className="link-button">
              {isRTL ? ' התחבר כאן' : ' Login here'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateFirstAdmin;
