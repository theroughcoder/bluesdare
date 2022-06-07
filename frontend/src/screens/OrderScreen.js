import React from "react";
import { useEffect } from "react";
import {  useReducer } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
// import { toast } from "react-toastify";
import { getError } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { useParams} from "react-router-dom";
import axios from "axios";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { useContext } from "react";

 


export default function OrderScreen() {
  const {id} = useParams();
  const navigate = useNavigate()
  const{state} = useContext(Store);
  const{userInfo} = state;
  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, order: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    order: {},
    loading: true,
    error: "",
  });
  useEffect( () => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const {data} = await axios.get(`/api/orders/${id}`, {
          headers: {authorization: `Bearer ${userInfo.token}`} 
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if(!userInfo){
      return navigate('/signin')
    }else{
      fetchData();
    }
  }, [id, navigate]);


  return (
    <div>
      <Helmet>
        <title>Order: {id}</title>
      </Helmet>

      {loading ?  <div className="loading"><LoadingBox/></div>   
 :
         error ? ( <MessageBox variant="danger">{error}</MessageBox>) :
      <Container>

      <h1 className="my-3">Order ID : {id}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong>
                {order.shippingAddress.fullName} <br />
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </Card.Text>
              {order.isDelivered? <MessageBox variant="success">Delivered</MessageBox>: 
              <MessageBox variant="danger">Not Delivered</MessageBox> }
              
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong>
                {order.paymentMethod} <br />
              </Card.Text>
              {order.isPaid? <MessageBox variant="success">Paid</MessageBox>: 
              <MessageBox variant="danger">Not Paid</MessageBox> }
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>₹{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>₹{order.tax.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>₹{order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
           
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      </Container>
      }
    </div>
  )
}
