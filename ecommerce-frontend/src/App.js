import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import AdminInterface from './Components/Admin/AdminInterface';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminRegister from './Components/Admin/AdminRegister';
import ClientInterface from './Components/Client/ClientInterface';


function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    console.log('isAdminLoggedIn on mount:', isAdminLoggedIn);
  }, [isAdminLoggedIn]);
    return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
          
          <Route path="/admin/register" element={<AdminRegister/>} />

          {isAdminLoggedIn ? (
        <>
          <Route path="/admin" element={<AdminInterface/>} />
        </>
      ) : (
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/login" />}
        />
      )}

          <Route path="/" element={<ClientInterface/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
