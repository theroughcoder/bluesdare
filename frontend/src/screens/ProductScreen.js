

import axios from "axios";
import { useEffect, useReducer } from "react";
import {useParams} from "react-router-dom";

function ProductScreen(){
    const {slug} = useParams();
    const reducer = (state, action) => {
        switch (action.type) {
          case "FETCH_REQUEST":
            return { ...state, loading: true };
          case "FETCH_SUCCESS":
            return { ...state, product: action.payload, loading: false };
          case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
          default:
            return state;
        }
      };
      const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: "",
      });
      // const [products, setProducts] = useState([]);
       useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);
    


return(
    <>

    <div >
      {loading ? (<div>Loading....</div>) :
         error ? ({ error }) :
          
        
          <div>{product.name}</div>
         }
    </div>
  </>
)
}


export default ProductScreen;