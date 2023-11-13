import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ setIsAdminLoggedIn }) {
const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send a POST request to the server for admin login
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('login successful');
        setIsAdminLoggedIn(true);
        console.log('isAdminLoggedIn set to true');
        navigate('/admin');


      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        // Handle login error as needed
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other errors if needed
    }
  };
  return (
    <div>
      <h2>Admin Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/admin/register">Register</Link>
      </p>
    </div>
  );
}

export default AdminLogin;
