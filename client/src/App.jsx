import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Subscribed from './pages/Subscribed';
import Submit from './pages/Submit';
import Mobile from './pages/Mobile';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/pricing' element={<Pricing />} />
        <Route exact path='/privacy' element={<Privacy />} />
        <Route exact path='/subscribed' element={<Subscribed />} />
        <Route exact path='/_submit' element={<Submit />} />
        <Route exact path='/mobile' element={<Mobile />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
