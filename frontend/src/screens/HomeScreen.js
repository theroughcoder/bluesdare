import { Link } from 'react-router-dom';
import data from '../data'

function HomeScreen() {
  return (
    <>
      <p className="featured">Featured Product</p>

      <div className="products">
        {data.products.map((value) => {
          return (
            <div className="product" key={value.slug}>
            <Link to= {`/product/ ${value.slug}`}>
              <img src={value.image} />
            </Link>
              <div className="product-info">
                <p>{value.name}</p>
                <p><strong>&#x20B9; {value.price}</strong></p>
                <button>Add to cart</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HomeScreen;