import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import {
  editItem,
  selectDataId,
  selectLoading,
  fetchId,
} from "./categoriesSlice";
import { useHistory, useParams } from "react-router";
import { showSuccessDialog, showErrorDialog } from "../../../utility";
import { LayoutSplashScreen } from "../../../_metronic/layout";

export const MerchantsEdit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const loading = useSelector(selectLoading);
  const dataId = useSelector(selectDataId);

  const [fullname, setFullname] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // Fetch data on first load
    dispatch(fetchId(id));
  }, [dispatch]);

  useEffect(() => {
    if (dataId !== null) {
      setFullname(dataId.name);
      setCode(dataId.code);
    }
  }, [dataId]);

  const handleSave = async () => {
    const id = dataId.id;
    const payload = {
      name: fullname,
      code: code,
    };

    try {
      const response = await dispatch(editItem({ id, payload }));
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
      <CardHeader title="Edit Categories"></CardHeader>
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
                Name <b className="color-red">*</b>
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
