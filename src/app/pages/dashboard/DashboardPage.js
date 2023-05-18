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
} from "./dashboardSlice";
export const DashboardPage = ({ className, symbolShape, baseColor }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const data = useSelector(selectDashboard);
  const loading = useSelector(selectLoading);
  // const data = useSelector(selectDashboard);
  // const loading = useSelector(selectLoading);
  // const pageNo = useSelector(selectPageNo);
  // const pageSize = useSelector(selectPageSize);
  // const totalRecord = useSelector(selectTotalRecord);

  console.log(data, "data");

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );

  const [labels, setLabels] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [dataTopTrx, setDataTopTrx] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    // Reset on first load
    // dispatch(resetData());

    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (data !== null) {
      const listLabel = data.monthly_trx_chart.map((item) => item.month);
      const listData = data.monthly_trx_chart.map((item) => item.amount);
      const listTopTrx = data.top_10_trx.map((item, index) => {
        return {
          ...item,
          no: index + 1,
        };
      });
      const listStock = data.stock_alert.map((item, index) => {
        return {
          ...item,
          no: index + 1,
        };
      });

      console.log(listStock, "listStock");
      console.log(listTopTrx, "listTopTrx");
      setLabels(listLabel);
      setDataChart(listData);
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
      text: "Customer",
      dataField: "customer",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "total",
      dataField: "total",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatCurrency,
    },
    {
      text: "transaction date",
      dataField: "trx_date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatDate,
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
        text: "Transaction",
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
        label: "Monthly Transaksi",
        data: dataChart,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
    ],
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    data && (
      <>
        <div className="container  pl-0 pr-0" style={{ marginBottom: "35px" }}>
          {/* header */}
          <div className="row">
            {/* Total Transaction */}
            <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/bg/cardBlack.png"
                  )})`,
                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-white font-size-h2 font-weight-boldest ">
                      Total Transaction
                    </h3>

                    <div className="text-white font-weight-bolder  display3 mt-3">
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
            <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/bg/cardOrange.png"
                  )})`,
                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-white font-size-h2 font-weight-boldest">
                      Total Customer
                    </h3>

                    <div className="text-white font-weight-bolder display3 mt-3">
                      {data.summary.total_customer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Total Product */}
            <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/bg/cardBlack.png"
                  )})`,
                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-white font-size-h2 font-weight-boldest">
                      Total Product
                    </h3>

                    <div className="text-white font-weight-bolder display3  mt-3">
                      {data.summary.total_product}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Total Category*/}
            <div className="col-md-3 col-xs-12 mb-3 ">
              <div
                className={`card card-custom p-0 m-0 `}
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/bg/cardOrange.png"
                  )})`,
                  backgroundSize: "cover",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body p-0 m-0 ">
                  <div className="card-body">
                    <h3 className="title text-white font-size-h2 font-weight-boldest">
                      Total Category
                    </h3>
                    <div className="text-white font-weight-bolder display3 mt-3">
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
            <div style={{ heigth: "800px" }}>
              <Bar options={options} data={chart} />
            </div>
          </CardBody>
        </Card>

        <div className="container  pl-0 pr-0">
          {/* header */}
          <div className="row">
            {/* active User */}
            <div className="col-md-6 col-xs-12 mb-3 ">
              <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div
                  className="card-header border-0"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <h3 className="card-title font-weight-bolder align-items-start text-dark flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                      Stock Limit
                    </span>
                  </h3>
                </div>

                {/* Body */}
                <div className="card-body pt-2">
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
                </div>
              </div>
            </div>
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
                      TOP 10 Transaction
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
