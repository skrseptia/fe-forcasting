import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { LayoutSplashScreen } from "../../../_metronic/layout";
import { getValueOptions, showDialog, showErrorDialog } from "../../../utility";
import {
  fetchmetodelogiExpo,
  resetData,
  selectLoading,
  selectmetodelogi
} from "./metologiSlice";

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
  Tooltip
} from "chart.js";
import BootstrapTable from "react-bootstrap-table-next";
import {
  Bar
} from "react-chartjs-2";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import { fetchAll, selectData } from "../products/productsSlice";

export const MetodelogiPage = () => {
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
  // const [prediksi, setPrediksi] = useState(4);
  const [product, setProduct] = useState([]);
  const [startDate, setStartDate] = useState("2024-09-01"); // Default tanggal mulai
  const [endDate, setEndDate] = useState("2024-09-30");   // Default tanggal akhir
  const [prediksi, setPrediksi] = useState(5); // Default prediksi

  const [labels, setLabels] = useState([]);
  const [dataChartDaily, setDataChartDaily] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const [predicted, setPredicted] = useState([]);
  const [table, setTable] = useState([]);
  const [MAE, setMAE] = useState(null);
  const [MSE, setMSE] = useState(null);
  const [MAPE, setMAPE] = useState(null);
  const [showParams, setShowParams] = useState(false);

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

  const filterDataByDateRange = (data, labels, startDate, endDate) => {
    // Convert string dates to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Extract dates from labels (Format: "1 Jan 2024 - 7 Jan 2024")
    const filteredIndices = labels.reduce((indices, label, index) => {
      // Extract the end date from the label (after the " - ")
      const labelEndDate = label.split(" - ")[1];
      // Parse the date (day month year format)
      const [day, month, year] = labelEndDate.split(" ");
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const labelDate = new Date(parseInt(year), monthMap[month], parseInt(day));

      // Check if this label's date falls within our range
      if (labelDate >= start && labelDate <= end) {
        indices.push(index);
      }
      return indices;
    }, []);

    // Filter labels and datasets
    const filteredLabels = filteredIndices.map(i => labels[i]);
    const filteredDatasets = data.map(dataset => {
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
    if (product.length < 1) {
      return showDialog("Please Input product");
    }
    if (prediksi === "") {
      return showDialog("Please Input product");
    }
    let adjustedPrediksi = prediksi;

    const params = {
      alpha: 0.2,
      beta: 0.2,
      gamma: 0.5,
      seasonLength: 7,
      pl: parseInt(adjustedPrediksi),
      product_id: product.toString(),
    };

    console.log(params, "params");
    try {
      const response = await dispatch(fetchmetodelogiExpo(params));
      console.log(response, "response");
      if (response.payload.data.success === true) {
        setForecastData({});
        const dataChart = response.payload.data.data;

        const listLabel = dataChart.labels;

        const listDataDaily =
          dataChart.datasets !== null
            ? dataChart.datasets.map((item, index) => {
              const colors = [
                { borderColor: "rgba(232, 104, 104, 0.8)", backgroundColor: "rgba(232, 104, 104, 0.8)" }, // Merah
                { borderColor: "rgba(66, 181, 248, 0.8)", backgroundColor: "rgba(66, 181, 248, 0.8)" }, // Biru
              ];
              const color = colors[index % colors.length];
              return {
                type: "line",
                borderColor: color.borderColor,
                backgroundColor: color.backgroundColor,
                borderWidth: 2,
                fill: false,
                ...item,
              };
            })
            : [];

        console.log({ dataChart })
        // Filter data based on selected date range
        const { filteredLabels, filteredDatasets } = filterDataByDateRange(
          listDataDaily,
          listLabel,
          startDate,
          endDate
        );

        // setFormulationData(filteredData);
        setLabels(filteredLabels);
        setDataChartDaily(filteredDatasets);

        // new

        const nilai = filteredDatasets[1]?.data || [];

        const hasil = filteredLabels.map((week, index) => ({
          no: index + 1,
          week,
          value: nilai[index],
        }));

        console.log(nilai, "nilai");
        console.log(listLabel, "listLabel");


        console.log(hasil, "hasil");

        const dataActual = dataChart.actual;

        const indexDataActual = dataActual.length;

        const hasilPrediksi = dataChart.prediction;

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
        console.log({ listLabel })
        console.log({ listDataDaily })
        setTable(hasil);
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
      <CardHeader title="Prediksi Triple Exponential Smoothing">
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


          <div className="mb-3">
            <Button onClick={toggleParams} className="btn btn-danger">
              {showParams ? "Tutup" : "Cek Param Prediksi"}
            </Button>
          </div>



          {showParams && (
           <div>
           <h3>----------------------------------</h3>
           <h3>Dengan Parameter : </h3>
           <h3>Alpha (0.2) → Model memberikan bobot lebih pada data sebelumnya daripada yang terbaru.</h3>
           <h3>Beta (0.2) → Tren berubah secara bertahap dan tidak terlalu cepat.</h3>
           <h3>Gamma (0.5 atau 0.51) → Pola musiman diperbarui dengan 50% data terbaru dan 50% pola sebelumnya.</h3>
           <h3>seasonLength = 7 → Model memperkirakan pola berulang setiap 7 hari.</h3>
           <h3>----------------------------------</h3>
         </div>
         
          )}


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
