import React from 'react'
import { Col, Row } from 'react-bootstrap'

export default function CheckoutSteps(Props) {
  return (
    <Row className="checkout-steps">
        <Col className={Props.step1 ? 'active' : ''}>Sign-In</Col>
        <Col className={Props.step2 ? 'active' : ''}>Shipping</Col>
        <Col className={Props.step3 ? 'active' : ''}>Payment</Col>
        <Col className={Props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  )
}
