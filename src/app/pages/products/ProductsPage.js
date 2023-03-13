import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectData,
  fetchAll,
  selectLoading,
} from "./productsSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { ProductsTable } from "./ProductsTable";

export const ProductPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectData);
  const loading = useSelector(selectLoading);

  // Filter
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      name: name,
      type: type,
    };
    try {
      const response = await dispatch(fetchAll(params));
      if (response.payload.data.status === 200) {
      } else {
        showErrorDialog(response.payload.data.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const dummy = [
    {
      no: 1,
      id: 1,
      full_name: "Ikhsan Guntara",
      email: "ikhsan.guntara98@gmail.com",
      password: "adg222823",
      image_url: "www.image.com",
      phone: "628123456789",
      address: "Narogong, Bekasi Timur",
      user_type: "admin",
    },
  ];

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Products">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/products/create")}
          >
            Create
          </Button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Name</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Type</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setType(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm={3}>
                  <Button className="btn btn-danger" onClick={handleSearch}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Form.Group>
        </Form>

        {/* Table */}
        {/* {data && data.length > 0 && (
       
        )} */}
        <ProductsTable
          data={data.length > 0 ? data : dummy}
          loading={loading}
        />
      </CardBody>
    </Card>
  );
};
