import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
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
} from "./transactionSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
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
    console.log(file, 'file')
    const fileExtension = file.name.split(".").pop(); // Cek ekstensi file

    if (fileExtension === "xlsx" || fileExtension === "xls") {
      await readExcelFile(file);
    } else if (fileExtension === "csv") {
      await readCSVFile(file);
    } else {
      alert("File format tidak didukung. Harap unggah file Excel atau CSV.");
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

      worksheet.eachRow((row) => {
        rows.push(row.values.slice(1)); // Hapus indeks kosong
      });

      setDataFile(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  const readCSVFile = async (file) => {
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const worksheet = await workbook.csv.load(text);

      const rows = [];
      worksheet.eachRow((row) => {
        rows.push(row.values.slice(1)); // Hapus indeks kosong
      });

      setDataFile(rows);
    };

    reader.readAsText(file);
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
            accept=".xlsx, .xls, .csv"
            onChange={handleImport}
            // style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <button
              className="btn btn-danger ml-2"
            >
              Import
            </button>
          </label>
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
    </Card>
  );
};
