import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {
  sortCaret,
  headerSortingClasses,
  PleaseWaitMessage,
  NoRecordsFoundMessage,
} from "../../../_metronic/_helpers";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export const TransactionTable = ({ data, loading }) => {
  const dispatch = useDispatch();
  const history = useHistory();

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

  const [tableData, setTableData] = useState(data);

  const actionFormatter = (e, row) => {
    return (
      <div>
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <div
            className="btn btn-icon btn-light btn-hover-primary btn-sm mr-3"
            onClick={() => {
              history.push(`/users/edit/${row.id}`);
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </div>
        </OverlayTrigger>
      </div>
    );
  };

  const columns = [
    {
      text: "No",
      dataField: "no",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },

    {
      text: "fullname",
      dataField: "full_name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "email",
      dataField: "email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "phone",
      dataField: "phone",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "address",
      dataField: "address",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "user type",
      dataField: "user_type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },

    {
      text: "Action",
      dataField: "action",
      formatter: actionFormatter,
    },
  ];

  // const options = {
  //   page: page,
  //   sizePerPage: sizePerPage,
  //   showTotal: true,
  //   totalSize: totalSize,
  //   sizePerPageList: sizePerPageList(totalSize),
  // };
  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={tableData}
        columns={columns}
        hover
      >
        {/* <PleaseWaitMessage entities={loading ? null : tableData} />
        <NoRecordsFoundMessage entities={loading ? null : tableData} /> */}
      </BootstrapTable>
    </>
  );
};
