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
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectLoading } from "./transactionSlice";
import { useHistory } from "react-router";
import {
  showSuccessDialog,
  showErrorDialog,
  useForceUpdate,
  formatCurrency,
} from "../../../utility";
import Select from "react-select";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { fetchAll, selectData } from "../products/productsSlice";
import SVG from "react-inlinesvg";
import {
  sortCaret,
  headerSortingClasses,
  PleaseWaitMessage,
  NoRecordsFoundMessage,
  toAbsoluteUrl,
} from "../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import InputNumber from "../../../utility/InputNumber";

export const TransactionCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);
  const dataProduct = useSelector(selectData);
  const forceUpdate = useForceUpdate();

  const [customer, setCustomer] = useState("");
  const [total, setTotal] = useState("");
  const [items, setItems] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [tableDataProduct, setTableDataProduct] = useState([]);


  const handleSave = async () => {
    const details = selectedItems.map((item, index) => {
      return {
        ...item,
        no: index + 1,
        available: item.qty,
        total: 0,
      };
    });
    const params = {
      customer: customer,
      total: 10000,
      items: details,
    };

    console.log(params, "params");
    handleSum();

    return;
    try {
      const response = await dispatch(addItem(params));
      if (response.payload.status === 200) {
        const action = await showSuccessDialog(response.payload.message);
        if (action.isConfirmed) history.goBack();
      } else {
        showErrorDialog(response.payload.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
      console.log(error.message);
    }
  };

  const handleQty = (e, row, rowIndex, formatExtraData) => {
    if (parseFloat(row.qty) > row.available) {
      row.qty = row.available;
      forceUpdate();
      return;
    } else if (row.qty < 0) {
      row.qty = 0;
      forceUpdate();
      return;
    } else {
      const total = parseInt(row.price) * parseInt(row.qty);

    }
  };

  // const handleTotalPrice = (e, row, rowIndex, formatExtraData) => {
  //   if (row.price < 0) {
  //     row.price = 0;
  //     row.total = 0;
  //   } else if (row.price === undefined) {
  //     row.price = 0;
  //   }

  //   const total = parseInt(row.price) * parseInt(row.total);

  //   const data = [...formatExtraData];
  //   const dataIndex = { ...data[rowIndex] };

  //   dataIndex.total = total;

  //   data[rowIndex] = dataIndex;

  //   const totalPrice = data.map((e) => e.total);

  //   const sum = totalPrice.reduce((accumulator, value) => {
  //     return accumulator + value;
  //   }, 0);

  //   dataIndex.total_all_price = sum;
  //   data[rowIndex] = dataIndex;

  //   setTotalAllPrice(sum);
  //   console.log(data, "data");

  //   setDetails(data);
  // };

  const inputQty = (e, row, rowIndex, formatExtraData) => {
    console.log(e, "row");
    console.log(row, "row");
    console.log(rowIndex, "rowIndex");
    console.log(formatExtraData, "formatExtraData");

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

  const handleSum = () => {
    const dataTotal = selectedItems.map((e) => e.qty * e.price);
    const sum =
      selectedItems.length > 0
        ? dataTotal.reduce((item, value) => item + value)
        : 0;

    console.log(sum, "sum total al");
  };

  const columnsProduct = [
    {
      text: "no",
      dataField: "no",
      sort: true,
      style: { minWidth: "40px" },
    },

    {
      text: "name",
      dataField: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "uom",
      dataField: "uom",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "qty",
      dataField: "qty",
      formatExtraData: selectedItems,

      formatter: inputQty,
      editorRenderer: (editorProps, value) => {
        return <InputNumber {...editorProps} value={value} />;
      },
      style: { minWidth: "110px" },
    },
    {
      text: "price",
      dataField: "price",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatCurrency,
    },
    {
      text: "total",
      dataField: "total",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatCurrency,
    },
  ];

  const columnsProductList = [
    {
      text: "no",
      dataField: "no",
      sort: true,
      style: { minWidth: "40px" },
    },

    {
      text: "name",
      dataField: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "uom",
      dataField: "uom",
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
      formatExtraData: tableDataProduct,

      formatter: inputQty,
      editorRenderer: (editorProps, value) => {
        return <InputNumber {...editorProps} value={value} />;
      },
      style: { minWidth: "110px" },
    },
    {
      text: "price",
      dataField: "price",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
  ];

  // add items

  const [show, setShow] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  console.log(selectedItems, "selectedItems");

  const handleClose = () => {
    setCode("");
    setName("");
    setTableDataProduct([]);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Add number
    const initData = dataProduct.map((item, index) => {
      return {
        ...item,
        no: index + 1,
        available: item.qty,
        total: item.price * item.qty,
      };
    });
    setTableDataProduct(initData);
  }, [dataProduct]);

  const handleSearchProduct = async () => {
    const params = {
      code: code,
      name: name,
    };
    try {
      const response = await dispatch(fetchAll(params));
      if (response.payload.data.success === true) {
      } else {
        showErrorDialog(response.payload.data.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  const onSelectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        setSelectedRows(rows);
      } else {
        setSelectedRows([]);
      }
    },
    onSelect: (row, isSelect) => {
      if (isSelect) {
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
    // Validation
    const result = selectedRows.filter(
      (elem) => !selectedItems.find(({ id }) => elem.id === id)
    );
    setSelectedItems((selectedItems) => [...selectedItems, ...result]);
    forceUpdate();
    setSelectedRows([]);
    handleClose();
  };

  const handleDelete = (e, row, rowIndex, formatExtraData) => {
    const idColumn = row.id;
    const temp = [...formatExtraData];
    let items = temp.filter((value, index) => value.id !== idColumn);
    setSelectedItems(items);
  };

  const actionFormatter = (e, row, rowIndex, formatExtraData) => {
    return (
      <div>
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
        >
          <div
            className="btn btn-icon btn-light btn-hover-danger btn-sm"
            onClick={(e) => handleDelete(e, row, rowIndex, formatExtraData)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </div>
        </OverlayTrigger>
      </div>
    );
  };

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <>
      <Card>
        <CardHeader title="Create Transaction"></CardHeader>
        <CardBody>
          <Form>
            <Form.Group as={Row} className="mb-3">
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
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                <b>
                  Total <b className="color-red">*</b>
                </b>
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setTotal(e.target.value);
                  }}
                  value={total}
                  disabled
                />
              </Col>
            </Form.Group>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Products">
          <CardHeaderToolbar>
            <CardHeaderToolbar>
              <Button className="btn btn-dark" onClick={() => handleShow()}>
                Add Product
              </Button>
            </CardHeaderToolbar>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {/* <div
            className="card-body pt-0   "
            style={{
              height: "400px",
              overflowY: "scroll",
            }}
          >
          </div> */}
          <BootstrapTable
            wrapperClasses="table-responsive"
            classes="table table-head-custom table-vertical-center overflow-hidden"
            bootstrap4
            bordered={false}
            keyField="id"
            data={selectedItems}
            columns={columnsProduct}
            className="mt-8"
            cellEdit={cellEditFactory({
              mode: "click",
              blurToSave: true,
            })}
          />

          <Row className="mt-6">
            <Button
              variant="light"
              className="mr-3"
              onClick={() => history.goBack()}
            >
              <i className="fa fa-arrow-left"></i>Back
            </Button>

            <Button variant="danger" onClick={handleSave}>
              Save
            </Button>
          </Row>
        </CardBody>
      </Card>

      {/*  */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Products Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Col sm={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={4}>
                    <b>Code</b>
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      value={code}
                      required
                      type="text"
                    />
                  </Col>
                </Form.Group>
              </Col>
              {/* Right Row */}
              <Col sm={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={4}>
                    <b>Name</b>
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      value={name}
                      required
                      type="text"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Form.Group>

            <Button
              className="mb-5"
              variant="secondary"
              onClick={handleSearchProduct}
            >
              Search
            </Button>
          </Form>
          {tableDataProduct.length > 0 && (
            <div
              className="card-body pt-0   "
              style={{
                height: "400px",
                overflowY: "scroll",
              }}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="id"
                data={tableDataProduct}
                columns={columnsProductList}
                selectRow={onSelectRow}
                cellEdit={cellEditFactory({
                  mode: "click",
                  blurToSave: true,
                })}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
