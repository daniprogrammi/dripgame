import './App.scss';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Contribute from '../Contribute/Contribute';
import About from '../About/About';
import Artwork from '../Artwork/Artwork';
import Navbar from '../../components/Navbar/Navbar';
import Admin from '../Admin/Admin';
import Canvas from '../../components/Canvas/Canvas';
import Footer from '../../components/Footer/Footer';
function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <header className='App-header'>
          <Navbar></Navbar>
        </header>
        <Routes>
          <Route exact path='/' element={<><Canvas></Canvas></>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contribute' element={<Contribute/>}/>
          <Route path='/artwork' element={<Artwork/>}/>
          <Route path='/admin' element={<Admin/>}/> {/*TODO:  Make admin hidden */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
