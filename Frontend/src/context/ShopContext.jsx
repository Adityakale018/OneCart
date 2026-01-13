import React,{createContext, useContext, useEffect, useState} from 'react'
import { authDataContext } from './authContext'
export const shopDataContext = createContext()
import axios from 'axios'
import { userDatacontext } from './UserContext'

function ShopContext({children}) {

    let [products,setProducts] =useState([])
    let {serverUrl} = useContext(authDataContext)
    let {userData} = useContext(userDatacontext)
    let [search,setSearch] = useState('')
    let [showSearch,setShowSearch] = useState(false)
    let [cartItem,setCartItem] = useState({})
    let currency = "₹"
    let delivery_fee = 50;

    const getProducts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/product/list")
            console.log(result.data)
            setProducts(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const addToCart = async(itemId,size)=>{
      if(!size){
        console.log("Please select size")
        return
      }

      let cartData = structuredClone(cartItem) // clone the cart item
      if(cartData[itemId]){
        if(cartData[itemId][size]){
          cartData[itemId][size] += 1
        }else{
          cartData[itemId][size] = 1
        }
      }else{
        cartData[itemId] = {}
        cartData[itemId][size] = 1
      } 
      setCartItem(cartData)
      console.log(cartData)

      if(userData){
        try {
          let result = await axios.post(serverUrl + "/api/cart/add",{itemId,size},{withCredentials:true})
          console.log(result.data)
        } catch (error) {
          console.log(error)
        }
      }
    }

    const getUserCart = async () => {
      try {
        const result = await axios.post(serverUrl + "/api/cart/get",{},{withCredentials:true})
        setCartItem(result.data.cartData || {})
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

    const UpdateQuantity = async (itemId,size,quantity) => {
      let cartData = structuredClone(cartItem)
      cartData[itemId][size] = quantity
      setCartItem(cartData)
      
      if(userData){
        try {
          let result = await axios.post(serverUrl + "/api/cart/update",{itemId,size,quantity},{withCredentials:true})
          console.log(result.data)
        } catch (error) {
          console.log(error)
        }   
    }
  }

    const getCartCount =  ()=>{
      let totalCount = 0;
      for(const items in cartItem){
        for(const item in cartItem[items]){
          try{
            if(cartItem[items][item]>0){
              totalCount += cartItem[items][item]
            }
          }catch (error) {
            console.log(error)
          }
        }
      }
      return totalCount;
      
    }

    const getTotalAmount =()=>{
      let totalAmount = 0;
      for(const items in cartItem){
        let itemInfo = products.find((product)=>product._id === items);
        for(const item in cartItem[items]){
          try{
            if(cartItem[items][item]>0){
              totalAmount += cartItem[items][item] * itemInfo.price
            }
    }catch (error) {
            console.log(error)
          }
        }
      }
      return totalAmount;
    }

    useEffect(()=>{
        getProducts()
    },[])

    useEffect(()=>{
      getUserCart()
    },[])


    let value = {
        products,
        currency,
        delivery_fee,
        getProducts,
        showSearch,setShowSearch,
        search,setSearch,
        cartItem,setCartItem,
        addToCart,
        getCartCount,
        UpdateQuantity,
        getTotalAmount,
        serverUrl
    }
  return (
    <div>
      <shopDataContext.Provider value={value}>
        {children}
      </shopDataContext.Provider>
    </div>
  )
}

export default ShopContext
