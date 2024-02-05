import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { addToCart, selectCartItems } from '../../features/cart/cartSlice';
import './shopping-cart.scss';

const ShoppingCart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: 1,
        name: 'Product Name',
        price: 10.99,
        quantity: 1,
      })
    );
  };

  // Function to format the price with main and decimal parts
  const formatPrice = (price: number) => {
    const [main, decimal] = price.toFixed(2).split('.');
    return (
      <span>
        <span className="main-price">
          {main}.
        </span>
        <sup className="decimal-price">{decimal}</sup>
      </span>
    );
  };

  return (
    <div className={`shopping-cart${isOpen ? ' open' : ''}`}>
      <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
        {/* Updated JSX for SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="47.54" height="35.92" viewBox="0 0 47.54 38.92" className='cart-svg'>
          <svg data-v-1196b37a="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="47.54" height="35.92" viewBox="0 0 47.54 38.92" className='cart-svg' ><defs data-v-1196b37a=""><clipPath data-v-1196b37a="" id="a" transform="translate(-1.31 -6.91)"><rect data-v-1196b37a="" width="50.16" height="50.16" fill="none"></rect></clipPath></defs><path data-v-1196b37a="" d="M48.35,8.76H43.18a3.46,3.46,0,0,0-3.38,2.68l-.95,4.49h-.1a.34.34,0,0,0-.1-.16l-2-2.14a.51.51,0,0,0-.38-.16L29,13.59l-.82-1.7a.51.51,0,0,0-.55-.28l-2.87.6L23.73,8h0v0h0c-.24-.9-1.57-1.25-3.18-.83a4.65,4.65,0,0,0-1.73.83,1.39,1.39,0,0,0-.64,1.44v0h0l.92,3.79H14.45L12.58,10.8a.48.48,0,0,0-.35-.19.51.51,0,0,0-.37.13L6,15.93H4.77a3.49,3.49,0,0,0-2.85,1.49,3.45,3.45,0,0,0-.39,3.17L6.35,35.26A3.48,3.48,0,0,0,9.59,37.5H32.48a3.45,3.45,0,0,0,3.37-2.68l4.93-23.16a2.45,2.45,0,0,1,2.4-1.9h5.17a.5.5,0,0,0,.5-.5A.5.5,0,0,0,48.35,8.76ZM36.1,14.47l1.34,1.46h-7.3s0,0,0,0l-.62-1.3Zm-8.62-1.8.78,1.63h0L29,15.93H25.72L25,13.18Zm-8-4a3.71,3.71,0,0,1,1.34-.63,4.26,4.26,0,0,1,1-.14c.57,0,.9.15.93.25h0s0,.19-.31.42a3.55,3.55,0,0,1-1.34.63c-1.19.31-1.92,0-2-.11S19.17,8.92,19.45,8.68Zm0,1.62a4.21,4.21,0,0,0,.63.06,5.13,5.13,0,0,0,1.29-.18,4.48,4.48,0,0,0,1.7-.81l1.64,6.56h-3.8l.54-2.14a.51.51,0,0,0-.09-.43.51.51,0,0,0-.4-.19h-.81Zm.31,3.87h.56l-.44,1.76H16.63l-1.39-1.76Zm-7.61-2.33,3.23,4.09H7.54ZM34.88,34.6a2.45,2.45,0,0,1-2.4,1.9H9.59a2.47,2.47,0,0,1-2.3-1.57L2.47,20.26a2.46,2.46,0,0,1,2.3-3.33H38.64Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path><path data-v-1196b37a="" d="M12.19,39.37a3.23,3.23,0,1,0,3.23,3.23A3.23,3.23,0,0,0,12.19,39.37Zm0,5.45a2.23,2.23,0,1,1,2.23-2.22A2.21,2.21,0,0,1,12.19,44.82Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path><path data-v-1196b37a="" d="M28.32,39.37a3.23,3.23,0,1,0,3.22,3.23A3.23,3.23,0,0,0,28.32,39.37Zm0,5.45a2.23,2.23,0,1,1,2.22-2.22A2.22,2.22,0,0,1,28.32,44.82Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path><path data-v-1196b37a="" d="M10.26,19.19a.51.51,0,0,0-.63-.32.49.49,0,0,0-.32.63l4.81,14.65a.51.51,0,0,0,.48.35.4.4,0,0,0,.15,0,.49.49,0,0,0,.32-.63Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path><path data-v-1196b37a="" d="M18.32,19.19a.5.5,0,0,0-.95.31l4.82,14.65a.5.5,0,0,0,.47.35.45.45,0,0,0,.16,0,.5.5,0,0,0,.32-.63Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path><path data-v-1196b37a="" d="M30.25,34.15a.51.51,0,0,0,.48.35.4.40,0,0,0,.15,0,.49.49,0,0,0,.32-.63L26.39,19.19a.52.52,0,0,0-.64-.32.5.50,0,0,0-.31.63Z" transform="translate(-1.31 -6.91)" fill="#1579F2"></path></svg>
        </svg>
      </div>

      {/* Use Bootstrap styling for price */}
      <button className='cart-price' onClick={handleAddToCart}>
        {formatPrice(0.00)} ₪
      </button>

      {/* Display Cart Items */}
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
          </li>
        ))}
      </ul>

      {/* Display Pay Now button */}
      <div className="pay-button">
        {/* Add your Pay Now button content here */}
      </div>
    </div>
  );
};

export default ShoppingCart;