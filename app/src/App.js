import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import PastDeliveries from './PastDeliveries';
import DeliveryTable from './DeliveryTable';
import Dlogin from './Dlogin';
import Ilogin from './Ilogin';
import Upload from './Upload';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='PastDeliveries' element={<PastDeliveries/>}/>
        <Route path='DeliveryTable' element={<DeliveryTable/>}/>
        <Route path='Dlogin' element={<Dlogin/>}/>
        <Route path='Ilogin' element={<Ilogin/>}/>
        <Route path='Upload' element={<Upload/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;