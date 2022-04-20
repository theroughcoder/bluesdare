// import logo from './logo.svg';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import {BrowserRouter,Routes, Route, Link} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
          <Link to="/">Bluesdare</Link>
      </header>
      
      <main >
      <Routes>
          <Route path= "/" element={<HomeScreen/>} />;
          <Route path= "/product/:slug" element={<ProductScreen/>} />;
      </Routes>
      </main>

    </div>
    </BrowserRouter>
  );
}

export default App;
