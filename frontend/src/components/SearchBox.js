import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState(' ');
    const submitHandler = (e)=>{
        e.preventDefault();
        navigate( query? `/search/?query=${query}` : '/search')
    }
  return (
    <Form className='d-flex me-auto' onSubmit={submitHandler}>
        <InputGroup>
            <FormControl type="text"
            name="q"
            id='q'
            onChange={(e)=>{setQuery(e.target.value)}}
            placeholder="search products..."
            aria-label="Search Products">
            </FormControl>
            <Button type='submit' variant="warning outline-primary">Search</Button>
        </InputGroup>
    </Form>
  )
}
