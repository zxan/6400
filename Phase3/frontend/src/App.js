import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayCar from './DisplayCar';//this is exported from the Display car file, basically a page
import AddCustomer from './AddCustomer';
import CustomerInfo from './CustomerInfo';
import AddPartsOrder from './AddPartsOrder';
import SellerHistory from './SellerHistory';//this is exported from the Display car file, basically a page
import AverageTime from './AverageTime';
import PriceReport from './PriceReport';
import Home from './home';
import Login from './Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
function App() {
  const [message, setMessage] = useState("");

//This file is really just for routing, each path is basically what comes after localhost:3000
  return (
    <div className="App">

<Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/DisplayCar" element={<DisplayCar />} />
          <Route path="/AddCustomer" element={<AddCustomer />} />
          <Route path="/CustomerInfo" element={<CustomerInfo />} />
          <Route path="/AddPartsOrder" element={<AddPartsOrder />} />
          <Route path="/SellerHistory" element={<SellerHistory />} />
          <Route path="/AverageTime" element={<AverageTime />} />
          <Route path="/PriceReport" element={<PriceReport />} />
          <Route path="/Login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;