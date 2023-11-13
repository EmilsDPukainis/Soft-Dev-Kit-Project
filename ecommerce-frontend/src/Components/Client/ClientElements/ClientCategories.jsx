// ClientCategories.jsx
import React from 'react';
import styles from './ClientInterface.module.css';

const ClientCategories = ({ categories, handleCategorySelection }) => {
  return (
    <div className={styles['categories-container']}>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>
            <button className={styles.button} onClick={() => handleCategorySelection(category.category_id)}>
              {category.category_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientCategories;
