import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayCar from './DisplayCar';//this is exported from the Display car file, basically a page
import AddCustomer from './AddCustomer';
import CustomerInfo from './CustomerInfo';
import Home from './home';
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;