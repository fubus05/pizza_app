import './cart.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

interface CartItem {
    id: string;
    name: string;
    image_url: string;
    quantity: number;
}
  
const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [calc, setCalc] = useState<{ subtotal?: number; tax?: number; total?: number }>({}); 
    const [showPopup, setShowPopup] = useState(false);
    const nav = useNavigate();

    const userInfoString = localStorage.getItem('user_info');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : {};
  
    const { country, pizzeria_name: selectedPizzeria } = userInfo;

    useEffect(() => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }, []);

    const removeFromCart = (itemId: string) => {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      checkout();
    };
  
    const updateQuantity = (itemId: string, newQuantity: number) => {
      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      checkout();
    };

    const checkout = async () => {
        try {
          const cartData = cartItems.map((item) => ({
            pizza_id: parseInt(item.id, 10),
            quantity: item.quantity,
          }));
          const response = await axios.post(
            'http://127.0.0.1:8000/add_to_cart',
            cartData
          );
          setCalc(response.data)
        } catch (error) {
          console.error('Error during checkout:', error);
        }
      }; 
      
      useEffect(() => {
        checkout();
      
        localStorage.setItem(
          'user_info',
          JSON.stringify({ country, pizzeria_name: selectedPizzeria, cartItems })
        );
      }, [cartItems]);
      
    const ConfirmOrder = async () => {
      try {
        await axios.post(
          'http://127.0.0.1:8000/complete_order',
          [userInfo]
        );
        openPopup()
      } catch (error) {
        console.error('Error during checkout:', error);
      }
    }; 

    const openPopup = () => {
      setShowPopup(true);
    };
  
    const closePopup = () => {
      setShowPopup(false);
      localStorage.removeItem('cart');
      nav('/')
    };
  
    const Popup = () => (
      <div className="popup">
        <p>Order succesfully created</p>
        <button onClick={closePopup}>Close</button>
      </div>
    );
  

    return (
      <div>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
                {cartItems.map((item) => (
                <li key={item.id}>
                    <img src={item.image_url} alt={item.name} width={50} />
                    {item.name} - Quantity: {item.quantity}
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
                ))}
            </ul>
            <p>Subtotal: {calc.subtotal}</p>
            <p>Tax: {calc.tax}</p>
            <p>Total: {calc.total}</p>
            <button onClick={ConfirmOrder}>Confirm Order</button>
            {showPopup && <Popup />}
          </>
        )}
      </div>
    );
  };
  
  export default Cart;
  