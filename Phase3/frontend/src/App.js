import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayCar from './DisplayCar';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching the API", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">

<Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/DisplayCar" element={<DisplayCar />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;