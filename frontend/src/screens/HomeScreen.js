import { useEffect, useReducer, useState } from 'react';
import logger from 'use-reducer-logger';
import { Link } from 'react-router-dom';
// import data from '../data'
import axios from "axios"

function HomeScreen() {

 const reducer = (state, action)=> {
    switch(action.type){
      case "FETCH_REQUEST" : 
      return {...state, loading : true, }

      case "FETCH_SUCCESS" : 
      return {...state, products: action.payload,  loading : false, }

      case "FETCH_FAIL" : 
      return {...state, loading : false, error: action.payload}

      default:
        return state;
    }
 }

//fetching the data from server  
const [{loading, products, error}, dispatch] = useReducer(logger( reducer), {
  products: [],
  loading : true,
  error: ""
})

// const [products, setProducts] = useState([]);
useEffect(()=>{
  const fetchData = async() =>{
    dispatch({type: "FETCH_REQUEST"});
    try{
      const result = await axios.get("/api/products");
      dispatch({type : "FETCH_SUCCESS", payload: result.data});
    } catch(err){
      dispatch({type : "FETCH_FAIL", payload : err.message})
    }
    // setProducts(result.data)
  }
  fetchData();
}, []);

  return (
    <>
      <p className="featured">Featured Product</p>

      <div className="products">{
      loading ? <div>Loading....</div>:
      error ? {error}: 

        products.map((value) => {
          return (
            <div className="product" key={value.slug}>
            <Link to= {`/product/ ${value.slug}`}>
              <img src={value.image}/>
            </Link>
              <div className="product-info">
                <p>{value.name}</p>
                <p><strong>&#x20B9; {value.price}</strong></p>
                <button>Add to cart</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HomeScreen;