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

     case "DELETE_REQUEST":
         return {...state, loadingDelete : true, };
          
     case "DELETE_SUCCESS":
         return {...state, loadingDelete : false , successfulDelete : true}; 

     case "DELETE_FAIL":
         return {...state, loadingDelete : false};

     case "DELETE_RESET":
         return {...state, loadingDelete : false, successfulDelete: false};  
    default:
      return state;
  }
};

export default function ProductListScreen() {
    const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const [{ loading, products, pages, error, loadingCreate, loadingDelete, successfulDelete }, dispatch] = useReducer(reducer, {
    loading: true, 
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/admin?page=${page}`, {
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
    if(successfulDelete){
    dispatch({type: 'DELETE_RESET'});
    }
  }, [userInfo, page, successfulDelete]);

  const createHandler = async()=>{
    if(window.confirm('Are you sure to create?')){
        try{
            dispatch({type: 'CREATE_REQUEST'});
            const {data} = await axios.post(  `${process.env.REACT_APP_BACKEND_URL}/api/products`,
             {},
             {headers : {Authorization: `Bearer ${userInfo.token}`}})
            toast.success('product created successfully');
            dispatch({type : 'CREATE_SUCCESS'});

            navigate(`/admin/product/${data.product._id}`)

        } catch(err){
            toast.error(getError(error));
            dispatch({type: 'CREATE_FAIL'});
        }
    }
  }

  const deleteHandler = async(product) => {
      if(window.confirm('Are you sure to delete?')){
          dispatch({type: 'DELETE_REQUEST'});
          try{
              await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/products/${product._id}`, {
                  headers: { Authorization: `Bearer ${userInfo.token}` }
              })
              toast.success('Product deleted successfully');
              dispatch({type: 'DELETE_SUCCESS'})
          } catch(err){
              toast.error(getError(err));
              dispatch({
                  type: 'DELETE_FAIL'
              })
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
    {loadingDelete && <LoadingBox></LoadingBox>}
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
                <th>DELETE</th>
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
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
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
