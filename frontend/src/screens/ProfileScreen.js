import  axios  from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { getError } from '../utils'

export default function ProfileScreen() {
const navigate = useNavigate(); 
const{state, dispatch: ctxDispatch} = useContext(Store);
const {userInfo} = state;

const user = (userInfo || {});


const [name, setFullName] = useState(user.name );
const [email, setEmail] = useState(user.email );
const [password, setPassword] = useState();
const [confirmPassword, setConfirmPassword] = useState();

const submitHandler = async (e)=>{
    e.preventDefault();
    try{
        const {data} = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/profileupdate`, {
            name,
            email,
            password,
            confirmPassword
        }, {headers: {
            authorization: `Bearer ${userInfo.token}`,
          }});
        ctxDispatch({type: "USER_PROFILE_UPDATE", payload: data})
        navigate('/')
    }catch(err){
        toast.error(getError(err));
    }
} 

useEffect(() =>{
    if(!userInfo){
        navigate('/');
    }
}, [navigate, userInfo])


  return (
    <Container className="small-container">
    <Helmet>
        <title>User Profile</title>
    </Helmet>
    
    <h1 className="my-3">User Profile</h1>
    <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="n ame">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e)=>{setFullName(e.target.value)}} type="text" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control value = {email} onChange={(e)=>{ setEmail(e.target.value)}} type="email" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={(e)=>{setPassword(e.target.value)}} type="password" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control onChange={(e)=>{setConfirmPassword(e.target.value)}} type="password" required></Form.Control>
        </Form.Group>
        <div className="md-3">
            <Button type="submit">Update Details</Button>
        </div>

    </Form>

    </Container>
  )
}
