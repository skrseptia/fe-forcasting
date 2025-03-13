import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import { Card, CardBody, CardHeader, CardHeaderToolbar } from "../../../_metronic/_partials/controls";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { getValueOptions, showDialog, showErrorDialog } from "../../../utility";
import { fetchAll, selectData } from "../products/productsSlice";
import {
    fetchmetodelogiArima,
    fetchmetodelogiExpo,
    resetData,
    selectLoading,
    selectmetodelogi,
} from "./metologiSlice";

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
    const [startDate, setStartDate] = useState("2024-09-01"); // Default tanggal mulai
    const [endDate, setEndDate] = useState("2024-09-30");   // Default tanggal akhir
    const [prediksi, setPrediksi] = useState(5); // Default prediksi
    const dateMapping = [
        { month: "2024-09", prediksi: 5 },
        { month: "2024-10", prediksi: 9 },
        { month: "2024-11", prediksi: 13 },
        { month: "2024-12", prediksi: 17 },
        { month: "2025-01", prediksi: 21 },
        { month: "2025-02", prediksi: 25 },
        { month: "2025-03", prediksi: 30 },
        { month: "2025-04", prediksi: 34 },
        { month: "2025-05", prediksi: 39 }
    ];
    // Fungsi untuk menghitung prediksi berdasarkan range date
    const calculatePrediksi = (start, end) => {
        // Mendapatkan bulan dari tanggal
        const startMonth = start.substring(0, 7);
        const endMonth = end.substring(0, 7);

        // Jika bulan sama, gunakan prediksi dari mapping
        if (startMonth === endMonth) {
            const mapping = dateMapping.find(m => m.month === startMonth);
            return mapping ? mapping.prediksi : 5;
        } else {
            // Jika beda bulan, hitung prediksi berdasarkan selisih minggu
            // Dapatkan indeks bulan awal dan akhir
            const startIdx = dateMapping.findIndex(m => m.month === startMonth);
            const endIdx = dateMapping.findIndex(m => m.month === endMonth);

            if (startIdx !== -1 && endIdx !== -1) {
                // Dapatkan prediksi akhir (dari bulan akhir)
                return dateMapping[endIdx].prediksi;
            } else {
                return 5; // Default jika tidak ditemukan
            }
        }
    };

    // Handler untuk perubahan tanggal mulai
    const handleStartDateChange = (date) => {
        setStartDate(date);
        // Update prediksi jika endDate sudah ada
        if (endDate) {
            const newPrediksi = calculatePrediksi(date, endDate);
            setPrediksi(newPrediksi);
        }
    };

    // Handler untuk perubahan tanggal akhir
    const handleEndDateChange = (date) => {
        setEndDate(date);
        // Update prediksi jika startDate sudah ada
        if (startDate) {
            const newPrediksi = calculatePrediksi(startDate, date);
            setPrediksi(newPrediksi);
        }
    };

    // Function to format date for display
    const formatDateDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        dispatch(resetData());
        dispatch(fetchAll({ page: 1, page_size: 100 }));
    }, [dispatch]);

    const filterDataByDateRange = (labels, datasets, startDate, endDate) => {
        // Convert string dates to Date objects for comparison
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Extract dates from labels (Format: "1 Jan 2024 - 7 Jan 2024")
        const filteredIndices = labels.reduce((indices, label, index) => {
            try {
                // Handle different possible date formats
                const dateParts = label.split(" - ");
                if (dateParts.length < 2) {
                    // If the format is not what we expect, include the label anyway
                    indices.push(index);
                    return indices;
                }

                // Try to parse the end date of the period (second part after " - ")
                const labelDateStr = dateParts[1].trim();

                // Try to create a date from the string
                let labelDate;

                // Try parsing in format "7 Jan 2024"
                if (labelDateStr.match(/^\d{1,2}\s[A-Za-z]{3}\s\d{4}$/)) {
                    const [day, month, year] = labelDateStr.split(" ");
                    const monthMap = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                    };
                    labelDate = new Date(parseInt(year), monthMap[month], parseInt(day));
                }
                // Try parsing standard ISO format
                else {
                    labelDate = new Date(labelDateStr);
                }

                // If we have a valid date and it's in range, include this index
                if (!isNaN(labelDate.getTime()) && labelDate >= start && labelDate <= end) {
                    indices.push(index);
                }
            } catch (e) {
                console.error("Error parsing date:", e, "for label:", label);
                // In case of errors, include the point anyway
                indices.push(index);
            }

            return indices;
        }, []);

        // Filter labels and datasets
        const filteredLabels = filteredIndices.map(i => labels[i]);
        const filteredDatasets = datasets.map(dataset => {
            // Clone dataset with filtered data
            return {
                ...dataset,
                data: filteredIndices.map(i => dataset.data[i])
            };
        });

        return {
            filteredLabels,
            filteredDatasets
        };
    };


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

                const fullDatasets = [
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
                ]
                const { filteredLabels, filteredDatasets } = filterDataByDateRange(
                    dataExpo.labels,  // Assuming both models have the same labels
                    fullDatasets,
                    startDate,
                    endDate
                );

                // Update state with filtered data
                setLabels(filteredLabels);
                setDataChart(filteredDatasets);

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
                                        <Form.Label column sm={3}>
                                            <b>Rentang Tanggal</b>
                                        </Form.Label>
                                        <Col sm={9}>
                                            <Row className="g-1 mb-2">
                                            <Col xs={6}>
                                                    <Form.Label><small>Tanggal Mulai</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => handleStartDateChange(e.target.value)}
                                                        min="2024-09-01"
                                                        max="2025-05-31"
                                                        className="w-100"
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Form.Label><small>Tanggal Akhir</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => handleEndDateChange(e.target.value)}
                                                        min={startDate}
                                                        max="2025-05-31"
                                                        className="w-100"
                                                    />
                                                </Col>
                                            </Row>
                                            <div className="text-muted small">
                                                <strong>Rentang Tanggal:</strong> {formatDateDisplay(startDate)} s/d {formatDateDisplay(endDate)}<br />
                                            </div>
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


