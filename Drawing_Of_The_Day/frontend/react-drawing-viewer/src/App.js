import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContent from './components/HomeContent';

import NoMatch from './components/NoMatch';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomeContent />} />    {/* this is the default child route when '/' path is rendered */}
        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;