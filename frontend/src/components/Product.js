import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";

function product(prop) {
  const { product } = prop;
  return (
    <Card  >
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>  
        </Link>
        <Rating rating ={product.rating} reviews ={product.numReviews} />
        <Card.Text> <strong>&#x20B9; {product.price}</strong></Card.Text>
        <Button >Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default product;
