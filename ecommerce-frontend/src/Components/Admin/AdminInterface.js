import React, { useState, useEffect } from 'react';
import AdminProductTable from './AdminElements/AdminProductTable';
import AddAdminProduct from './AdminElements/AddAdminProduct';
import CategoryManagement from './AdminElements/CategoryManagement';
import AddCategory from './AdminElements/AddCategory';

function AdminInterface() {
const [adminProducts, setAdminProducts] = useState([]);
const [newAdminProduct, setNewAdminProduct] = useState({product_name: '', description: '', price: '', amount: '', category_id: '',});
const [editProductId, setEditProductId] = useState(null);
const [editedProduct, setEditedProduct] = useState({product_name: '', description: '', price: '', amount: '', category_id: '',});
const [selectedCategoryId, setSelectedCategoryId] = useState(null);
const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState('');
const [editCategoryId, setEditCategoryId] = useState(null);
const [editedCategory, setEditedCategory] = useState('');

useEffect(() => {
  // Fetch admin products and categories
  Promise.all([
    fetch('/api/admin/Products').then((response) => response.json()),
    fetch('/api/admin/Categories').then((response) => response.json()),
  ])
    .then(([productsData, categoriesData]) => {
      // Include products with empty category_id
      const allProducts = productsData.products.concat(
        productsData.products.filter((product) => product.category_id === '')
      );
      setAdminProducts(allProducts);
      setCategories(categoriesData.categories);
    })
    .catch((error) => console.error('Error fetching data:', error));
}, []);

  const handleAddAdminProduct = async () => {
    try {
      if (!newAdminProduct.category_id) {
        alert('Please select a category!');
        return;
      }
      const response = await fetch('/api/admin/Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newAdminProduct, category_id: newAdminProduct.category_id || '' }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.message);
  
      // Refresh the list of admin products after adding a new one.
      const productsResponse = await fetch('/api/admin/Products');
      const productsData = await productsResponse.json();
  
      setAdminProducts(productsData.products);
  
      // Clear the input fields
      setNewAdminProduct({
        product_name: '',
        description: '',
        price: '',
        amount: '',
        category_id: '', // Set it to empty after adding a product
      });
    } catch (error) {
      console.error('Error adding admin product:', error);
    }
  };

const handleDeleteAdminProduct = (productId) => {
  fetch(`/api/admin/Products/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Refresh the list of admin products after deleting one.
      fetch('/api/admin/Products')
        .then((response) => response.json())
        .then((data) => setAdminProducts(data.products))
        .catch((error) => console.error('Error fetching admin products:', error));
    })
    .catch((error) => console.error('Error deleting admin product:', error));
};

const handleEditAdminProduct = (productId) => {
  // Set the editProductId state
  setEditProductId(productId);

  // Find the product to edit based on the product_id
  const productToEdit = adminProducts.find((product) => product.product_id === productId);
  setEditedProduct({ ...productToEdit });
};

const handleSaveAdminProduct = () => {
  const productIdInt = parseInt(editedProduct.product_id, 10);

  // Check if productId is a valid integer
  if (!isNaN(productIdInt) && productIdInt > 0) {
    const updatedProduct = {
      ...editedProduct,
      product_id: productIdInt,
    };

    fetch(`/api/admin/Products/${productIdInt}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);

        // Refresh the list of admin products after updating one.
        fetch('/api/admin/Products')
          .then((response) => response.json())
          .then((data) => setAdminProducts(data.products))
          .catch((error) => console.error('Error fetching admin products:', error));

        // Clear the editProduct state
        setEditProductId(null);
        setEditedProduct({ product_name: '', description: '', price: '', amount: '' });
      })
      .catch((error) => console.error('Error updating admin product:', error));
  } else {
    console.error('ProductID is not a valid integer');
  }
};

  const handleAddCategory = () => {
    fetch('/api/admin/Categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_name: newCategory }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Refresh the list of categories after adding a new one.
        fetch('/api/admin/Categories')
          .then((response) => response.json())
          .then((data) => setCategories(data.categories))
          .catch((error) => console.error('Error fetching categories:', error));
      })
      .catch((error) => console.error('Error adding category:', error));
  };
  
  const handleCategorySelection = (categoryId) => {
    const id = categoryId ? parseInt(categoryId, 10) : null;
    setSelectedCategoryId(id);
  
    // Fetch all products if no specific category is selected
    const url = id ? `/api/admin/Products?category_id=${id}` : '/api/admin/Products';
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => setAdminProducts(data.products))
      .catch((error) => console.error('Error fetching products by category:', error));
  };
    
  const handleDeleteCategory = (categoryId) => {
    fetch(`/api/admin/Categories/${categoryId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Refresh the list of categories after deleting one.
        fetch('/api/admin/Categories')
          .then((response) => response.json())
          .then((data) => setCategories(data.categories))
          .catch((error) => console.error('Error fetching categories:', error));
  
        // If the deleted category was the selected one, reset the selection
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
          setAdminProducts([]); // Clear associated products
        }
      })
      .catch((error) => console.error('Error deleting category:', error));
  };
  
  const handleEditCategory = (categoryId) => {
    // Set the editCategoryId state
    setEditCategoryId(categoryId);
  
    // Find the category to edit based on the category_id
    const categoryToEdit = categories.find((category) => category.category_id === categoryId);
    setEditedCategory(categoryToEdit.category_name);
  };
  
  const handleSaveCategory = (categoryId) => {
    fetch(`/api/admin/Categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_name: editedCategory }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
  
        // Refresh the list of categories after updating one.
        fetch('/api/admin/Categories')
          .then((response) => response.json())
          .then((data) => setCategories(data.categories))
          .catch((error) => console.error('Error fetching categories:', error));
  
        // Clear the editCategoryId state
        setEditCategoryId(null);
        setEditedCategory('');
      })
      .catch((error) => console.error('Error updating category:', error));
  };
  


  return (
    <div>
    <header>
      <h1>Administration Section</h1>
    </header>

      <AddAdminProduct
        newAdminProduct={newAdminProduct}
        categories={categories}
        setNewAdminProduct={setNewAdminProduct}
        handleAddAdminProduct={handleAddAdminProduct}
      />


      <AddCategory
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
      />


      <CategoryManagement
        selectedCategoryId={selectedCategoryId}
        categories={categories}
        editCategoryId={editCategoryId}
        handleCategorySelection={handleCategorySelection}
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        handleSaveCategory={handleSaveCategory}
      />

      
      <AdminProductTable
        adminProducts={adminProducts}
        selectedCategoryId={selectedCategoryId}
        categories={categories}
        editProductId={editProductId}
        editedProduct={editedProduct}
        handleEditAdminProduct={handleEditAdminProduct}
        handleDeleteAdminProduct={handleDeleteAdminProduct}
        handleSaveAdminProduct={handleSaveAdminProduct}
        setEditedProduct={setEditedProduct}
      />
    </div>
  );
}
export default AdminInterface;