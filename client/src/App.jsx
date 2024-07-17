
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import UpdateListing from './pages/UpdateListing';
import Header from './components/Header';
import PrivacyRouter from './components/PrivacyRouter';
import { useState, useEffect, Suspense } from 'react';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Admin from './components/Admin';
import WelcomePage from './pages/WelcomePage';
import ResetPassword from './pages/ResetPassword';
import PasswordResetRequest from './pages/PasswordResetRequest';
import NotFound from './pages/NotFound';


function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);

  
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter className='bg-white'>
      <Suspense fallback={<div>Loading...</div>}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path='/*' element={<NotFound />} />
          <Route path="/" element={<WelcomePage />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/request-password-reset" element={<PasswordResetRequest />} />
          
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />

          <Route path="/adminpkgowda" element={<Admin />} />
          
          <Route element={<PrivacyRouter />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/createlisting" element={<CreateListing />} />
            <Route path="/updatelisting/:listingId" element={<UpdateListing />} />
            
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
