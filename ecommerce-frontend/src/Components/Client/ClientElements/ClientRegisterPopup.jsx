import React, { useState } from 'react';
import styles from './ClientInterface.module.css'; // Import your CSS module
import RegistrationSuccess from '../../RegistrationSuccess';
const ClientRegisterPopup = ({ onClose, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      // Check if the username and password already exist
      const credentialsResponse = await fetch(`/api/checkCredentials?username=${username}&password=${password}`);
  
      if (credentialsResponse.ok) {
        const { usernameExists, passwordExists } = await credentialsResponse.json();
  
        if (usernameExists) {
          console.error('Username already exists');
          alert('Username already exists');
          return;
        }
  
        if (passwordExists) {
          console.error('Password already exists');
          alert('Password already exists');
          return;
        }
  
        // Proceed with registration since username and password do not exist
        const registerResponse = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email, name, surname }),
        });
  
        if (registerResponse.ok) {
          // Registration successful, perform any additional actions if needed
          setRegistrationSuccess(true);
          onRegister();
        } else {
          // Handle registration failure, show error message, etc.
          console.error('Registration failed');
        }
      } else {
        // Handle errors in the credentials check response
        const errorData = await credentialsResponse.json();
        console.error('Error during credentials check:', errorData.error);
      }
    } catch (error) {
      // Handle other errors if needed
      console.error('Error during registration:', error);
    }
  };
  
  const closePopupAndReset = () => {
    setRegistrationSuccess(false);
    onClose();
  };
  

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Register</h2>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Surname:
          <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </label>
        <button className={styles.registerbutton} onClick={handleRegister}>
          Register
        </button>
        <button className={styles.registerbutton} onClick={onClose}>
          Close
        </button>
        {registrationSuccess && (
          <RegistrationSuccess onClose={closePopupAndReset} />
        )}
      </div>
    </div>
  );
};
export default ClientRegisterPopup;
