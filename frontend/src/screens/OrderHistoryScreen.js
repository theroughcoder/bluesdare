import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { Button, Card, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, orders: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
      orders: [],
      loading: true,
      error: "",
    })
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data.reverse() });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/signin");
    } else {
      fetchData();
    }
  }, [navigate]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1 className="my-3">Order History</h1>

      {loading ? (
        <div className="loading">
          <LoadingBox />
        </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Container>
          <Table  hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((x) =>(
                  
              <tr key={x._id}>
                <td>{x._id}</td>
                <td>{x.createdAt.substring(0, 10)}</td>
                <td>{x.totalPrice.toFixed(2)}</td>
                <td>{(x.isPaid)? x.paidAt.substring(0, 10) : 'No'}</td>
                <td>{x.isDelivered ? x.deliveredAt.substring(0, 10) : 'No'}</td>
                <td><Button type = 'button' variant="light" onClick = {()=>{ navigate(`/order/${x._id}`)}}>Details</Button></td>
              </tr>
              ))
                  
              }
            </tbody>
          </Table>
        </Container>
      )}
    </div>
  );
}
