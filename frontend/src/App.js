// import logo from './logo.svg';
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";

import { Store } from "./Store";
import { useContext, useEffect, useState } from "react";
import { CartScreen } from "./screens/CartScreen";
import { Button, NavDropdown } from "react-bootstrap";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "App site-container active-cont "
            : "App site-container "
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header className="App-header">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
            <Nav className="me-auto ">

              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars" />
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Bluesdare</Navbar.Brand>
              </LinkContainer>
            </Nav>
            <Nav className="me-auto ">
              <SearchBox/>
            </Nav>
              <Nav >
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown " align="end" >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown" align="end">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
              </Nav>
            </Container>
          </Navbar>

        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-row"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <div className="d-grid gap-2">
              <Button
                onClick={() => setSidebarIsOpen(false)}
                variant="secondary"
                size="lg"
                // class=" "
              >
                Close &times;
              </Button>
              </div>
            </Nav.Item>
            <Nav.Item>
              <strong
                style={{
                  fontSize: "25px",
                  marginTop: "20px",
                  display: "block",
                }}
              >
                Categories
              </strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>
                    <span className="sidebar-link">{category}</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}

          </Nav>
        </div>
        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<HomeScreen />} />;
              <Route path="/product/:slug" element={<ProductScreen />} />;
              <Route path="/admin/product/:productId" element={<ProductEditScreen/>} />;
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen/></ProtectedRoute>} />;
              <Route path="/signin" element={<SigninScreen />} />;
              <Route path="/signup" element={<SignupScreen />} />;
              <Route path="/cart" element={<CartScreen />} />;
              <Route path="/shipping" element={<ShippingAddressScreen />} />;
              <Route path="/payment" element={<PaymentMethodScreen />} />;
              <Route path="/placeorder" element={<PlaceOrderScreen />} />;
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />;
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute> } />;
              <Route path="/search" element={<SearchScreen />} />;
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>}></Route>
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>}></Route>
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
