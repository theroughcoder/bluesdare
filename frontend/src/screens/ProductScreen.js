
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import axios from "axios";
import { useEffect, useReducer } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async"
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils"
import { useContext } from "react"
import { Store } from "../Store"

function ProductScreen(){
  const navigate = useNavigate();
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
       useEffect( () => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const {state, dispatch : ctxDispatch} = useContext(Store);
  const{cart} = state;
  
const addToCartHandler = async() => {
  const  existItem = cart.cartItems.find((x)=> x._id === product._id);
  const quantity = existItem? existItem.quantity+1 : 1;
  const {data} = await axios.get(`/api/products/${product._id}`);

  if(data.countInStock < quantity) {
    window.alert('Sorry. Product is out of stock');
    return
  }

  ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity: quantity}})
  navigate('/cart');
}

return(
    <>

    <div className="container">
      {loading ? ( <LoadingBox/>) :
         error ? ( <MessageBox variant="danger">{error}</MessageBox>) :
          
        
          <Container>
            <Row>
              <Col md ={6}>
                <img className = "img-large"
                  src={product.image}
                  alt={product.name}
                />
              </Col>
              <Col md ={3}>
                <ListGroup variant = "flush">
                  <ListGroup.Item>
                    <Helmet>
                      <title>{product.name}</title>
                    </Helmet>
                    <h1>{product.name}</h1>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating rating ={product.rating} reviews ={product.numReviews} />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description:
                    <p>{product.description}</p>
                   </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md ={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant= "flush">
                    <ListGroup.Item>
                     <Row>
                       <Col>Price</Col>
                       <Col><strong>&#x20B9; {product.price}</strong></Col>
                     </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                     <Row>
                       <Col>Status:</Col>
                       <Col>{product.countInStock > 0? <Badge bg="success">In Stock</Badge>: <Badge bg="danger">Out Of Stock</Badge>}</Col>
                     </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <div className= "d-grid">
                        <Button onClick={addToCartHandler} variant="warning">Add to Cart</Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>

              </Col>
            </Row>
          </Container>
         }
    </div>

  </>
)
}


export default ProductScreen;