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
import { resetData, selectData, fetchAll, selectLoading } from "./uomSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { UomTable } from "./UomTable";

export const UomPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectData);
  const loading = useSelector(selectLoading);

  // Filter
  const [name, setName] = useState("");

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
    handleSearch()
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      name: name,
      page: 1,
      page_size: 100,
    };
    try {
      const response = await dispatch(fetchAll(params));
      console.log(response);
      if (response.payload.data.success === true) {
      } else {
        showErrorDialog(response.payload.data.error);
      }
    } catch (error) {
      showErrorDialog(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="UOM (Unit Of Measure)">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/master-data/uom/create")}
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
                    onKeyPress={handleKeyPress}
                    value={name}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
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
        {data && data.length > 0 && <UomTable data={data} loading={loading} />}
      </CardBody>
    </Card>
  );
};
