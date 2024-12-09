import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectLoading } from "./productsSlice";
import { useHistory } from "react-router";
import {
  showSuccessDialog,
  showErrorDialog,
  showDialog,
} from "../../../utility";
import Select from "react-select";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { fetchAll, selectData } from "../uom/uomSlice";

export const ProductCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);
  const dataUom = useSelector(selectData);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uom, setUom] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    // Fetch data on first load
    dispatch(
      fetchAll({
        page: 1,
        page_size: 100,
      })
    );
  }, [dispatch]);

  const uomOptions = dataUom.map((e) => {
    return {
      value: e.id,
      label: e.name,
    };
  });

  const getValueUom = (value, options) => {
    const return_value = options.filter((val) => value === val.value);
    return return_value;
  };

  const handleUomChange = (e, value) => {
    if (e === null) {
      value.uom = "";
    } else {
      value.uom = e.value;
    }
    setUom(value.uom);
  };

  const handleSave = async () => {
    if (code === "") {
      return showDialog("Please input code");
    }
    if (name === "") {
      return showDialog("Please input name");
    }
    if (description === "") {
      return showDialog("Please input description");
    }
    if (uom === "") {
      return showDialog("Please input uom");
    }
    if (price === "") {
      return showDialog("Please input price");
    }
    if (qty === "") {
      return showDialog("Please input qty");
    }
    const params = {
      code: code,
      name: name,
      description: description,
      uom_id: uom,
      price: parseFloat(price),
      qty: parseFloat(qty),
    };

    console.log(params, "params");

    try {
      const response = await dispatch(addItem(params));
      console.log(response, "response");
      if (response.payload.status === 200) {
        const action = await showSuccessDialog(response.payload.message);
        if (action.isConfirmed) history.goBack();
      } else {
        showErrorDialog(response.payload.error);
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
      <CardHeader title="Create Category"></CardHeader>
      <CardBody>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Code <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                value={code}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Category <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Description <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Uom <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Select
                isClearable={true}
                options={uomOptions}
                value={getValueUom(uom, uomOptions)}
                onChange={handleUomChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Price <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                value={price}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <b>
                Qty <b className="color-red">*</b>
              </b>
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="number"
                onChange={(e) => {
                  setQty(e.target.value);
                }}
                value={qty}
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
