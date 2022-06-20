import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products : (action.payload.products),
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

     case "CREATE_REQUEST":
         return {...state, loadingCreate : true, };
          
     case "CREATE_SUCCESS":
         return {...state, loadingCreate : false}; 

     case "CREATE_FAIL":
         return {...state, loadingCreate : false};  
    default:
      return state;
  }
};

export default function ProductListScreen() {
    const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const [{ loading, products, pages, error, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true, 
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo, page]);

  const createHandler = async()=>{
    if(window.confirm('Are you sure to create?')){
        try{
            dispatch({type: 'CREATE_REQUEST'});
            const {data} = await axios.post('/api/products',
             {},
             {headers : {Authorization: `Bearer ${userInfo.token}`}})
            toast.success('product create successfully');
            dispatch({type : 'CREATE_SUCCESS'});

            navigate(`/admin/product/${data.product._id}`)

        } catch(err){
            toast.error(getError(error));
            dispatch({type: 'CREATE_FAIL'});
        }
    }
  }

  return (
    <div>
      <Row>
        <Col>
          <h1 className="heading"> Product List</h1>
        </Col>
        <Col className="col text-end">
          <Button type="button" onClick={createHandler}>Create Product</Button>
        </Col>
      </Row>
    {loadingCreate && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            {[...Array(pages).keys()].map((x) => (
              <LinkContainer
                key={x + 1}
                className="mx-1"
                to={`/admin/products?page=${x + 1}`}
              >
                <Button
                  className={Number(page) === x + 1. ? "text-bold" : ""}
                  variant="light"
                >
                  {x + 1}
                </Button>
              </LinkContainer>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
