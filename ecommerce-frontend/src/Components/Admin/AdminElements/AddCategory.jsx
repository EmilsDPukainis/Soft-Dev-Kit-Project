// AddCategory.jsx
import React from 'react';

const AddCategory = ({ newCategory, setNewCategory, handleAddCategory }) => {
  return (
    <>
    <div className='add-category-container'>
    <h2>Category Management</h2>

    <input
  type="text"
  placeholder="Name"
  value={newCategory}
  onChange={(e) => setNewCategory(e.target.value)}
/>
<button onClick={handleAddCategory}>Add Category</button>

    </div>
    </>
  );
}

export default AddCategory;
