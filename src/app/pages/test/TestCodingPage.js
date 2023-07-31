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

import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showDialog, showErrorDialog } from "../../../utility";

export const TestCodingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // value
  const [nilai, setNilai] = useState("");
  const [persen, setPersen] = useState("");
  const [value, setValue] = useState("");

  const handleHitung = () => {
    setValue("");
    if (nilai === "" || persen === "") {
      showDialog("Mohon isi nilai dan persen terlebih dahulu.");
      return;
    }

    const hitung = (nilai * persen) / 100;
    setValue(hitung); // Memastikan hasil persen memiliki 2 angka di belakang koma.
  };

  return (
    <Card>
      <CardHeader title="Test Coding"></CardHeader>
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Nilai</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setNilai(e.target.value)}
                    value={nilai}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Persen</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPersen(e.target.value)}
                    value={persen}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={3}>
                  <Button className="btn btn-danger" onClick={handleHitung}>
                    Hitung
                  </Button>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Hasil</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control type="text" value={value} disabled />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}
          </Form.Group>
        </Form>
      </CardBody>
    </Card>
  );
};
