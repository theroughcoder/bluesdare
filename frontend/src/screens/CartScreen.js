import { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Alert } from "react-bootstrap";


function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: cdxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    cdxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };
  const removeItemHandler = async (item) => {
    cdxDispatch({ type: "CART_REMOVE_ITEM", payload: { ...item } });
  };
  const checkoutHandler = () => {
      navigate('/signin?redirect=/shopping');
  } 
  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="shopping-cart">Shopping Cart</h1>
      <Container>
        <Row>
          <Col md={8}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                return (
                  <ListGroup.Item key={item._id} className="mb-2">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid round img-thumbnail"
                        />
                      </Col>
                      <Col md={3}>
                        <Link
                          style={{
                            width: "200px",
                            display: "block",
                            textAlign: "left",
                          }}
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          variant="light"
                          disabled={item.quantity === 1}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      <Col md={3}>
                        <strong>&#x20B9; {item.price}</strong>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })
            ) : (
              <Alert style={{marginTop: "50px"}} variant="info">
                Cart is empty <Link to="/">Go Shopping</Link>
              </Alert>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      item) : <strong>&#x20B9;</strong>{" "}
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                       onClick={checkoutHandler}
                        type="button"
                        variant="primary"
                        disabled={cartItems.length === 0}
                      >
                        Proceed to Pay
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export { CartScreen };
