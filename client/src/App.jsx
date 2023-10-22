import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Donate from './pages/Donate';
import Qr from './pages/Qr';
import Submit from './pages/Submit';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/pricing' element={<Pricing />} />
        <Route exact path='/privacy' element={<Privacy />} />
        <Route exact path='/donate' element={<Donate />} />
        <Route exact path='/qr' element={<Qr />} />
        <Route exact path='/_submit' element={<Submit />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
