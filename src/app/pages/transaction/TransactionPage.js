import BootstrapTable from "react-bootstrap-table-next";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Col, Row, Modal } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  resetData,
  selectData,
  fetchAll,
  selectLoading,
  selectPageNo,
  selectPageSize,
  selectTotalRecord,
  addItem,
} from "./transactionSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog, showSuccessDialog } from "../../../utility";
import { TransactionTable } from "./TransactionTable";
import ExcelJS from 'exceljs'


export const TransactionPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectData);
  const loading = useSelector(selectLoading);
  const pageNo = useSelector(selectPageNo);
  const pageSize = useSelector(selectPageSize);
  const totalRecord = useSelector(selectTotalRecord);

  // Filter
  const [transaction, setTransaction] = useState("");
  const [customer, setCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataFile, setDataFile] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);

  const inputRef = useRef();

  const handleButtonClick = () => {
    inputRef.current.click();
  };

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


  useEffect(() => {
    // Reset on first load
    dispatch(resetData());

  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      no_trx: transaction,
      customer: customer,
      start_date: startDate,
      end_date: endDate,
      page: 1,
      page_size: 10,
    };
    try {
      const response = await dispatch(fetchAll(params));
      if (response.payload.data.success === true) {
      } else {
        showErrorDialog(response.payload.error);
      }
    } catch (error) {
      showErrorDialog(error);
    }
  };

  const handleTableChange = async (
    type,
    { page, sizePerPage, sortField, sortOrder, data }
  ) => {
    if (type === "pagination") {
      const params = {
        no_trx: transaction,
        customer: customer,
        start_date: startDate,
        end_date: endDate,
        page: page,
        page_size: sizePerPage,
      };
      try {
        const response = await dispatch(fetchAll(params));
        if (response.payload.data.success === true) {
        } else {
          showErrorDialog(response.payload.error);
        }
      } catch (error) {
        showErrorDialog(error);
      }
    } else {
      let result;
      if (sortOrder === "asc") {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
    }
  };

  const handleImport = async (event) => {
    console.log('awkow')
    const file = event.target.files[0]; // Ambil file yang diunggah

    if (!file) return;

    const fileExtension = file.name.split(".").pop(); // Cek ekstensi file

    if (fileExtension === "xlsx" || fileExtension === "xls") {
      await readExcelFile(file);
    } else {
      showErrorDialog("File format tidak didukung. Harap unggah file Excel");
    }

  }

  const readExcelFile = async (file) => {
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target.result;
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.getWorksheet(1); // Worksheet pertama
      const rows = [];

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) { // Lewati header
          rows.push({
            id: row.getCell(1).value, // Kolom 1 untuk id
            code: row.getCell(2).value, // Kolom 2 untuk code
            name: row.getCell(3).value, // Kolom 3 untuk name
            description: row.getCell(4).value, // Kolom 4 untuk description
            image_url: row.getCell(5).value || "", // Kolom 5 untuk image_url
            qty: row.getCell(6).value, // Kolom 6 untuk qty
            uom: {
              id: row.getCell(7).value, // Kolom 7 untuk uom.id
              name: row.getCell(8).value, // Kolom 8 untuk uom.name
            },
            price: row.getCell(9).value, // Kolom 9 untuk price
            no: row.getCell(10).value, // Kolom 10 untuk no
            maxQty: row.getCell(11).value, // Kolom 11 untuk maxQty
            totalPrice: row.getCell(12).value, // Kolom 12 untuk totalPrice
          });
        }
      });

      setDataFile(rows);

      console.log(rows, 'rows')
      await handleSave(rows);
    };
    console.log(dataFile, 'dataFile')

    reader.readAsArrayBuffer(file);
  };

  const handleSave = async (rows) => {
    const params = {
      customer: 'A',
      transaction_lines: rows.map((item) => {
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

  const handleShowReport = () => {
    setShowReport(true);
  };
  const handleCloseReport = () => {
    setShowReport(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Transaction">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/transaction/create")}
          >
            Create
            </Button>
            <input
              type="file"
              ref={inputRef}
              accept=".xlsx, .xls"
              onChange={handleImport}
              style={{ display: "none" }}
              id="file-input"
            />
          <label htmlFor="file-input">
            <button
                onClick={handleButtonClick}
              className="btn btn-danger ml-2"
            >
              Import
            </button>
          </label>

            {/* <pre>{JSON.stringify(dataFile)}</pre> */}

        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
              {/* <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Transaction</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setTransaction(e.target.value)}
                    value={transaction}
                  />
                </Col>
              </Form.Group> */}
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Start Date</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              {/* <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Customer</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setCustomer(e.target.value)}
                    value={customer}
                  />
                </Col>
              </Form.Group> */}
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>End Date</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                  />
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

        {/* Table */}
        {data && data.length > 0 && (
          <TransactionTable
            data={data}
            page={pageNo}
            sizePerPage={pageSize}
            totalSize={totalRecord}
            onTableChange={handleTableChange}
            loading={loading}
          />
        )}
      </CardBody>

        {report && (
          <Modal show={showReport} onHide={handleCloseReport} size="lg">
            <Modal.Body>
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
    </Card>
  );
};
