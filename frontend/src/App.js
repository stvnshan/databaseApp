import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./web/search";
import Home from "./web/home";


function App() {
  return ( 
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
          
            <Routes>
              <Route path="/" element = {<Home />}/>
              <Route path="/question/search" element = {<Search />}/>
            </Routes>
          </BrowserRouter>
          
        </header>
      </div> 
  );
}

export default App;
