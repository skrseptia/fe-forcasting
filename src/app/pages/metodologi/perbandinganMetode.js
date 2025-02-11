import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { Card, CardBody, CardHeader, CardHeaderToolbar } from "../../../_metronic/_partials/controls";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { getValueOptions, showDialog, showErrorDialog } from "../../../utility";
import {
    fetchmetodelogiExpo,
    fetchmetodelogiArima,
    resetData,
    selectLoading,
    selectmetodelogi,
} from "./metologiSlice";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from "chart.js";
import { fetchAll, selectData } from "../products/productsSlice";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController);

export const CombinedMetodePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const data = useSelector(selectmetodelogi);
    const loading = useSelector(selectLoading);
    const dataProduct = useSelector(selectData);
    const conponentPDF = useRef();

    // const [prediksi, setPrediksi] = useState(4);
    const [product, setProduct] = useState([]);
    const [labels, setLabels] = useState([]);
    const [dataChart, setDataChart] = useState([]);
    const [predictedExpo, setPredictedExpo] = useState([]);
    const [predictedArima, setPredictedArima] = useState([]);
    const [MAEExpo, setMAEExpo] = useState(null);
    const [MAPEExpo, setMAPEExpo] = useState(null);
    const [MAEArima, setMAEArima] = useState(null);
    const [MAPEArima, setMAPEArima] = useState(null);
    const [predict, setPredict] = useState([]);
    const years = [
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" },
      ];
    
      // Fungsi untuk generate bulan berdasarkan tahun
      const generateMonths = (year) => {
        const months2024 = [
          { label: "September", value: "09", prediksi: 4 },
          { label: "Oktober", value: "10", prediksi: 8 },
          { label: "November", value: "11", prediksi: 12 },
          { label: "Desember", value: "12", prediksi: 16 },
        ];
    
        const months2025 = [
          { label: "Januari", value: "01", prediksi: 20 },
          { label: "Februari", value: "02", prediksi: 24 },
          { label: "Maret", value: "03", prediksi: 28 },
          { label: "April", value: "04", prediksi: 32 },
          { label: "Mei", value: "05", prediksi: 36 },
        ];
    
        return year === "2024" ? months2024 : months2025;
      };
    
      const [selectedYear, setSelectedYear] = useState(years[0]);
      const [months, setMonths] = useState(generateMonths(years[0].value));
      const [selectedMonth, setSelectedMonth] = useState(months[0]);
      const [prediksi, setPrediksi] = useState(months[0].prediksi);
    
      // Saat tahun berubah
      const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        const newMonths = generateMonths(selectedOption.value);
        setMonths(newMonths);
        setSelectedMonth(newMonths[0]); // Reset bulan ke default pertama
        setPrediksi(newMonths[0].prediksi); // Reset prediksi
      };
    
      // Saat bulan berubah
      const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
        setPrediksi(selectedOption.prediksi);
      };

    useEffect(() => {
        dispatch(resetData());
        dispatch(fetchAll({ page: 1, page_size: 100 }));
    }, [dispatch]);

    const handleSearch = async () => {
        if (product.length < 1) return showDialog("Please select a product");
        if (prediksi === "") return showDialog("Please enter prediction value");

        let adjustedPrediksi = prediksi;
        if (predict === "month") {
            adjustedPrediksi *= 4;  // Pastikan nilai dikalikan 4 sebelum digunakan
        }

        const paramsExpo = {
            alpha: 0.2,
            beta: 0.2,
            gamma: 0.5,
            seasonLength: 7,
            pl: parseInt(adjustedPrediksi),
            product_id: product.toString(),
        };

        const paramsArima = {
            p: 1, d: 0, q: 1, P: 1, D: 0, Q: 1, s: 35,
            pl: parseInt(adjustedPrediksi),
            product_id: product.toString(),
        };

        try {
            const [responseExpo, responseArima] = await Promise.all([
                dispatch(fetchmetodelogiExpo(paramsExpo)),
                dispatch(fetchmetodelogiArima(paramsArima)),
            ]);

            const successExpo = responseExpo.payload?.data?.success;
            const successArima = responseArima.payload?.data?.success;

            if (successExpo && successArima) {
                const dataExpo = responseExpo.payload.data.data;
                const dataArima = responseArima.payload.data.data;

                setLabels(dataExpo.labels);
                setDataChart([
                    {
                        label: "Triple Exponential Smoothing",
                        type: "line",
                        borderColor: "rgba(232, 104, 104, 0.8)",
                        backgroundColor: "rgba(232, 104, 104, 0.5)",
                        borderWidth: 2,
                        fill: false,
                        data: dataExpo.datasets[1].data,
                    },
                    {
                        label: "SARIMA",
                        type: "line",
                        borderColor: "rgba(66, 181, 248, 0.8)",
                        backgroundColor: "rgba(66, 181, 248, 0.5)",
                        borderWidth: 2,
                        fill: false,
                        data: dataArima.datasets[1].data,
                    },
                ]);

                setPredictedExpo(dataExpo.prediction.map((item, index) => ({
                    no: dataExpo.actual.length + index + 1,
                    label: `Week ${dataExpo.actual.length + index + 1} - ${item.toFixed(2)}`,
                })));

                setPredictedArima(dataArima.predicted.map((item, index) => ({
                    no: dataArima.actual.length + index + 1,
                    label: `Week ${dataArima.actual.length + index + 1} - ${item.toFixed(2)}`,
                })));

                setMAEExpo(dataExpo.mean_absolute_error);
                setMAPEExpo(dataExpo.mape.toFixed(2));
                setMAEArima(dataArima.mean_absolute_error);
                setMAPEArima(dataArima.mape.toFixed(2));
            } else {
                showErrorDialog(responseExpo.payload.error || responseArima.payload.error);
            }
        } catch (error) {
            showErrorDialog(error);
        }
    };

    const productOptions = dataProduct.map((e) => ({ value: e.id, label: e.name }));

    // const predictOptions = [
    //     {
    //         label: 'Month',
    //         value: 'month',
    //     },
    //     {
    //         label: 'Week',
    //         value: 'week',
    //     },
    // ]

    const handleChangePredict = (value) => {
        setPredict(value.value);
    };

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Forecasting Results",
        onAfterPrint: () => alert("PDF saved successfully"),
    });

    return loading ? (
        <LayoutSplashScreen />
    ) : (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <Card style={{ backgroundColor: "#fff", border: "none" }}>
                <CardHeader title="Comparison: Triple Exponential Smoothing & SARIMA">
                    <CardHeaderToolbar>
                        <Button className="btn btn-danger" onClick={generatePDF}>
                            Export PDF
                        </Button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <Form className="mb-5">
                        <Form.Group as={Row}>
                            <Col sm={6}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}><b>Prediction Period</b></Form.Label>
                                        <Col sm={9}>
                                            <Row className="g-1">
                                            <Col xs={6}>
                      {/* <Form.Control
                          type="number"
                          min={1}
                          onChange={(e) => setPrediksi(e.target.value)}
                          value={prediksi}
                        /> */}
                      <Select
                        options={months}
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-100 mb-2"
                        placeholder="Select Monthr"
                      />
                    </Col>
                    <Col xs={6}>
                      <Select
                        options={years}
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-100"
                        placeholder="Select Year"
                      // isDisabled={!selectedYear} // Nonaktifkan jika tahun belum dipilih
                      />
                    </Col>
                                            </Row>
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}><b>Product</b></Form.Label>
                                    <Col sm={6}>
                                        <Select options={productOptions} value={getValueOptions(product, productOptions)} onChange={(value) => setProduct(value.value)} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col sm={3}>
                                        <Button className="btn btn-danger" onClick={handleSearch}>Compare</Button>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Group>
                    </Form>

                    <div style={{ height: "650px" }}>
                        <Bar options={{ responsive: true, plugins: { legend: { position: "bottom" }, title: { display: true, text: "Prediction Comparison" } } }} data={{ labels, datasets: dataChart }} />
                    </div>
                    <div style={{ height: "200px" }}>
                        <Row className="mt-4">
                            <Col sm={6}>
                                <div>
                                    <h5><b>Triple Exponential Smoothing </b></h5>
                                    <p><b>MAE: </b>{MAEExpo}</p>
                                    <p><b>MAPE: </b>{MAPEExpo}%</p>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div>
                                    <h5><b>SARIMA </b></h5>
                                    <p><b>MAE: </b>{MAEArima}</p>
                                    <p><b>MAPE: </b>{MAPEArima}%</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </CardBody>

            </Card>
        </div>
    );
};


