import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationSuccess from '../RegistrationSuccess';

function AdminRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationCode, setRegistrationCode] = useState('');
    const staticRegistrationCode = '1234'; // Replace with your actual static code
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleRegister = async () => {
      try {
        // Check if the registration code matches the static code
        if (registrationCode !== staticRegistrationCode) {
          console.error('Invalid registration code');
          alert('Invalid registration code');
          return;
        }
    
        // Send a GET request to the server to check if username and password already exist
        const response = await fetch(`/api/admin/checkCredentials?username=${username}&password=${password}`);
    
        if (response.ok) {
          const { usernameExists, passwordExists } = await response.json();
    
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
          // Send a POST request to the server for admin registration
          const registerResponse = await fetch('/api/admin/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, registrationCode }),
          });
    
          if (registerResponse.ok) {
            setShowSuccessModal(true);
            console.log('Registration successful');
          } else {
            const errorData = await registerResponse.json();
            console.error('Registration failed:', errorData.error);
            alert('Registration failed: ' + errorData.error);
          }
        } else {
          const errorData = await response.json();
          console.error('Error during credentials check:', errorData.error);
          alert('Error during credentials check: ' + errorData.error);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration: ' + error.message);
      }
    };
    
      const closeModal = () => {
        // Close the success modal
        setShowSuccessModal(false);
      };

      return (
        <div>
          <h2>Admin Registration</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Registration Code"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>

          {showSuccessModal && <RegistrationSuccess onClose={closeModal} />}
          <p>
            Already have an account? <Link to="/admin/login">Login</Link>
          </p>
        </div>
      );
    }

export default AdminRegister;