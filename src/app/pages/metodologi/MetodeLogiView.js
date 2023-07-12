import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { LayoutSplashScreen } from "../../../_metronic/layout";
import { getValueOptions, showDialog, showErrorDialog } from "../../../utility";
import {
  fetchmetodelogi,
  fetchmetodelogiTable,
  resetData,
  selectLoading,
  selectmetodelogi,
  selectmetodelogiTable,
} from "./metologiSlice";

import { fetchAll, selectData } from "../products/productsSlice";
import Select from "react-select";
import MultiSelectAll from "../../../utility/MultiSelectAll";
import BootstrapTable from "react-bootstrap-table-next";
import { useReactToPrint } from "react-to-print";

export const MetodeLogiView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectmetodelogiTable);
  const loading = useSelector(selectLoading);
  const dataProduct = useSelector(selectData);

  // Filter
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-05-31");
  const [product, setProduct] = useState([]);

  const [listQty, setListQty] = useState(null);
  const [listPredictions, setListPredictions] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const conponentPDF = useRef();

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

  useEffect(() => {
    // Add number
    const initData = data.map((item, index) => {
      return {
        ...item,
        no: index + 1,
      };
    });
    setTableData(initData);
  }, [data]);

  const handleSearch = async () => {
    if (startDate === "") {
      return showDialog("Please Input Date");
    }
    if (endDate === "") {
      return showDialog("Please Input Date");
    }
    if (product.length < 1) {
      return showDialog("Please Input product");
    }
    const params = {
      start_date: startDate,
      end_date: endDate,
      product_id: product.toString(),
    };

    console.log(params, "params");
    try {
      const response = await dispatch(fetchmetodelogiTable(params));
      console.log(response, "response");
      if (response.payload.data.success === true) {
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
        selectedOptions.map(function(selectedOption) {
          if (selectedOption) {
            return selectedOption.value;
          }
        })
      );
    } else {
      setProduct([]);
    }
  };

  const columns = [
    { text: "No", dataField: "no" },
    { text: "Name", dataField: "name" },
    { text: "uom", dataField: "uom" },
    { text: "period", dataField: "period" },
    { text: "actual", dataField: "actual" },
    { text: "forecast", dataField: "forecast" },
    { text: "formulation", dataField: "formulation" },
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
      <CardHeader title="Prediksi Exponential Smoothing Report">
        <CardHeaderToolbar>
          {data.length > 0 && (
            <Button className="btn btn-danger" onClick={generatePDF}>
              PDF
            </Button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* Filter */}
        <Form className="mb-5">
          <Form.Group as={Row}>
            <Col sm={6}>
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
                <Form.Label column sm={3}>
                  <b>Product Name</b>
                </Form.Label>
                <Col sm={6}>
                  <MultiSelectAll
                    options={productOptions}
                    value={getValueProduct(product)}
                    onChange={handleProductChange}
                    placeholder="Select"
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

        {data && data.length > 0 && (
          <>
            <div ref={conponentPDF}>
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="id"
                data={tableData}
                columns={columns}
                hover
              ></BootstrapTable>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
