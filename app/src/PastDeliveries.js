// PastDeliveries.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './PastDeliveries.css';

const PastDeliveries = () => {
  const location = useLocation();
  const selectedItems = location.state.selectedItems || [];

  return (
    <div className="past-deliveries-container">
      <h1>Past Deliveries</h1>
      <ul>
        {selectedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PastDeliveries;
