import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeContent from './components/HomeContent';
import NoMatch from './components/NoMatch';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';
import PasswordReset from './components/PasswordReset';
import { useState } from 'react';


const App = () => {
  // success message for deletion of account
  const [ alertMessage, setAlertMessage ] = useState('');

  const showAlertMessage = () => {
    setAlertMessage('You have successfully deleted your account.');
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomeContent alertMessage={alertMessage} />} />    {/* this is the default child route when '/' path is rendered */}
        <Route path='/profile/:userId' element={<UserProfile showAlertMessage={showAlertMessage} />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/password-reset/confirm' element={<PasswordReset />} />
        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;