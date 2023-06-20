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
import { showErrorDialog } from "../../../utility";
import {
  fetchmetodelogi,
  resetData,
  selectLoading,
  selectmetodelogi,
} from "./metologiSlice";

import {
  Doughnut,
  Bar,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

export const MetodelogiPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectmetodelogi);
  const loading = useSelector(selectLoading);

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );

  // Filter
  const [startDate, setStartDate] = useState("2023-02-01");
  const [endDate, setEndDate] = useState("2023-05-31");
  const [product, setProduct] = useState("Pupuk Kompos");

  const [labels, setLabels] = useState(null);
  const [listQty, setListQty] = useState(null);
  const [listPredictions, setListPredictions] = useState(null);

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      start_date: startDate,
      end_date: endDate,
      material: product,
    };
    try {
      const response = await dispatch(fetchmetodelogi(params));
      console.log(response, "response");
      if (response.payload.data.success === true) {
        if (response.payload.data.data.length > 0) {
          const data = response.payload.data.data;
          const listLabel = data.map((item) => item.Month);
          const listQty = data.map((item) => item.TotalQty);
          const listPredictions = data.map((item) => item.Predictions);

          setLabels(listLabel);
          setListQty(listQty);
          setListPredictions(listPredictions);

          console.log(listLabel, "listLabel");
          console.log(listQty, "listQty");
        }
      } else {
        showErrorDialog(response.payload.error);
      }
    } catch (error) {
      showErrorDialog(error);
    }
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        // display: false,
        position: "bottom",
      },
      title: {
        display: true,
        align: "center",
        text: "Prediksi Exponential Smoothing",
        font: {
          size: 30,
        },
        style: "italic",
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    layout: {
      padding: 20,
    },
  };

  const chart = {
    labels,
    datasets: [
      {
        label: "Data Product",
        data: listQty,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
      {
        label: "Predictions",
        data: listPredictions,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
    ],
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Transaction"></CardHeader>
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Start Date</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>End Date</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Product Name</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setProduct(e.target.value)}
                    value={product}
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

        <div style={{ heigth: "800px" }}>
          <Bar options={options} data={chart} />
        </div>
      </CardBody>
    </Card>
  );
};
