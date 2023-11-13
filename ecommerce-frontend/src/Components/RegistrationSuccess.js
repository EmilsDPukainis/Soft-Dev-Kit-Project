import React from 'react';

const RegistrationSuccess = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
      <p style={{ color: 'black' }}>You've registered successfully!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
