// ProductDetailsPopup.jsx
import React from 'react';
import styles from './ClientInterface.module.css'; // Update the import path based on your project structure

const ProductDetailsPopup = ({ product, onClose, onAddToCart }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>{product.product_name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Amount: {product.amount}</p>
        <button onClick={onAddToCart}>Add to Cart</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductDetailsPopup;
