// AddAdminProduct.jsx
import React from 'react';

const AddAdminProduct = ({ newAdminProduct, categories, setNewAdminProduct, handleAddAdminProduct }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddAdminProduct();
  };
  return (
    <>
    <form className="add-admin-product-container" onSubmit={handleSubmit}>

<h2>Add New Admin Product</h2>
    <input
      type="text"
      placeholder="Name"
      value={newAdminProduct.product_name}
      onChange={(e) =>
        setNewAdminProduct({ ...newAdminProduct, product_name: e.target.value })
      }
    />
    <input
      type="text"
      placeholder="Description"
      value={newAdminProduct.description}
      onChange={(e) =>
        setNewAdminProduct({ ...newAdminProduct, description: e.target.value })
      }
    />
    <input
      type="text"
      placeholder="Price"
      value={newAdminProduct.price}
      onChange={(e) =>
        setNewAdminProduct({ ...newAdminProduct, price: e.target.value })
      }
    />
    <input
      type="text"
      placeholder="Amount"
      value={newAdminProduct.amount}
      onChange={(e) =>
        setNewAdminProduct({ ...newAdminProduct, amount: e.target.value })
      }
    />
    <select
  value={newAdminProduct.category_id || ''}
  onChange={(e) => setNewAdminProduct({ ...newAdminProduct, category_id: e.target.value })}
  onClick={(e) => setNewAdminProduct({ ...newAdminProduct, category_id: e.target.value })}

>
  <option value="" disabled>Select a category</option>
  {categories.map((category) => (
    <option key={category.category_id} value={category.category_id}>
      {category.category_name}
    </option>
  ))}
</select>

<button type="submit">Add Admin Product</button>
    </form>

    </>
  );
}

export default AddAdminProduct;
