/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {
  sortCaret,
  headerSortingClasses,
  PleaseWaitMessage,
  NoRecordsFoundMessage,
  toAbsoluteUrl,
} from "../../../_metronic/_helpers";
import {
  Doughnut,
  Bar,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
  Line,
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
  PointElement,
  LineElement,
} from "chart.js";
import { InteractionItem } from "chart.js";
import SVG from "react-inlinesvg";
import BootstrapTable from "react-bootstrap-table-next";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { LayoutSplashScreen } from "../../../_metronic/layout";
import { formatCurrency, formatDate, showErrorDialog } from "../../../utility";
import { selectUser } from "../../modules/Auth/_redux/authRedux";
import {
  resetData,
  selectDashboard,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  fetchDashboard,
  fetchChart,
  selectChart,
} from "./dashboardSlice";
export const DashboardPage = ({ className, symbolShape, baseColor }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const data = useSelector(selectDashboard);
  const loading = useSelector(selectLoading);
  const dataChart = useSelector(selectChart);
  // const loading = useSelector(selectLoading);
  // const pageNo = useSelector(selectPageNo);
  // const pageSize = useSelector(selectPageSize);
  // const totalRecord = useSelector(selectTotalRecord);

  console.log(dataChart, "dataChart");
console.log(data,'data')
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement
  );

  const [labels, setLabels] = useState([]);
  const [dataChartDaily, setDataChartDaily] = useState([]);
  const [dataTopTrx, setDataTopTrx] = useState([]);
  const [stock, setStock] = useState([]);

  const [labelsMonthly, setLabelsMonthly] = useState([]);
  const [dataMonthly, setDataMonthly] = useState([]);

  useEffect(() => {
    // Reset on first load
    // dispatch(resetData());

    dispatch(fetchDashboard());
    dispatch(fetchChart());
  }, [dispatch]);

  useEffect(() => {
    if (dataChart !== null) {
      const listLabel = dataChart.daily_trx_amount_chart.labels;

      const listDataDaily =
        dataChart.daily_trx_amount_chart.datasets !== null
          ? dataChart?.daily_trx_amount_chart?.datasets?.map((item) => {
            const red = Math.floor(Math.random() * 256);
            const green = Math.floor(Math.random() * 256);
            const blue = Math.floor(Math.random() * 256);
            const alpha = Math.random();

            return {
              ...item,
              backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
              barThickness: 30,
              categoryPercentage: 1,
              borderRadius: 10,
            };
          })
          : [];

      setLabels(listLabel);
      setDataChartDaily(listDataDaily);

      const listLabelMonthly = dataChart.monthly_trx_amount_chart.labels;
      const listDataMonthly = dataChart?.monthly_trx_amount_chart?.datasets?.map(
        (item) => {
          const red = Math.floor(Math.random() * 256);
          const green = Math.floor(Math.random() * 256);
          const blue = Math.floor(Math.random() * 256);
          const alpha = Math.random();
          return {
            ...item,
            backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
            borderColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
            barThickness: 30,
            categoryPercentage: 1,
            borderRadius: 10,
          };
        }
      );

      setLabelsMonthly(listLabelMonthly);
      setDataMonthly(listDataMonthly);
    }
  }, [dataChart]);

  useEffect(() => {
    if (data !== null) {
      const listTopTrx = data?.top_5_product?.map((item, index) => {
        return {
          ...item,
          total_qty: `${item.total_qty} PCS`,
          no: index + 1,
        };
      });
      const listStock =
        data.stock_alert !== null
          ? data?.stock_alert?.map((item, index) => {
            return {
              ...item,
              no: index + 1,
            };
          })
          : [];

      setDataTopTrx(listTopTrx);
      setStock(listStock);
    }
  }, [data]);

  const columns = [
    {
      text: "No",
      dataField: "no",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "name",
      dataField: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    // {
    //   text: "total",
    //   dataField: "total",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   formatter: formatCurrency,
    // },
    {
      text: "total qty",
      dataField: "total_qty",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
  ];

  const columnsStock = [
    {
      text: "No",
      dataField: "no",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "code",
      dataField: "code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "name",
      dataField: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "qty",
      dataField: "qty",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
  ];

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

  const optionsMonthly = {
    responsive: true,

    plugins: {
      legend: {
        // display: false,
        position: "bottom",
      },
      title: {
        display: true,
        align: "start",
        text: "Monthly",
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

  console.log(labelsMonthly, "labelsMonthly");
  const chart = {
    labels,
    datasets: dataChartDaily,
  };

  const chartMonthly = {
    labels: labelsMonthly,
    datasets: dataMonthly,
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    data && dataChart && (
      <>
        <div className="container  pl-0 pr-0" style={{ marginBottom: "35px" }}>
          {/* header */}
          <div className="row">
            {/* Total Transaction */}
            <div className="col-md-6 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundColor: "#FFFFF",

                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-grey font-size-h2 font-weight-boldest ">
                      Total Transaction
                    </h3>

                    <div className="text-grey font-weight-bolder  display3 mt-3">
                      {data.summary.total_transaction}
                      {/* <div className="row">
                  <div className="col">277</div>
                  <div className="col">
                    <h5>Active</h5>
                  </div>
                </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Total Customer */}
            {/* <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundColor: "#FFFFF",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-grey font-size-h2 font-weight-boldest">
                      Total Customer
                    </h3>

                    <div className="text-grey font-weight-bolder display3 mt-3">
                      {data.summary.total_customer}
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Total Product */}
            {/* <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundColor: "#FFFFF",

                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-grey font-size-h2 font-weight-boldest">
                      Total Product
                    </h3>

                    <div className="text-grey font-weight-bolder display3  mt-3">
                      {data.summary.total_product}
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Total Category*/}
            <div className="col-md-6 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundColor: "#FFFFF",

                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-grey font-size-h2 font-weight-boldest">
                      Total Category
                    </h3>
                    <div className="text-grey font-weight-bolder display3 mt-3">
                      <p> {data.summary.total_category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <CardBody>
            <Row>
              <Col md={6}>
                <div style={{ heigth: "800px" }}>
                  <Bar options={options} data={chart} />
                </div>
              </Col>
              <Col md={6}>
                <div style={{ heigth: "800px" }}>
                  <Line options={optionsMonthly} data={chartMonthly} />{" "}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <div className="container  pl-0 pr-0">
          {/* header */}
          <div className="row">
            {/* active User */}
            {/* <div className="col-md-6 col-xs-12 mb-3 ">
              <div className={`card card-custom ${className}`}> */}
                {/* Head */}
                {/* <div
                  className="card-header border-0"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <h3 className="card-title font-weight-bolder align-items-start text-dark flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                      Stock Limit
                    </span>
                  </h3>
                </div> */}

                {/* Body */}
                {/* <div className="card-body pt-2">
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    bootstrap4
                    bordered={false}
                    keyField="id"
                    data={stock}
                    columns={columnsStock}
                    hover
                  ></BootstrapTable>
                </div> */}
              {/* </div>
            </div> */}
            {/* No active User */}
            <div className="col-md-6 col-xs-12 mb-3 ">
              <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div
                  className="card-header border-0"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <h3 className="card-title font-weight-bolder align-items-start text-dark flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                      TOP 10 Category
                    </span>
                  </h3>
                </div>

                {/* Body */}
                <div className="card-body pt-2">
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    headerClasses="header-dashboard"
                    bootstrap4
                    bordered={false}
                    keyField="trx_id"
                    data={dataTopTrx}
                    columns={columns}
                    hover
                  ></BootstrapTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};
