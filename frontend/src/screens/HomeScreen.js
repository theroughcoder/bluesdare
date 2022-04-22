import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import data from '../data'
import axios from "axios"

function HomeScreen() {

//fetching the data from server  
const [products, setProducts] = useState([]);
useEffect(()=>{
  const fetchData = async() =>{
    const result = await axios.get("/api/products");
    setProducts(result.data)
  }
  fetchData();
}, []);

  return (
    <>
      <p className="featured">Featured Product</p>

      <div className="products">

        {products.map((value) => {
          return (
            <div className="product" key={value.slug}>
            <Link to= {`/product/ ${value.slug}`}>
              <img src={value.image} />
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