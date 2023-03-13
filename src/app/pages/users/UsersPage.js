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
  selectUsers,
  fetchUsers,
  selectLoading,
} from "./usersSlice";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { showErrorDialog } from "../../../utility";
import { UsersTable } from "./UsersTable";

export const UsersPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector(selectUsers);
  const loading = useSelector(selectLoading);

  console.log(data, "data");

  // Filter
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Reset on first load
    dispatch(resetData());
  }, [dispatch]);

  const handleSearch = async () => {
    const params = {
      fullname: fullname,
      email: email,
    };
    try {
      const response = await dispatch(fetchUsers(params));
      if (response.payload.data.status === 200) {
      } else {
        showErrorDialog(response.payload.data.message);
      }
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  // const handleTableChange = async (
  //   type,
  //   { page, sizePerPage, sortField, sortOrder, data }
  // ) => {
  //   if (type === "pagination") {
  //     const params = {
  //       wdd: request,
  //       pageNo: page,
  //       pageSize: sizePerPage,
  //     };
  //     try {
  //       const response = await dispatch(fetchApprovalPo(params));
  //       if (response.payload.data.status === 200) {
  //         setOverlayLoading(false);
  //       } else if (
  //         response.payload.data.error === "10008" ||
  //         response.payload.data.error === "10009"
  //       ) {
  //         const action = await showErrorDialog(response.payload.data.message);
  //         if (action.isConfirmed) await history.push("/logout");
  //       } else {
  //         showErrorDialog(response.payload.data.message);
  //         setOverlayLoading(false);
  //       }
  //     } catch (error) {
  //       showErrorDialog(error.message);
  //       setOverlayLoading(false);
  //     }
  //   } else {
  //     let result;
  //     if (sortOrder === "asc") {
  //       result = data.sort((a, b) => {
  //         if (a[sortField] > b[sortField]) {
  //           return 1;
  //         } else if (b[sortField] > a[sortField]) {
  //           return -1;
  //         }
  //         return 0;
  //       });
  //       console.log(result, "asc");
  //     } else {
  //       result = data.sort((a, b) => {
  //         if (a[sortField] > b[sortField]) {
  //           return -1;
  //         } else if (b[sortField] > a[sortField]) {
  //           return 1;
  //         }
  //         return 0;
  //       });
  //       console.log(result, "desc");
  //     }
  //   }
  // };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const dummy = [
    {
      no: 1,
      id: 1,
      full_name: "Ikhsan Guntara",
      email: "ikhsan.guntara98@gmail.com",
      password: "adg222823",
      image_url: "www.image.com",
      phone: "628123456789",
      address: "Narogong, Bekasi Timur",
      user_type: "admin",
    },
  ];

  return loading ? (
    <LayoutSplashScreen />
  ) : (
    <Card>
      <CardHeader title="Users">
        <CardHeaderToolbar>
          <Button
            className="btn btn-danger"
            onClick={() => history.push("/users/create")}
          >
            Create
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
                  <b>Fullname</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </Col>

            {/* Right Row */}

            <Col sm={6}>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  <b>Email</b>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
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
        {/* {data && data.length > 0 && (
       
        )} */}
        <UsersTable data={data.length > 0 ? data : dummy} loading={loading} />
      </CardBody>
    </Card>
  );
};
