// DeliveryTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DeliveryTable.css'; // Import the CSS file

const TableRow = ({ product, deliveryDate, customerDetails, isDelivered, handleDeliveryStatus, handleCheckboxChange }) => {
  return (
    <tr>
      <td>{product}</td>
      <td>{deliveryDate}</td>
      <td>{customerDetails}</td>
      <td>
        <input 
          type="checkbox" 
          id={`accept_${product}`} 
          name="accept" 
          value="accept" 
          checked={isDelivered} 
          onChange={() => handleDeliveryStatus(product)} 
        />
      </td>
      <td>
        <input 
          type="checkbox" 
          checked={isDelivered} 
          onChange={() => handleCheckboxChange(product)} 
        />
      </td>
    </tr>
  );
};

const DeliveryTable = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/excel-data');
      setDeliveryData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeliveryStatus = async (productName) => {
    try {
      await axios.put(`http://localhost:5000/update-delivery-status/${productName}`);
      // After updating the delivery status, fetch the updated data
      fetchDeliveryData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (productName) => {
    setSelectedItems(prevState => {
      const index = prevState.indexOf(productName);
      if (index > -1) {
        return prevState.filter(item => item !== productName);
      } else {
        return [...prevState, productName];
      }
    });
  };

  const handleClick = () => {
    navigate('/PastDeliveries', { state: { selectedItems } }); // Pass selected items to PastDeliveries
  };

  const alertlogout = () =>{
    navigate('/');
  };

  return (
  <div className='body'>
    <div className="delivery-table-container">
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Delivery Date</th>
            <th>Customer Details</th>
            <th>Action</th>
            <th>Selected</th>
          </tr>
        </thead>
        <tbody>
          {deliveryData.map((item, index) => (
            <TableRow
              key={index}
              product={item.productName}
              deliveryDate={item.deliveryDate}
              customerDetails={item.customerDetails}
              isDelivered={item.isDelivered}
              handleDeliveryStatus={handleDeliveryStatus}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
        </tbody>
      </table>
      <button className="logout-button" onClick={alertlogout}>
        Logout
      </button>
      <button className="past-deliveries-button" onClick={handleClick}>
        Past Deliveries
      </button>
    </div>
  </div>
  );
};

export default DeliveryTable;
