import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayCar from './DisplayCar';//this is exported from the Display car file, basically a page
import AddCustomer from './AddCustomer';
import CustomerInfo from './CustomerInfo';
import SearchCustomer from './SearchCustomer';
import AddPartsOrder from './AddPartsOrder';
import SellerHistory from './SellerHistory';
import AverageTime from './AverageTime';
import AddCar from './AddCar';
import CarInfo from './CarInfo';
import PriceReport from './PriceReport';
import PartOrderStatus from './PartOrderStatus';
import PartsStatistics from './PartsStatistics';
import SummaryReport from './SummaryReport';
import SummaryReportDetail from './SummaryReportDetail';
import AddVendor from './AddVendor';
import SearchVendor from './SearchVendor';
import SalesOrder from './SalesOrder';
import SaleConfirmation from './SaleConfirmation';

import Home from './home';
import Login from './Login';
import CarDetail from './CarDetail';
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
          <Route path="/AddCar" element={<AddCar />} />
          <Route path="/SearchCustomer" element={<SearchCustomer />} />
          <Route path="/CustomerInfo" element={<CustomerInfo />} />
          <Route path="/AddPartsOrder" element={<AddPartsOrder />} />
          <Route path="/SellerHistory" element={<SellerHistory />} />
          <Route path="/AverageTime" element={<AverageTime />} />
          <Route path="/CarInfo" element={<CarInfo />} />
          <Route path="/PriceReport" element={<PriceReport />} />
          <Route path="/PartOrderStatus" element={<PartOrderStatus />} />
          <Route path="/PartsStatistics" element={<PartsStatistics />} />
          <Route path="/SummaryReport" element={<SummaryReport />} />
          <Route path="/SummaryReportDetail/:year/:month" element={<SummaryReportDetail />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/CarDetail" element={<CarDetail/>}></Route>
          <Route path="/AddVendor" element={<AddVendor/>}></Route>
          <Route path="/SearchVendor" element={<SearchVendor/>}></Route>
          <Route path="/SalesOrder" element={<SalesOrder/>}></Route>
          <Route path="/SaleConfirmation" element={<SaleConfirmation/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;