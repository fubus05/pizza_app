import './pizzeria.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface Pizzeria {
  id: number;
  name: string;
}

const Pizzerias: React.FC = () => {
  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([]);
  const [selectedPizzeria, setSelectedPizzeria] = useState('');
  const { state } = useLocation();
  const { country } = state as { country: string };

  useEffect(() => {
    const fetchPizzerias = async () => {
      try {
        const response = await axios.get<Pizzeria[]>(`http://127.0.0.1:8000/pizzerias?country=${country}`);
        setPizzerias(response.data);
        setSelectedPizzeria(response.data[0].id.toString())
      } catch (error) {
        console.error('Error fetching pizzerias:', error);
      }
    };

    fetchPizzerias();
  }, [country]);

  const handleSelectPizzeria = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPizzeria(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem('user_info', JSON.stringify({ country, pizzeria_name: pizzerias.find(pizzeria => pizzeria.id.toString() === selectedPizzeria)?.name }));
  }, [selectedPizzeria, country, pizzerias]);


  return (
    <>
      <h2>Select your pizzeria</h2>
      <p>Select your pizzeria in your country:</p>
      <select id='pizzeriaSelect' onChange={handleSelectPizzeria} value={selectedPizzeria}>
        {pizzerias.map((pizzeria) => (
          <option key={pizzeria.id} value={pizzeria.id}>
            {pizzeria.name}
          </option>
        ))}
      </select>
      <div id="buttonBlock">
        <button id='pizzeriaConfirm'>
            <Link to="/avalible_pizza" state={{ pizzeria_id: selectedPizzeria }}>Confirm</Link>
        </button>
        <button id='pizzeriaConfirm'>
            <Link to="/">Return</Link>
        </button>
      </div>
    </>
  );
};

export default Pizzerias;
