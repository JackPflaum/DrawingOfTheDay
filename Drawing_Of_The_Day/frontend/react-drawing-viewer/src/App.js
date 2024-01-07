import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContent from './components/HomeContent';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />} />
        <Route path='home' element={<HomeContent />} />
    </Routes>
  );
}

export default App;
