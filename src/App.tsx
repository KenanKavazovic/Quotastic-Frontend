import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Wrapper from './components/Common/Wrapper';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './interfaces/reducer/User.reducer';
import LandingPage from './pages/LandingPage';
import axios from 'axios';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SettingsPassword from './pages/SettingsPassword';
import SettingsAvatar from './pages/SettingsAvatar';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state?.user.value);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('auth/me');
        dispatch(setUser(data));
      } catch (error) {
      } finally {
        setLoading(true);
      }
    };

    if (user) {
      setLoading(true);
    } else {
      fetchUserData();
    }
  }, [dispatch, user]);

  if (!loading) {
    return null;
  }

  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {!user ? (
          <>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </>
        ) : (
          <>
          <Route path='/profile/:user_id' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/changepassword' element={<SettingsPassword />} />
          <Route path='/changeprofilepicture' element={<SettingsAvatar />} />
          </>
        )}
      </Routes>
    </Wrapper>
  );
}

export default App;
