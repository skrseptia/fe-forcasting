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
import { formatCurrency, formatDate, sizePerPageList } from "../../../utility";
import paginationFactory from "react-bootstrap-table2-paginator";

export const TransactionTable = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
  loading,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // Add number
    const pageBefore = sizePerPage * (page - 1);
    const initData = data.map((item, index) => {
      return {
        ...item,
        no: index + 1 + pageBefore,
      };
    });
    setTableData(initData);
  }, [data, sizePerPage, page]);

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
              history.push(`/master-data/merchants/edit/${row.id}`);
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

    // {
    //   text: "transaction",
    //   dataField: "trx_id",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    // },
    {
      text: "created by",
      dataField: "created_by",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    // {
    //   text: "customer",
    //   dataField: "customer",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    // },
    {
      text: "total",
      dataField: "total",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatCurrency,
    },
    {
      text: "Created Date",
      dataField: "trx_date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: formatDate,
    },
    {
      text: "Action",
      dataField: "action",
      formatter: actionFormatter,
    },
  ];

  const columnsLine = [
    {
      text: "code",
      dataField: "code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      text: "category",
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
    {
      text: "uom",
      dataField: "uom",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    // {
    //   text: "price",
    //   dataField: "price",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    // },
    // {
    //   text: "sub total",
    //   dataField: "sub_total",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   formatter: formatCurrency,
    // },
  ];

  const expandRow = {
    // onlyOneExpanding: true,
    showExpandColumn: true,
    expandByColumnOnly: true,
    renderer: (row) => (
      <BootstrapTable
        keyField="id"
        data={row.transaction_lines}
        columns={columnsLine}
      />
    ),
  };

  const options = {
    page: page,
    sizePerPage: sizePerPage,
    showTotal: true,
    totalSize: totalSize,
    sizePerPageList: sizePerPageList(totalSize),
  };

  return (
    <>
      <BootstrapTable
        remote
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={tableData}
        columns={columns}
        pagination={paginationFactory(options)}
        onTableChange={onTableChange}
        hover
        expandRow={expandRow}
      >
        <PleaseWaitMessage entities={loading ? null : tableData} />
        <NoRecordsFoundMessage entities={loading ? null : tableData} />
      </BootstrapTable>
    </>
  );
};
