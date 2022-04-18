import logo from './logo.svg';
import './App.css';
import data from './data'

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <a href="">Bluesdare</a>
      </header>
      <main >
        <p className = "featured">Featured Product</p>

        <div className = "products">
        {data.products.map((value) =>{
          return(
            <div className = "product" key = {value._id}>
              <img src = {value.image} />
              <div className = "product-info">
                <p>{value.name}</p>
                <p> <strong>&#x20B9; {value.price}</strong></p>
                <button>Add to cart</button>
              </div>
            </div>
          )
        })}
        </div>

      </main>
    </div>
  );
}

export default App;
