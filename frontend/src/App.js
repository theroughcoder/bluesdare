// import logo from './logo.svg';
import "./App.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import  Nav  from "react-bootstrap/Nav";
import  Badge from "react-bootstrap/Badge";

import { Store } from "./Store";
import { useContext } from "react";
import { CartScreen } from "./screens/CartScreen";
import { NavDropdown } from "react-bootstrap";



function App() {
  const {state, dispatch: ctxDispatch} = useContext(Store);
  
  const {cart, userInfo} = state;
  const signoutHandler = () => {
   
    ctxDispatch({type: 'USER_SIGNOUT'});
  }

  return (
    <BrowserRouter>
      <div className="App d-flex flex-column ">
      <ToastContainer position="bottom-center" limit={1} />
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
                { userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider/>
                    <Link className="dropdown-item" to="#signout" onClick={signoutHandler}>
                    Sign Out
                    </Link>
                </NavDropdown>
                ):(
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<HomeScreen />} />;
              <Route path="/product/:slug" element={<ProductScreen />} />;
              <Route path="/signin" element={<SigninScreen/>} />;
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
