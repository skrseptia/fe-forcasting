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
import { formatCurrency, showErrorDialog } from "../../../utility";
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
  // const data = useSelector(selectDashboard);
  // const loading = useSelector(selectLoading);
  // const pageNo = useSelector(selectPageNo);
  // const pageSize = useSelector(selectPageSize);
  // const totalRecord = useSelector(selectTotalRecord);

  console.log(user, "user");

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );

  useEffect(() => {
    // Reset on first load
    // dispatch(resetData());

    dispatch(fetchDashboard());
  }, [dispatch]);

  // map permision
  // const role = user.roles;

  // const checkRoles = (userRoles, allowedRoles) => {
  //   return userRoles.some((e) => allowedRoles.includes(e));
  // };

  const optionsTransaction = {
    onClick: (event, elements) => {
      if (elements[0].datasetIndex === 0 && elements[0].index === 0) {
        console.log("jalan");
      } else if (elements[0].datasetIndex === 0 && elements[0].index === 1) {
        console.log("jalan ke 2");
      }
    },
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
          size: 20,
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

  const optionsApproval = {
    onClick: (event, elements) => {
      if (elements[0].datasetIndex === 0 && elements[0].index === 0) {
        console.log("jalan");
      } else if (elements[0].datasetIndex === 0 && elements[0].index === 1) {
        console.log("jalan ke 2");
      }
    },
    responsive: true,

    plugins: {
      legend: {
        // display: false,
        position: "bottom",
      },
      title: {
        display: true,
        align: "start",
        text: "Required Approvals",
        font: {
          size: 20,
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
      heigth: 800,
    },
  };

  const optionsUsers = {
    onClick: async (event, elements) => {
      if (elements[0].datasetIndex === 0 && elements[0].index === 0) {
        await history.push("/administration/master-user/user");
      } else if (elements[0].datasetIndex === 0 && elements[0].index === 1) {
        await history.push("/administration/master-user/user");
      }
    },
    responsive: true,

    plugins: {
      legend: {
        // display: false,
        position: "top",
      },
      title: {
        display: true,
        align: "start",
        text: "Users",
        font: {
          size: 20,
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
  const optionsVendors = {
    responsive: true,

    plugins: {
      legend: {
        // display: false,
        position: "top",
      },
      title: {
        display: true,
        align: "start",
        text: "Vendors",
        font: {
          size: 20,
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

  const [dashUser, setDashUser] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [dashVendor, setDashVendor] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [dashApproval, setDashApproval] = useState({
    labels: ["Complete", "Open"],
    datasets: [
      {
        label: "PO",
        data: [],
        backgroundColor: "rgb(29,112,114)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
      {
        label: "Invoice",
        data: [],
        backgroundColor: "rgb(29,150,114)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
    ],
  });
  const [dashTransaction, setDashTransaction] = useState({
    labels: ["Complete", "Open"],
    datasets: [
      {
        label: "PO",
        data: [],
        backgroundColor: "rgb(29,112,114)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
      {
        label: "GR",
        data: [],
        backgroundColor: "rgb(29,150,114)",
        barThickness: 40,
        categoryPercentage: 1,
        borderRadius: 10,
      },
    ],
  });

  const [dashAppLabel, setDashAppLabel] = useState([]);
  const [dashApprovalPo, setDashApprovalPo] = useState([]);
  const [dashApprovalInv, setDashApprovalInv] = useState([]);
  const [dashTransPo, setDashTransPo] = useState([]);
  const [dashTransGr, setDashTransGr] = useState([]);
  const [dashTransPayment, setDashTransPayment] = useState([]);

  useEffect(() => {
    setDashApproval({
      labels: ["Complete", "Open"],
      datasets: [
        {
          label: "PO",
          data: dashApprovalPo,
          backgroundColor: "#292D30",
          barThickness: 40,
          categoryPercentage: 1,
        },
        {
          label: "Invoice",
          data: dashApprovalInv,
          backgroundColor: "#F48021",
          barThickness: 40,
          categoryPercentage: 1,
        },
      ],
    });
  }, [dashApprovalInv]);

  useEffect(() => {
    setDashTransaction({
      labels: ["Complete", "Open"],
      datasets: [
        {
          label: "PO",
          data: dashTransPo,
          backgroundColor: "#292D30",
          barThickness: 40,
          categoryPercentage: 1,
        },
        {
          label: "GR",
          data: dashTransGr,
          backgroundColor: "#F48021",
          barThickness: 40,
          categoryPercentage: 1,
        },
        {
          label: "Payment",
          data: dashTransPayment,
          backgroundColor: "#5265E5",
          barThickness: 40,
          categoryPercentage: 1,
        },
      ],
    });
  }, [dashTransGr]);

  // useEffect(() => {
  //   if (data !== null) {
  //     data.forEach((e) => {
  //       if (e.label === "Users" && e.type === "Users") {
  //         // Dashboard User
  //         const obj = e.data;
  //         const listLabel = obj.map((e) => e.label);
  //         const listValue = obj.map((e) => e.value);

  //         setDashUser({
  //           labels: listLabel,
  //           datasets: [
  //             {
  //               label: e.label,
  //               data: listValue,
  //               backgroundColor: [
  //                 "rgba(255, 99, 132, 0.2)",
  //                 "rgba(54, 162, 235, 0.2)",
  //               ],
  //               borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
  //               borderWidth: 1,
  //             },
  //           ],
  //         });
  //       } else if (e.label === "Vendors" && e.type === "Vendors") {
  //         // Dashboard Vendor
  //         const obj = e.data;
  //         const listLabel = obj.map((e) => e.label);
  //         const listValue = obj.map((e) => e.value);

  //         setDashVendor({
  //           labels: listLabel,
  //           datasets: [
  //             {
  //               label: e.label,
  //               data: listValue,
  //               backgroundColor: [
  //                 "rgba(255, 99, 132, 0.2)",
  //                 "rgba(54, 162, 235, 0.2)",
  //               ],
  //               borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
  //               borderWidth: 1,
  //             },
  //           ],
  //         });
  //       } else if (
  //         e.label === "Required Approvals/Confirmation" &&
  //         e.type === "PO"
  //       ) {
  //         // Dashboard App PO
  //         const obj = e.data;
  //         const listValue = obj.map((e) => e.value);
  //         setDashApprovalPo(listValue);
  //       } else if (
  //         e.label === "Required Approvals/Confirmation" &&
  //         e.type === "Invoice"
  //       ) {
  //         // Dashboard App PO
  //         const obj = e.data;
  //         const listValue = obj.map((e) => e.value);
  //         setDashApprovalInv(listValue);
  //       } else if (e.label === "Transaction" && e.type === "PO") {
  //         // Transaction PO
  //         const obj = e.data;
  //         const listValue = obj.map((e) => e.value);
  //         setDashTransPo(listValue);
  //       } else if (e.label === "Transaction" && e.type === "GR") {
  //         // Transaction GR
  //         const obj = e.data;
  //         const listValue = obj.map((e) => e.value);
  //         setDashTransGr(listValue);
  //       } else if (e.label === "Transaction" && e.type === "PAYMENT") {
  //         // Transaction GR
  //         const obj = e.data;
  //         const listValue = obj.map((e) => e.value);
  //         setDashTransPayment(listValue);
  //       }
  //     });
  //   }
  // }, [data]);

  const columns = [
    {
      text: "No",
      dataField: "no",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "Name",
      dataField: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "Quantity",
      dataField: "qty",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "Amount",
      dataField: "amount",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatCurrency,
      style: { color: "#63B113" },
    },
  ];

  const dataTopPo = [
    {
      no: 1,
      name: "AISIN INDONESIA",
      qty: "100",
      amount: "80000",
    },
    {
      no: 2,
      name: "AISIN INDONESIA",
      qty: "100",
      amount: "80000",
    },
    {
      no: 3,
      name: "Hilek Indonesia",
      qty: "100",
      amount: "80000",
    },
    {
      no: 4,
      name: "FEDERAL INDONESIA",
      qty: "100",
      amount: "80000",
    },
  ];

  return (
    <>
      <div className="container  pl-0 pr-0" style={{ marginBottom: "35px" }}>
        {/* header */}
        <div className="row">
          {/* active User */}
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
                    Active User
                  </h3>
                  <div className="text-white font-weight-bolder display3 mt-3">
                    <p>277</p>
                  </div>
                  <h5 className="mt-3 mb-0 text-white">
                    <img
                      src={toAbsoluteUrl(`/media/logos/up.png`)}
                      className="mr-1"
                    />
                    10 % from From Last Month
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* No active User */}
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
                    No Active User
                  </h3>

                  <div className="text-white font-weight-bolder  display3 mt-3">
                    277
                    {/* <div className="row">
                      <div className="col">277</div>
                      <div className="col">
                        <h5>Active</h5>
                      </div>
                    </div> */}
                  </div>
                  <h5 className="mt-3 mb-0 text-white">
                    <img
                      src={toAbsoluteUrl(`/media/logos/up.png`)}
                      className="mr-1"
                    />
                    10 % from From Last Month
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* Active Vendor */}
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
                    Active Vendor
                  </h3>

                  <div className="text-white font-weight-bolder display3 mt-3">
                    50
                    {/* <div className="row">
                      <div className="col">277</div>
                      <div className="col">
                        <h5>Active</h5>
                      </div>
                    </div> */}
                  </div>
                  <h5 className="mt-3 mb-0 text-white">
                    {" "}
                    <img
                      src={toAbsoluteUrl(`/media/logos/up.png`)}
                      className="mr-1"
                    />
                    10 % from From Last Month
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* Non Active vendor */}
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
                    No Active Vendor
                  </h3>

                  <div className="text-white font-weight-bolder display3  mt-3">
                    50
                  </div>
                  <h5 className="mt-3 mb-0 text-white">
                    <img
                      src={toAbsoluteUrl(`/media/logos/down.png`)}
                      className="mr-1"
                    />
                    10 % from From Last Month
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card>
        <CardBody>
          <div style={{ heigth: "800px" }}>
            <div className="card-header border-0">
              <p className="text-dash-candle m-5">
                Required Approval & Transaction
              </p>
              <br />
            </div>
            <p className="text-dash-head mt-3">
              as of 25 Desember 2022, 09:41 PM
            </p>
            <br />
            <Row>
              <Col sm={4} xs={12}>
                <Bar
                  height="226px"
                  width="200px"
                  options={optionsApproval}
                  data={dashApproval}
                />
              </Col>
              <Col sm={4} xs={12}>
                <Bar
                  height="226px"
                  width="200px"
                  options={optionsTransaction}
                  data={dashTransaction}
                />
              </Col>
              <Col sm={4} xs={12}>
                <div className="card-spacer bg-white card-rounded flex-grow-1">
                  {/* begin::Row */}

                  <div className="col">
                    <div className="font-weight-bold">
                      <p className="text-center text-muted">Reject</p>
                    </div>
                    <div className="font-size-h2 text-center font-weight-boldest">
                      449
                    </div>
                  </div>
                  <hr />
                  <div className="col align-items-center">
                    <div className=" font-weight-bold">
                      <p className="text-center text-muted">
                        Outstanding payment
                      </p>
                    </div>
                    <div className="font-size-h2 font-weight-boldest text-center">
                      426
                    </div>
                  </div>
                  <hr />
                  <div className="col">
                    <div className="font-weight-bold">
                      <p className="text-center text-muted">
                        Outstanding shipping
                      </p>
                    </div>
                    <div className="font-size-h2 font-weight-boldest text-center">
                      40
                    </div>
                  </div>
                  <hr />
                  <div className="col">
                    <div className=" font-weight-bold">
                      <p className="text-center text-muted">
                        Outstanding invoice
                      </p>
                    </div>
                    <div className="font-size-h2 font-weight-boldest text-center">
                      1h 8m
                    </div>
                  </div>
                  <hr />
                </div>
              </Col>
            </Row>
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
                    TOP 10 Vendor PO
                  </span>
                  <span className="text-muted mt-3 font-weight-bold font-size-sm">
                    This Month
                  </span>
                </h3>
                <div className="card-toolbar">
                  <a
                    href="#"
                    className=" font-weight-bolder font-size-sm mr-3"
                    style={{ color: "#3751FF" }}
                  >
                    View All
                  </a>
                </div>
              </div>

              {/* Body */}
              <div className="card-body pt-2">
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bootstrap4
                  bordered={false}
                  keyField="no"
                  data={dataTopPo}
                  columns={columns}
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
                    TOP 10 Vendor Invoice
                  </span>
                  <span className="text-muted mt-3 font-weight-bold font-size-sm">
                    This Month
                  </span>
                </h3>

                <div className="card-toolbar">
                  <a
                    href="#"
                    className=" font-weight-bolder font-size-sm mr-3"
                    style={{ color: "#3751FF" }}
                  >
                    View All
                  </a>
                </div>
              </div>

              {/* Body */}
              <div className="card-body pt-2">
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  headerClasses="header-dashboard"
                  bootstrap4
                  bordered={false}
                  keyField="no"
                  data={dataTopPo}
                  columns={columns}
                  hover
                ></BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
