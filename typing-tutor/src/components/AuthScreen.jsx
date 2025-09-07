import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthScreen.css';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-screen">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-wrapper">
        {isLogin ? (
          <Login onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
