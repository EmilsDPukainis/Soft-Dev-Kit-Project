// CategoryManagement.jsx
import React from 'react';

const CategoryManagement = ({ selectedCategoryId, categories, editCategoryId, editedCategory, handleCategorySelection, handleEditCategory, handleDeleteCategory, setEditedCategory, handleSaveCategory }) => {
  return (
    <>

<div className="category-management-container">
      
      <label>Select Category: </label>
<select
  value={selectedCategoryId || ''}
  onChange={(e) => handleCategorySelection(e.target.value)}
>
  <option value="">All Categories</option>
  {categories.map((category) => (
    <option key={category.category_id} value={category.category_id}>
      {category.category_name}
    </option>
  ))}
</select>

{selectedCategoryId && (
  <div>
    <button onClick={() => handleEditCategory(selectedCategoryId)}>Edit Category</button>
    <button onClick={() => handleDeleteCategory(selectedCategoryId)}>Delete Category</button>
  </div>
)}
{editCategoryId && (
  <div>
    <input
      type="text"
      placeholder="Edit Category"
      value={editedCategory}
      onChange={(e) => setEditedCategory(e.target.value)}
    />
    <button onClick={() => handleSaveCategory(editCategoryId)}>Save Category</button>
  </div>
)}

    </div>


    </>
  );
}

export default CategoryManagement;
