import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Login.css';

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const { texts, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      // ניווט לפרופיל אחרי התחברות מוצלחת
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) clearError();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isRTL ? 'התחברות' : 'Login'}</h2>
          <p>{isRTL ? 'ברוכים הבאים חזרה!' : 'Welcome back!'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              {isRTL ? 'אימייל' : 'Email'}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={isRTL ? 'הכנס את האימייל שלך' : 'Enter your email'}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {isRTL ? 'סיסמה' : 'Password'}
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder={isRTL ? 'הכנס את הסיסמה שלך' : 'Enter your password'}
                required
                className="form-input"
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
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <div className="spinner"></div>
                {isRTL ? 'מתחבר...' : 'Logging in...'}
              </span>
            ) : (
              isRTL ? 'התחבר' : 'Login'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRTL ? 'אין לך חשבון?' : "Don't have an account?"}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
            >
              {isRTL ? ' הירשם כאן' : ' Sign up here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
