import React from "react";
import { formatDateTime } from "./util";
import { showDialog } from "../utility";
import WarningIcon from "@material-ui/icons/Warning";
import ImageIcon from "@material-ui/icons/Image";

export const prosesFormatter = (cellContent) => {
  if (cellContent === "W") {
    return "Waiting";
  } else if (cellContent === "R") {
    return "Reject";
  } else if (cellContent === "A") {
    return "Approve";
  } else if (cellContent === "K") {
    return "Confirm";
  }
};

export const formatCurrency = (cellContent) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
  }).format(cellContent);
};

export const formatUsd = (cellContent) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cellContent);
};

const dateTimeFormatter = (cell) => {
  if (cell === "0001-01-01T00:00:00Z") {
    return <span> </span>;
  } else {
    return <span>{formatDateTime(cell)}</span>;
  }
};

export const numFormatter = (data) => {
  return parseFloat(data).toLocaleString(data, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
