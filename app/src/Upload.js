import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Upload.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [excelData, setExcelData] = useState([]);
  const [productName, setProductName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('excelFile', file);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus(response.data.message);

      // Fetch Excel data after upload
      fetchExcelData();
    } catch (error) {
      console.error(error);
      setUploadStatus('Error uploading Excel file');
    }
  };

  const fetchExcelData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/excel-data');
      setExcelData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-product', {
        productName,
        deliveryDate,
        customerDetails
      });
      // Fetch Excel data after adding new product
      fetchExcelData();
      setProductName('');
      setDeliveryDate('');
      setCustomerDetails('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-product/${productId}`);
      // Fetch Excel data after deleting product
      fetchExcelData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExcelData();
  }, []);

  return (
    <div className="container">
      <h1>Excel File Upload</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <input 
          type="date" 
          placeholder="Delivery Date" 
          value={deliveryDate} 
          onChange={(e) => setDeliveryDate(e.target.value)} 
          max={new Date().toISOString().split("T")[0]} // Set max attribute to today's date
          required 
        />
        <input type="text" placeholder="Customer Details" value={customerDetails} onChange={(e) => setCustomerDetails(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
      
      <h2>Search</h2>
      <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />

      <h2>Excel Data</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Delivery Date</th>
            <th>Customer Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {excelData.filter((row) => {
            if (searchTerm === '') {
              return row;
            } else if (row.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
              return row;
            }
            return false;
          }).map((row, index) => (
            <tr key={index}>
              <td>{row.productName}</td>
              <td>{row.deliveryDate}</td>
              <td>{row.customerDetails}</td>
              <td><button onClick={() => handleDelete(row.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
