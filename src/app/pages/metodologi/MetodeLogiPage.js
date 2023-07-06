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
import { getValueOptions, showDialog, showErrorDialog } from "../../../utility";
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
  LineController,
  BarController,
  LineElement,
  PointElement,
} from "chart.js";
import { fetchAll, selectData } from "../products/productsSlice";
import Select from "react-select";
import MultiSelectAll from "../../../utility/MultiSelectAll";

export const MetodelogiPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectmetodelogi);
  const loading = useSelector(selectLoading);
  const dataProduct = useSelector(selectData);

  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
  );

  // Filter
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-05-31");
  const [product, setProduct] = useState([]);

  const [listQty, setListQty] = useState(null);
  const [listPredictions, setListPredictions] = useState(null);

  const [labels, setLabels] = useState([]);
  const [dataChartDaily, setDataChartDaily] = useState([]);
  const [forecastData, setForecastData] = useState({});

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());

    dispatch(
      fetchAll({
        page: 1,
        page_size: 100,
      })
    );
  }, [dispatch]);

  const handleSearch = async () => {
    if (startDate === "") {
      return showDialog("Please Input Date");
    }
    if (endDate === "") {
      return showDialog("Please Input Date");
    }
    if (product.length < 1) {
      return showDialog("Please Input product");
    }
    const params = {
      start_date: startDate,
      end_date: endDate,
      product_id: product.toString(),
    };

    console.log(params, "params");
    try {
      const response = await dispatch(fetchmetodelogi(params));
      console.log(response, "response");
      if (response.payload.data.success === true) {
        const dataChart = response.payload.data.data;

        const listLabel = dataChart.labels;

        const listDataDaily =
          dataChart.datasets !== null
            ? dataChart.datasets.map((item) => {
                const red = Math.floor(Math.random() * 256);
                const green = Math.floor(Math.random() * 256);
                const blue = Math.floor(Math.random() * 256);
                const alpha = Math.random();
                if (item.label.includes("Forecast")) {
                  return {
                    type: "line",
                    borderColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
                    borderWidth: 2,
                    fill: false,
                    ...item,
                  };
                } else {
                  return {
                    backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
                    ...item,
                  };
                }
              })
            : [];

        // Update forecastData state with the latest forecast values
        for (const item of dataChart.datasets) {
          if (item.label.includes("Forecast")) {
            const labelName = item.label.replace("Forecast - ", "");
            const lastData = item.data[item.data.length - 1];
            setForecastData((prevState) => ({
              ...prevState,
              [labelName]: lastData,
            }));
          }
        }
        setLabels(listLabel);
        setDataChartDaily(listDataDaily);
      } else {
        showErrorDialog(response.payload.error);
      }
    } catch (error) {
      showErrorDialog(error);
    }
  };

  const productOptions = dataProduct.map((e) => {
    return {
      value: e.id,
      label: e.name,
    };
  });

  const handleChangeProduct = (value) => {
    setProduct(value.value);
  };

  function getValueProduct(products) {
    let output = [];
    products.map((val) => {
      const result = productOptions.filter((product) => val == product.value);
      output.push(result[0]);
    });
    return output;
  }
  const handleProductChange = (selectedOptions) => {
    if (selectedOptions && Array.isArray(selectedOptions)) {
      setProduct(
        selectedOptions.map(function(selectedOption) {
          if (selectedOption) {
            return selectedOption.value;
          }
        })
      );
    } else {
      setProduct([]);
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
        align: "start",
        text: "Today",
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
    datasets: dataChartDaily,
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Prediksi Exponential Smoothing"></CardHeader>
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
                  {/* <Select
                    options={productOptions}
                    value={getValueOptions(product, productOptions)}
                    onChange={handleChangeProduct}
                    className="mt-4 ml-3"
                  /> */}
                  <MultiSelectAll
                    options={productOptions}
                    value={getValueProduct(product)}
                    onChange={handleProductChange}
                    placeholder="Select"
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

        <div className="mb-3">
          {Object.keys(forecastData).map((label) => (
            <h3 key={label} className="">
              Hasil Prediksi {label} = {forecastData[label]}
            </h3>
          ))}
        </div>

        <div style={{ heigth: "800px" }}>
          <Bar options={options} data={chart} />
        </div>
      </CardBody>
    </Card>
  );
};
