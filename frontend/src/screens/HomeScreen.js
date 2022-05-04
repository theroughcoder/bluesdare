import { useEffect, useReducer, useState } from "react";
import logger from "use-reducer-logger";
// import data from '../data'
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError} from "../components/utils";

function HomeScreen() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, products: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <p className="featured">Featured Product</p>

      <div className="container">
        {loading ? (
          <LoadingBox/>
        ) : error ? (
          <MessageBox variant= "danger">{error}</MessageBox>
        ) : (
          <Container>
            <Row>
              {products.map((value) => {
                return (
                  <Col key={value.slug} sm={12} md={4} lg={3} className="mb-4">
                    <Product product={value} />
                  </Col>
                );
              })}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
}

export default HomeScreen;
