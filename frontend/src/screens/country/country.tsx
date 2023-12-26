import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './country.css';

const Country = () => {
  const [selectedCountry, setSelectedCountry] = useState('UA');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem('user_info', JSON.stringify({ country: selectedCountry }));
  }, [selectedCountry]);

  return (
    <>
      <h2>Select your country</h2>
      <p>Let's start by choosing the country where you currently are:</p>
      <select
        id="countrySelect"
        name="country"
        value={selectedCountry}
        onChange={handleSelectChange}
      >
        <option value="UA">Ukraine</option>
        <option value="US">United States</option>
        <option value="NZ">New Zealand</option>
        <option value="AU">Australia</option>
      </select>
      <div>
        <button id='countryConfirm'>
          {/* Pass the selected country as state to the next route */}
          <Link to="/pizzeria" state={{ country: selectedCountry }}>
            Confirm
          </Link>
        </button>
      </div>
    </>
  );
};

export default Country;