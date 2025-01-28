import { Box, useColorModeValue } from '@chakra-ui/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import { useEffect, useState } from 'react';
import Search from './pages/Search.jsx'
import AddItem from './pages/AddItem.jsx'
import ItemPage from './pages/ItemPage.jsx'
import MyCart from './pages/MyCart.jsx'

const PrivateRoute = ({ element }) => {
  if (localStorage.getItem('token')) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const handleStorageChange = () => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }; 

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
};
}, []);

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />}
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/profile" /> : <Home />}
        /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/add-item" element={<PrivateRoute element={<AddItem />} />} />
        <Route path="/cart" element={<PrivateRoute element={<MyCart />} />} />
        <Route path="/items/:itemId" element={<PrivateRoute element={<ItemPage />} />} />
      </Routes>
    </Box>
  )
}

export default App
