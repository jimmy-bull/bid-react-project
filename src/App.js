import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';
import { Routes, Route, } from "react-router-dom";
import Header from "./views/header";
import Footer from "./views/footer";
import Home from "./views/home";
import Login from './views/login';
import Register from './views/register';
import UserHomePage from './views/userHome';
import Products from './views/product';
import Detail from './views/detail';

function App() {
  return (
    <div className="App" style={{ margin: 0, padding: 0 }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="/product/:id-:category" element={<Products />} />
        <Route path="/detail/:id-:category-:categoryid/:date" element={<Detail />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
