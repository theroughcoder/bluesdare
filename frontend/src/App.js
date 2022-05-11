// import logo from './logo.svg';
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import  Nav  from "react-bootstrap/Nav";
import  Badge from "react-bootstrap/Badge";

import { Store } from "./Store";
import { useContext } from "react";
import { CartScreen } from "./screens/CartScreen";

function App() {
  const {state} = useContext(Store);
  const {cart} = state;

  return (
    <BrowserRouter>
      <div className="App d-flex flex-column ">
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Bluesdare</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                     {cart.cartItems.reduce((a, c)=> a + c.quantity, 0)}
                    
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<HomeScreen />} />;
              <Route path="/product/:slug" element={<ProductScreen />} />;
              <Route path="/cart" element={<CartScreen />} />;
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}


export default App;
