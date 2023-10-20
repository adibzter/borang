import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Donate from './pages/Donate';
import Qr from './pages/Qr';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/privacy' element={<Privacy />} />
        <Route exact path='/donate' element={<Donate />} />
        <Route exact path='/qr' element={<Qr />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
