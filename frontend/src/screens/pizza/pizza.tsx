import './pizza.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PizzaItem {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

const Pizza = () => {
  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const { state } = useLocation();
  const { pizzeria_id } = state as { pizzeria_id: string };

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get<PizzaItem[]>(`http://127.0.0.1:8000/pizzas_in_pizzeria/?pizzeria_id=${pizzeria_id}`);
        setPizzas(response.data);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      }
    };

    fetchPizzas();
  }, [pizzeria_id]);

  const addToCart = (pizza: PizzaItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingPizza = cart.find((item: any) => item.id === pizza.id);

    if (existingPizza) {
      existingPizza.quantity = (existingPizza.quantity || 1) + 1;
    } else {
      cart.push({ ...pizza, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <>
      {pizzas.map((pizza) => (
        <div key={pizza.id} id='pizzaCard'>
            <img src={pizza.image_url} alt={pizza.name} width={100}/>
            <h4>{pizza.name}</h4>
            <p>{pizza.description}</p>
            <button onClick={() => addToCart(pizza)}>Add to cart</button>
        </div>
      ))}
      <button id='cartButton'>
        <Link to='/cart'>Cart</Link>
      </button>
    </>
  );
};

export default Pizza;
