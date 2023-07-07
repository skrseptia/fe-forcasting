import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  editItem,
  fetchId,
  resetData,
  selectDataId,
  selectLoading,
} from "./productsSlice";
import { useHistory, useParams } from "react-router";
import {
  showSuccessDialog,
  showErrorDialog,
  showDialog,
} from "../../../utility";
import Select from "react-select";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { fetchAll, selectData } from "../uom/uomSlice";

export const ProductsEdit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);
  const dataUom = useSelector(selectData);
  const dataId = useSelector(selectDataId);
  const { id } = useParams();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uom, setUom] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [addQty, setAddQty] = useState("");

  useEffect(() => {
    async function fetchMyAPI() {
      // Reset on first load
      await dispatch(resetData());

      await callApi(id);

      await dispatch(
        fetchAll({
          page: 1,
          page_size: 100,
        })
      );
    }
    fetchMyAPI();
  }, [dispatch]);

  const callApi = async (id) => {
    try {
      const response = await dispatch(fetchId(id));
      console.log(response, "response");
      if (response.payload.status === 200) {
      } else {
        showErrorDialog(response.payload.data.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  useEffect(() => {
    if (dataId != null) {
      setCode(dataId.code);
      setName(dataId.name);
      setDescription(dataId.description);
      setUom(dataId.uom.id);
      setPrice(dataId.price);
      setQty(dataId.qty);
    }
  }, [dataId]);

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
      qty: parseFloat(qty) + parseFloat(addQty),
    };

    console.log(params, "params");

    try {
      const response = await dispatch(editItem({params, id}));
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
    <>
      {dataId && (
        <Card>
          <CardHeader title="Edit Product"></CardHeader>
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
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>
                    Name <b className="color-red">*</b>
                  </b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    disabled
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
                    disabled
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
                    options={uomOptions}
                    value={getValueUom(uom, uomOptions)}
                    onChange={handleUomChange}
                    isDisabled
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
                    disabled
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>Add Qty</b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="number"
                    onChange={(e) => {
                      setAddQty(parseInt(e.target.value));
                    }}
                    value={addQty}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>Total Qty</b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="number"
                    value={parseInt(qty) + parseInt(addQty)}
                    disabled
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
      )}
    </>
  );
};
