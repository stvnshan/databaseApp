import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from  "./web/home";
import Search from "./web/search";
import Search2 from './web/search2';
import MapView from './web/mapview';


function App() {
   return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question/" element={<Search />} />
          <Route path="/question2/" element={<Search2 />} />
          <Route path="/question3/" element={<MapView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
