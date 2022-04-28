// import logo from './logo.svg';
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import {LinkContainer} from "react-router-bootstrap";

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column ">
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to ="/">
                <Navbar.Brand>Bluesdare</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />;
            <Route path="/product/:slug" element={<ProductScreen />} />;
          </Routes>
        </main>
        <footer>
          <div className = "text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
