// cartController.js

let cart = []; // This will store the cart items

const addToCart = (product) => {
  // Check if the product is already in the cart
  const existingItem = cart.find((item) => item.product_id === product.product_id);

  if (existingItem) {
    // If the product is already in the cart, increase the quantity
    existingItem.quantity += 1;
  } else {
    // If the product is not in the cart, add it with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  return cart;
};

const getCartItems = () => {
  return cart;
};

// You can add more cart-related functions as needed

module.exports = {
  addToCart,
  getCartItems,
};
