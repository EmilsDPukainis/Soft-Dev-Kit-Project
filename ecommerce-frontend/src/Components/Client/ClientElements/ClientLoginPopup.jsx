import React, { useState } from 'react';
import styles from './ClientInterface.module.css';

const ClientLoginPopup = ({ onClose, onLogin, onLogout, isLoggedIn, setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthentication = async () => {
    try {
      const endpoint = isLoggedIn ? '/api/logout' : '/api/login';
      const method = 'POST'; // Always use POST for authentication
      const body = isLoggedIn ? null : JSON.stringify({ username, password });
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'GET' ? null : body,
      });
  
      if (response.ok) {
        if (isLoggedIn) {
          // Logout successful
          onLogout();
        } else {
          // Login successful
          const result = await response.json();
          setIsLoggedIn(true);
          onLogin(result.user);
          onClose();
        }
      } else {
        // Handle authentication failure, show error message, etc.
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>{isLoggedIn ? 'Logout' : 'Login'}</h2>
        {!isLoggedIn && (
          <>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </>
        )}
        <button className={styles.registerbutton} onClick={handleAuthentication}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        <button className={styles.registerbutton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ClientLoginPopup;
