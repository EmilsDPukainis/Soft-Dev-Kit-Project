import React, { useState, useEffect } from 'react';
import ClientCategories from './ClientElements/ClientCategories';
import ClientProducts from './ClientElements/ClientProducts';
import ClientHeader from './ClientElements/ClientHeader';

const ClientInterface = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse, cartResponse] = await Promise.all([
        fetch('/api/Products'),
        fetch('/api/Categories'),
        fetch('/api/cart')
      ]);
  
      console.log('Products Response:', productsResponse);
      console.log('Categories Response:', categoriesResponse);
      console.log('Cart Response:', cartResponse);
      if (!productsResponse.ok) {
        throw new Error(`HTTP error! Status: ${productsResponse.status}`);
      }
      if (!categoriesResponse.ok) {
        throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
      }
      if (!cartResponse.ok) {
        throw new Error(`HTTP error! Status: ${cartResponse.status}`);
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const cartData = await cartResponse.json(); // Assuming cart data is returned as an object with a "cart" property

      // Include products with empty category_id
      const allProductsData = productsData.products.concat(
        productsData.products.filter((product) => product.category_id === '')
      );
      setAllProducts(allProductsData);

      // Randomly select 10 products as the default selection
      const randomDefaultProducts = getRandomProducts(allProductsData, 10);
      setProducts(randomDefaultProducts);

      setCategories(categoriesData.categories);
      setCartItems(cartData.cart); // Assuming the cart items are in a "cart" property of the response
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call the function to fetch data
  fetchData();
}, []);


  const getRandomProducts = (productsArray, count) => {
    const shuffledProducts = productsArray.sort(() => 0.5 - Math.random());
    return shuffledProducts.slice(0, count);
  };

  const handleCategorySelection = async (categoryId) => {
    const id = categoryId ? parseInt(categoryId, 10) : null;

    // Check if the same category is clicked again
    if (id === selectedCategoryId) {
      setSelectedCategoryId(null); // Reset the category filter
      setProducts(getRandomProducts(allProducts, 10)); // Randomly select 10 products
    } else {
      setSelectedCategoryId(id);

      // Fetch products based on the selected category
      const url = id ? `/api/Products?category_id=${id}` : '/api/Products';

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    }

    // Fetch and set categories again to ensure they are updated
    try {
      const categoriesResponse = await fetch('/api/Categories');

      if (!categoriesResponse.ok) {
        throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
      }

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    const url = query ? `/api/Search?query=${encodeURIComponent(query)}` : '/api/Products';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products by search:', error);
    }
  };

  const handleAddToCart = (product) => {
    // Check if the product object has the required properties
    if (!product || !product.product_id) {
      console.error('Invalid product data');
      return;
    }
  
    // Send a request to add the selected product to the cart
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: product.product_id,  // Send only the product_id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the local cart items state with the new data
        setCartItems(data.cart);
      })
      .catch((error) => console.error('Error adding to cart:', error));
  };
    
  return (
    <div className="client-interface">
      <ClientHeader 
  cartCount={cartItems ? cartItems.length : 0}
  onSearch={handleSearch}
      />

      {/* Display the list of categories */}
      <ClientCategories categories={categories} handleCategorySelection={handleCategorySelection} />

      {/* Display the list of products */}
      <ClientProducts
        products={products}
        selectedCategoryId={selectedCategoryId}
        searchQuery={searchQuery}
        handleDetailsClick={handleDetailsClick}
        onAddToCart={handleAddToCart} // Pass the onAddToCart function

      />

      {/* Display details of the selected product */}
      {selectedProduct && (
        <div className="selected-product-details">
          <h2>{selectedProduct.product_name}</h2>
          <p>{selectedProduct.description}</p>
          <p>Price: {selectedProduct.price}</p>
          <p>Amount: {selectedProduct.amount}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default ClientInterface;
