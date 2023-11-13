import React, { useEffect, useState } from 'react';
import styles from './ClientInterface.module.css';

const ClientCartPopup = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from the server when the component mounts
    fetch('/api/cart')
      .then((response) => response.json())
      .then((data) => setCartItems(data.cart))
      .catch((error) => console.error('Error fetching cart items:', error));
  }, []);

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Shopping Cart</h2>
        {cartItems.map((item) => (
          <div key={item.product_id} className={styles.cartItem}>
            <span>{item.product_name}</span>
            <span>Quantity: {item.quantity}</span>
            <span>Price: ${item.price}</span>
          </div>
        ))}
        <button className={styles.registerbutton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ClientCartPopup;
