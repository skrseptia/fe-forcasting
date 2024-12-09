import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectLoading } from "./transactionSlice";
import { useHistory } from "react-router";
import {
  showSuccessDialog,
  showErrorDialog,
  showDialog,
  formatCurrency,
  useForceUpdate,
} from "../../../utility";
import Select from "react-select";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { fetchAll, selectData } from "../products/productsSlice";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { select } from "redux-saga/effects";
import InputNumber from "../../../utility/InputNumber";

export const TransactionCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);
  const dataItems = useSelector(selectData);
  const forceUpdate = useForceUpdate();
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [tableItems, setTableItems] = useState([]);
  const [data, setData] = useState([]);
  const [report, setReport] = useState(null);
  const { SearchBar } = Search;

  useEffect(() => {
    // Fetch data on first load
    dispatch(
      fetchAll({
        page: 1,
        page_size: 1000,
      })
    );
  }, [dispatch]);
  console.log(dataItems, "dataItems");

  useEffect(() => {
    if (dataItems !== null) {
      const initData = dataItems.map((item, index) => {
        return {
          ...item,
          no: index + 1,
          maxQty: item.qty,
          totalPrice: "",
        };
      });
      setTableItems(initData);
    }
  }, [dataItems]);

  const handleSave = async () => {
    const params = {
      customer: 'A',
      transaction_lines: data.map((item) => {
        return {
          product_id: item.id,
          qty: parseInt(item.qty),
        };
      }),
    };

    console.log(params, "params");
    try {
      const response = await dispatch(addItem(params));
      console.log(response, "response");
      if (response.payload.status === 200) {
        const action = await showSuccessDialog(response.payload.message);
        if (action.isConfirmed) setReport(response.payload.data.data);
        handleShowReport();
      } else {
        showErrorDialog(response.payload.error);
      }
    } catch (error) {
      showErrorDialog(error.message);
      console.log(error.message);
    }
  };

  // Modal customer
  const [show, setShow] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleDelete = (row, rowIndex) => {
    const items = data.filter((item) => item.id !== row.id);
    setData(items);
  };

  // Modal report
  const [showReport, setShowReport] = useState(false);

  const handleCloseReport = () => {
    setShowReport(false);
    history.goBack();
  };
  const handleShowReport = () => {
    setShowReport(true);
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <div>
        <span className="mx-2"></span>
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
        >
          <div
            className="btn btn-icon btn-light btn-hover-danger btn-sm"
            onClick={(e) => handleDelete(row, rowIndex)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </div>
        </OverlayTrigger>
      </div>
    );
  };

  const columnsItems = [
    {
      text: "NO ",
      dataField: "no",
      editable: false,
    },
    {
      text: "code",
      dataField: "code",
      editable: false,
    },
    {
      text: "category",
      dataField: "name",
      editable: false,
    },

    // {
    //   text: "Qty",
    //   dataField: "qty",

    //   style: { minWidth: "110px" },
    // },
  ];

  const columnsReport = [
    {
      text: "code",
      dataField: "code",
      editable: false,
    },
    {
      text: "category",
      dataField: "name",
      editable: false,
    },

    {
      text: "Qty",
      dataField: "qty",

      style: { minWidth: "110px" },
    },
    // {
    //   text: "Sub Total",
    //   dataField: "sub_total",
    //   editable: false,
    //   formatter: formatCurrency,
    // },
  ];

  const handleQty = (e, row, rowIndex, formatExtraData) => {
    console.log(formatExtraData, "test 2");

    if (parseFloat(row.qty) > parseFloat(row.maxQty)) {
      row.qty = row.maxQty;
      forceUpdate();
      return;
    } else if (parseFloat(row.qty) < 0) {
      row.qty = 0;
      forceUpdate();
      return;
    }

    let _totalPrice = row.qty * row.price;
    formatExtraData[rowIndex].totalPrice = _totalPrice;

    setData(formatExtraData);
    forceUpdate();
  };

  const inputValue = (e, row, rowIndex, formatExtraData) => {
    console.log(formatExtraData, "test 2");
    return (
      <input
        type="number"
        step="any"
        className="input-box-table"
        value={parseFloat(row.qty)}
        onBlur={handleQty(e, row, rowIndex, formatExtraData)}
      />
    );
  };

  const columnsData = [
    {
      text: "NO ",
      dataField: "no",
      editable: false,
    },
    {
      text: "code",
      dataField: "code",
      editable: false,
    },
    {
      text: "category",
      dataField: "name",
      editable: false,
    },

    {
      text: "Qty",
      dataField: "qty",
      formatter: inputValue,
      editorRenderer: (editorProps, value) => {
        return <InputNumber {...editorProps} value={value} />;
      },
      style: { minWidth: "110px" },
      formatExtraData: data,
    },
    // {
    //   text: "Price",
    //   dataField: "price",
    //   editable: false,
    //   formatter: formatCurrency,
    // },
    // {
    //   text: "Total Price",
    //   dataField: "totalPrice",
    //   editable: false,
    //   formatter: formatCurrency,
    // },

    // {
    //   text: "Action",
    //   dataField: "action",
    //   editable: false,
    //   formatter: actionFormatter,
    // },
  ];

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectRow = {
    mode: "checkbox",
    // clickToSelect: true,
    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        setSelectedRows(rows);
      } else {
        setSelectedRows([]);
      }
    },
    onSelect: (row, isSelect) => {
      if (isSelect) {
        if (data.filter((e) => e.id === row.id).length > 0) {
          showDialog("Already selected");
          return false;
        }
        setSelectedRows([...selectedRows, row]);
      } else {
        const index = selectedRows.indexOf(row);
        if (index > -1) {
          selectedRows.splice(index, 1);
        }
      }
      return true;
    },
  };

  const handleSubmit = () => {
    setData((data) => [...data, ...selectedRows]);
    setSelectedRows([]);
    handleClose();
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <>
      <Card>
        <CardHeader title="Create  Transaction"></CardHeader>
        <CardBody>
          <Form>
            {/* <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                <b>
                  Customer <b className="color-red">*</b>
                </b>
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setCustomer(e.target.value);
                  }}
                  value={customer}
                />
              </Col>
            </Form.Group> */}

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                <b>
                  Items <b className="color-red">*</b>
                </b>
              </Form.Label>
              <Col sm={3}>
                <Button variant="danger" onClick={handleShow}>
                  Add
                </Button>
              </Col>
            </Form.Group>
          </Form>

          <BootstrapTable
            wrapperClasses="table-responsive"
            classes="table table-head-custom table-vertical-center overflow-hidden mt-7"
            bootstrap4
            bordered={false}
            keyField="id"
            data={data}
            columns={columnsData}
            cellEdit={cellEditFactory({
              mode: "click",
              blurToSave: true,
            })}
          />

          <Button onClick={handleSave}>Save</Button>
        </CardBody>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Body>
          <div
            className="card-body pt-0   "
            style={{
              height: "650px",
              overflowY: "scroll",
            }}
          >
            <ToolkitProvider
              keyField="id"
              data={tableItems}
              columns={columnsItems}
              search
            >
              {(props) => (
                <div>
                  <Row>
                    <Col>
                      <h3> Category</h3>
                    </Col>
                    <Col>
                      <div className="float-right">
                        <SearchBar
                          {...props.searchProps}
                          placeholder="Search .."
                        />
                      </div>
                    </Col>
                  </Row>

                  <hr />
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    bootstrap4
                    bordered={false}
                    selectRow={onSelectRow}
                    // cellEdit={cellEditFactory({
                    //   mode: "click",
                    //   blurToSave: true,
                    // })}
                    {...props.baseProps}
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>

          <Row className="mt-6">
            <Button
              variant="light"
              className="mr-3"
              onClick={() => handleClose()}
            >
              <i className="fa fa-arrow-left"></i>Cancel
            </Button>

            <Button variant="danger" onClick={handleSubmit}>
              Submit
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
      {report && (
        <Modal show={showReport} onHide={handleCloseReport} size="lg">
          <Modal.Body>
            {/* <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>No Transaction</b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control type="text" value={report.trx_id} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>Customer</b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control type="text" value={report.customer} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  <b>Total</b>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="text"
                    value={formatCurrency(report.total)}
                    disabled
                  />
                </Col>
              </Form.Group>
            </Form> */}
            <BootstrapTable
              wrapperClasses="table-responsive"
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bootstrap4
              bordered={false}
              keyField="id"
              data={report.transaction_lines}
              columns={columnsReport}
            />

            <Row className="mt-6">
              <Button
                variant="light"
                className="mr-3"
                onClick={() => handleCloseReport()}
              >
                <i className="fa fa-arrow-left"></i>Close
              </Button>
            </Row>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
