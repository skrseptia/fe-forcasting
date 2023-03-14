import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectLoading } from "./usersSlice";
import { useHistory } from "react-router";
import { showSuccessDialog, showErrorDialog } from "../../../utility";
import Select from "react-select";
import { LayoutSplashScreen } from "../../../_metronic/layout";

export const OrdersCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = async () => {
    const params = {
      full_name: fullname,
      email: email,
      password: password,
      phone: phone,
      address: address,
      user_type: type,
    };

    console.log(params, "params");

    return;
    try {
      const response = await dispatch(addItem(params));
      if (response.payload.status === 200) {
        const action = await showSuccessDialog(response.payload.message);
        if (action.isConfirmed) history.goBack();
      } else {
        showErrorDialog(response.payload.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
      console.log(error.message);
    }
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Create Parameter"></CardHeader>
      <CardBody>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Fullname <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                value={fullname}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Password <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                email <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Phone <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                value={phone}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Address <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                value={address}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Type <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setType(e.target.value);
                }}
                value={type}
              />
            </Col>
          </Form.Group>

          <Row className="mt-6">
            <Button
              variant="light"
              className="mr-3"
              onClick={() => history.goBack()}
            >
              <i className="fa fa-arrow-left"></i>Back
            </Button>

            <Button variant="danger" onClick={handleSave}>
              Save
            </Button>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};
