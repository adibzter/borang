import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
