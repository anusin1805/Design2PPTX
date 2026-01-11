
import React, { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { SearchBar } from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css'; // Assume some basic styling

function App() {
  // 11. What would be the impact of storing cart data in localStorage vs sessionStorage?
  //    localStorage persists across browser sessions, sessionStorage clears when the tab closes.
  //    We'll use localStorage for a more persistent cart experience.
  const [cart, setCart] = useLocalStorage('cart', []);
  const [products, setProducts] = useState([]); // Assume products are fetched or defined elsewhere
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000); // Default max price
  const [category, setCategory] = useState('');

  // Simulating product data fetch
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const allProducts = [
      { id: 'p1', name: 'Orange', price: 1.50, category: 'fruits', imageUrl: 'orange.jpg' },
      { id: 'p2', name: 'Apple', price: 2.00, category: 'fruits', imageUrl: 'apple.jpg' },
      { id: 'p3', name: 'Guava', price: 3.20, category: 'fruits', imageUrl: 'guava.jpg' },
      { id: 'p4', name: 'Smartphone', price: 1200.00, category: 'electronics', imageUrl: 'smartphone.jpg' },
      { id: 'p5', name: 'Laptop', price: 1800.00, category: 'electronics', imageUrl: 'laptop.jpg' },
      { id: 'p6', name: 'Headphones', price: 150.00, category: 'electronics', imageUrl: 'headphones.jpg' },
    ];
    setProducts(allProducts);
    setFilteredProducts(allProducts); // Initially, all products are filtered products
  }, []);

  // 3. Dynamic filtering by Price and Category (from Image 3)
  useEffect(() => {
    let currentFiltered = products.filter(product =>
      product.price >= minPrice &&
      product.price <= maxPrice &&
      (category === '' || product.category === category) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(currentFiltered);
  }, [products, minPrice, maxPrice, category, searchTerm]);

  // 6. Handling Duplicate Products in Cart (from Image 2)
  const addToCart = (productToAdd) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === productToAdd.id);

      if (existingProduct) {
        // If product exists, increase quantity
        return prevCart.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product is new, add it with quantity 1
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // 10. How would you animate the removal of a cart item (from Image 7)
  // For a basic example, we'll just filter it out. In a real app,
  // you might use CSS transitions/animations triggered by a state change
  // or a library like 'react-transition-group'.
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    // A visual animation would involve setting a 'removing' state for the item,
    // applying a fade-out class, and then truly removing it after the animation.
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Awesome E-commerce Store</h1>
      </header>
      <main className="App-main">
        <aside className="App-sidebar">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            category={category}
            setCategory={setCategory}
            categories={[...new Set(products.map(p => p.category))]} // Dynamically get categories
          />
          <Cart
            cartItems={cart}
            removeFromCart={removeFromCart}
            // 1. Extend updateCartDisplay to support coupon codes or promotional discounts (from Image 1 & 7)
            //    This logic would typically live within the Cart component or a CartContext
            //    For now, we'll pass the cart items and let Cart handle discount calculation.
            // 1. How would you modify the function to show a subtotal per item and a discount if quantity exceeds a threshold? (Image 4)
            //    This logic can be integrated into the CartItem component or Cart component itself.
          />
        </aside>
        <section className="App-content">
          {/* 9. Performance issues if cart contains hundreds of items - optimize rendering (Image 4) */}
          {/* This is addressed by efficiently mapping products and potentially virtualizing long lists */}
          <ProductList
            products={filteredProducts}
            addToCart={addToCart}
            title="Featured Products" // Example title
            // 9. Accessibility improvements for navigation (Image 5)
            //    We can add ARIA attributes in the ProductList and ProductCard components.
          />
      
    
          
       </section>
      </main>
    </div>
  );
}

export default App;
