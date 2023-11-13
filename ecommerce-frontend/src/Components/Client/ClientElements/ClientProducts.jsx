import React, { useState } from 'react';
import styles from './ClientInterface.module.css';
import ProductDetailsPopup from './ProductDetailsPopup';

const ClientProducts = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openDetailsPopup = (product) => {
    setSelectedProduct(product);
  };

  const closeDetailsPopup = () => {
    setSelectedProduct(null);
  };

  return (
    <div className={styles.productsContainer}>
      {products.map((product) => (
        <div
          key={product.product_id}
          className={styles.productBox}
          onClick={() => openDetailsPopup(product)}
        >
          <h3>{product.product_name}</h3>
          <p>Price: ${product.price}</p>
        </div>
      ))}

      {selectedProduct && (
        <ProductDetailsPopup
          product={selectedProduct}
          onClose={closeDetailsPopup}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default ClientProducts;