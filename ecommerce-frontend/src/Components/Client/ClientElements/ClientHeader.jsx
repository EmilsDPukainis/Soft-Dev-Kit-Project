import React, { useState } from 'react';
import styles from './ClientInterface.module.css';
import ClientLoginPopup from './ClientLoginPopup';
import ClientRegisterPopup from './ClientRegisterPopup';
import ClientCartPopup from './ClientCartPopup'; // Import the cart popup component

const ClientHeader = ({ cartCount, onLoginClick, onRegisterClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);
  const [registerPopupVisible, setRegisterPopupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartPopupVisible, setCartPopupVisible] = useState(false); // State for cart popup


  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openLoginPopup = () => {
    setLoginPopupVisible(true);
  };

  const closeLoginPopup = () => {
    setLoginPopupVisible(false);
  };

  const openRegisterPopup = () => {
    setRegisterPopupVisible(true);
  };

  const closeRegisterPopup = () => {
    setRegisterPopupVisible(false);
  };



  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const openCartPopup = () => {
    setCartPopupVisible(true);
  };

  const closeCartPopup = () => {
    setCartPopupVisible(false);
  };


  return (
    <div className={styles.header}>
      <div className={styles.logo}>Welcome</div>
      <div className={styles.actions}>
      <div className={styles.cart} onClick={openCartPopup}>
          Cart ({cartCount})
        </div>
        {cartPopupVisible && (
          <ClientCartPopup onClose={closeCartPopup} />
        )}
        {isLoggedIn ? (
          // If logged in, show "Log Out" button
          <div className={styles.logout} onClick={handleLogout}>
            Log Out
          </div>
        ) : (
          // If not logged in, show "Log In" button
          <div className={styles.login} onClick={openLoginPopup}>
            Log In
          </div>
        )}
        <div className={styles.register} onClick={openRegisterPopup}>
          Register
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.searchbutton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {loginPopupVisible && (
        <ClientLoginPopup
        onClose={closeLoginPopup}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      )}

      {registerPopupVisible && <ClientRegisterPopup onClose={closeRegisterPopup} />}
    </div>
  );
};


export default ClientHeader;
