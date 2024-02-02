import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContent from './components/HomeContent';
import Login from './components/Login';
import Signup from './components/Signup';
import NoMatch from './components/NoMatch';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomeContent />} />    {/* this is the default child route when '/' path is rendered */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;