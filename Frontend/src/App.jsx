import React, { useContext } from 'react'
import { Routes,Route,BrowserRouter, useLocation, Navigate } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Home from "./pages/Home";
import Nav from './components/Nav';
import { userDatacontext } from './context/UserContext';
import Collections from './pages/Collections';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';


function App() {
  let {userData} = useContext(userDatacontext)
  let location = useLocation()
  return (
    <>
    {userData &&< Nav/>}
      <Routes>
        <Route path='/Login' element={userData ? (<Navigate to = {Location.state?.from || "/"}/>):(<Login/>)}/>
        <Route path='/signup' element={userData ? (<Navigate to = {Location.state?.from || "/"}/>):(<Registration/>)}/>
        <Route path='/' element={userData ? <Home/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/about' element={userData ? <About/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/collection' element={userData ? <Collections/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/product' element={userData ? <Product/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/contact' element={userData ? <Contact/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/productdetail/:productId' element={userData ? <ProductDetail/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/cart' element={userData ? <Cart/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/placeorder' element={userData ? <PlaceOrder/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
        <Route path='/order' element={userData ? <Order/> : <Navigate to ="/login" state={{from:location.pathname}}/>}/>
      </Routes>
    </>
  )
   
}

export default App
