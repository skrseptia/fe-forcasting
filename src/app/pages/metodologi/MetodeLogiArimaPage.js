import React, { useEffect, useState, useRef } from "react";
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
  fetchmetodelogiArima,
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
import BootstrapTable from "react-bootstrap-table-next";
import { useReactToPrint } from "react-to-print";

export const MetodeLogiArimaPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectmetodelogi);
  const loading = useSelector(selectLoading);
  const dataProduct = useSelector(selectData);
  const conponentPDF = useRef();

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

  const [product, setProduct] = useState([]);
  const [prediksi, setPrediksi] = useState(4);

  const [listQty, setListQty] = useState(null);
  const [listPredictions, setListPredictions] = useState(null);

  const [labels, setLabels] = useState([]);
  const [dataChartDaily, setDataChartDaily] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const [formulationData, setFormulationData] = useState([]);
  const [predicted, setPredicted] = useState([]);
  const [table, setTable] = useState([]);
  const [MAE, setMAE] = useState(null);
  const [MAPE, setMAPE] = useState(null);
  const [showParams, setShowParams] = useState(false);
  const [predict, setPredict] = useState([]);

  const toggleParams = () => {
    setShowParams((prev) => !prev);
  };

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
    if (product.length < 1) {
      return showDialog("Please Input product");
    }
    if (prediksi === "") {
      return showDialog("Please Input product");
    }
    let adjustedPrediksi = prediksi;
    if (predict === "month") {
      adjustedPrediksi *= 4;  // Pastikan nilai dikalikan 4 sebelum digunakan
    }

    const params = {
      p: 1,
      d: 0,
      q: 1,
      P: 1,  // Seasonal AR order
      D: 0,  // Seasonal differencing order
      Q: 1,  // Seasonal MA order
      s: 35, // Seasonal period (e.g., 12 for monthly data, 4 for triwulan, 7 for weekly)
      pl: adjustedPrediksi,
      product_id: product.toString(),
    };

    console.log(params, "params");
    try {
      const response = await dispatch(fetchmetodelogiArima(params));
      console.log(response, "response");
      if (response.payload.data.success === true) {
        setForecastData({});
        const dataChart = response.payload.data.data;

        // const listLabel = dataChart.labels.slice(-20);
        const listLabel = dataChart.labels;

        let listDataDaily =
          dataChart.datasets !== null
            ? dataChart.datasets.map((item, index) => {
              const colors = [
                { borderColor: "rgba(232, 104, 104, 0.8)", backgroundColor: "rgba(232, 104, 104, 0.8)" }, // Merah
                { borderColor: "rgba(66, 181, 248, 0.8)", backgroundColor: "rgba(66, 181, 248, 0.8)" }, // Biru
              ];
              const color = colors[index % colors.length];
              if (item.label.includes("Forecast")) {
                return {
                  type: "line",
                  borderColor: color.borderColor,
                  backgroundColor: color.backgroundColor,
                  borderWidth: 2,
                  fill: false,
                  ...item,
                };
              } else {
                return {
                  type: "line",

                  borderColor: color.borderColor,
                  backgroundColor: color.backgroundColor,
                  ...item,
                };
              }
            })
            : [];

        const nilai = listDataDaily[1].data;

        const hasil = listLabel.map((week, index) => ({
          no: index + 1,
          week,
          value: nilai[index],
        }));

        const dataActual = dataChart.actual

        const indexDataActual = dataChart.actual.length;

        const hasilPrediksi = dataChart.predicted;

        const _hasilPrediksi = hasilPrediksi.map((item, index) => ({
          no: indexDataActual + index + 1,
          label: `Week ${indexDataActual + index + 1} - ${item.toFixed(2)}`,
        }));

        const hasilMAE = dataChart.mean_absolute_error;
        const hasilMSE = dataChart.mse.toFixed(2);
        const hasilMAPE = dataChart.mape.toFixed(2);

        setPredicted(_hasilPrediksi);
        setMAE(hasilMAE);
        setMAPE(hasilMAPE);
        setTable(hasil);
        setLabels(listLabel);
        setDataChartDaily(listDataDaily);
      } else {
        showErrorDialog(response.payload.error);
      }
    } catch (error) {
      showErrorDialog(error);
    }
  };

  console.log(forecastData, "data");

  const productOptions = dataProduct.map((e) => {
    return {
      value: e.id,
      label: e.name,
    };
  });

  const handleChangeProduct = (value) => {
    setProduct(value.value);
  };

  const predictOptions = [
    {
      label: 'Month',
      value: 'month',
    },
    {
      label: 'Week',
      value: 'week',
    },
  ]

  const handleChangePredict = (value) => {
    setPredict(value.value);
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
        selectedOptions.map(function (selectedOption) {
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

  const columns = [
    { text: "No", dataField: "no" },
    { text: "Week", dataField: "week" },
    { text: "qty", dataField: "value" },
  ];

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("Data saved in PDF"),
  });

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Prediksi Sarima">
        <CardHeaderToolbar>
          <Button className="btn btn-danger" onClick={generatePDF}>
            PDF
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
                  <b>Prediksi </b>
                </Form.Label>
                  <Col sm={9}>
                    <Row className="g-1">
                      <Col xs={3}>
                        <Form.Control
                          type="number"
                          min={1}
                          onChange={(e) => setPrediksi(e.target.value)}
                          value={prediksi}
                        />
                      </Col>
                      <Col xs={6}>
                        <Select
                          options={predictOptions}
                          value={getValueOptions(predict, predictOptions)}
                          onChange={handleChangePredict}
                          className="w-100"
                        />
                      </Col>
                    </Row>
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Category Name</b>
                </Form.Label>
                <Col sm={6}>
                  <Select
                    options={productOptions}
                    value={getValueOptions(product, productOptions)}
                    onChange={handleChangeProduct}
                    className="mt-4 ml-3"
                  />
                  {/* <MultiSelectAll
                    options={productOptions}
                    value={getValueProduct(product)}
                    onChange={handleProductChange}
                    placeholder="Select"
                  /> */}
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

        <div>
          <h3>Hasil Prediksi</h3>
          <h3>----------------------------------</h3>

            <div className="mb-3">
              <Button onClick={toggleParams} className="btn btn-danger">
                {showParams ? "Tutup" : "Cek Param Prediksi"}
              </Button>
            </div>



            {showParams && (
              <div>
                <h3>Dengan Parameter :</h3>
                <h3>p : 1</h3>
                <h3>d : 0</h3>
                <h3>q : 1</h3>
                <h3>P : 1</h3>
                <h3>D : 0</h3>
                <h3>Q : 1</h3>
                <h3>s : 12</h3>
              </div>
            )}
          <h3>----------------------------------</h3>






          {predicted.map((item) => (
            <div key={item.label}>
              <h3>{item.label}</h3>
            </div>
          ))}

          <h3>MAE : {MAE}</h3>
          <h3>MAPE : {MAPE} %</h3>
        </div>

        <>
          <div ref={conponentPDF}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bootstrap4
              bordered={false}
              keyField="id"
              data={table}
              columns={columns}
              hover
            ></BootstrapTable>
          </div>
        </>
      </CardBody>
    </Card>
  );
};
