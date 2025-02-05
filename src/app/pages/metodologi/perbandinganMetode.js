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

    const [prediksi, setPrediksi] = useState(4);
    const [product, setProduct] = useState([]);
    const [labels, setLabels] = useState([]);
    const [dataChart, setDataChart] = useState([]);
    const [predictedExpo, setPredictedExpo] = useState([]);
    const [predictedArima, setPredictedArima] = useState([]);
    const [MAEExpo, setMAEExpo] = useState(null);
    const [MAPEExpo, setMAPEExpo] = useState(null);
    const [MAEArima, setMAEArima] = useState(null);
    const [MAPEArima, setMAPEArima] = useState(null);

    useEffect(() => {
        dispatch(resetData());
        dispatch(fetchAll({ page: 1, page_size: 100 }));
    }, [dispatch]);

    const handleSearch = async () => {
        if (product.length < 1) return showDialog("Please select a product");
        if (prediksi === "") return showDialog("Please enter prediction value");

        const paramsExpo = {
            alpha: 0.2,
            beta: 0.2,
            gamma: 0.5,
            seasonLength: 7,
            pl: parseInt(prediksi),
            product_id: product.toString(),
        };

        const paramsArima = {
            p: 1, d: 0, q: 1, P: 1, D: 0, Q: 1, s: 35,
            pl: parseInt(prediksi),
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
                                    <Col sm={6}>
                                        <Form.Control type="number" min={1} onChange={(e) => setPrediksi(e.target.value)} value={prediksi} />
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


