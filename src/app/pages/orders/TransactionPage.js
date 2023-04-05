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
} from "./transactionSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { TransactionTable } from "./TransactionTable";

export const TransactionPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectData);
  const loading = useSelector(selectLoading);

  // Filter
  const [no, setNo] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      no: no,
    };
    try {
      const response = await dispatch(fetchAll(params));
      if (response.payload.data.success === true) {
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


  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Transaction">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/transaction/create")}
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
                  <b>No Transaction</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setNo(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Date</b>
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
        {data && data.length > 0 && (
          <TransactionTable data={data} loading={loading} />
        )}
      </CardBody>
    </Card>
  );
};
