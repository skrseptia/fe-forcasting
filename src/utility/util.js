import moment from "moment";
import { useState } from "react";

export const sizePerPageList = (totalSize) => [
  {
    text: "10",
    value: 10,
  },
  {
    text: "20",
    value: 20,
  },
  {
    text: "30",
    value: 30,
  },
  {
    text: "40",
    value: 40,
  },
  {
    text: "50",
    value: 50,
  },
  {
    text: "All",
    value: totalSize,
  },
];

export const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export const formatDate = (stringDate) => {
  if (stringDate === null) {
    return "";
  } else {
    return moment(stringDate).format("DD MMMM YYYY");
  }
};
export const formatDateTime = (stringDate) => {
  if (stringDate === null) {
    return "";
  } else {
    return moment(stringDate).format("DD MMMM YYYY - hh:mm");
  }
};

export const formatDateMonth = (stringDate) => {
  if (stringDate === null) {
    return "";
  } else {
    return moment(stringDate).format("DD MMMM YYYY");
  }
};

export const formatShortDate = (stringDate) => {
  if (stringDate === null) {
    return "";
  } else {
    return moment(stringDate).format("YYYY-MM-DD");
  }
};

// export const formatDateMonth = (stringDate) => {
//   if (stringDate === "1900-01-01T00:00:00Z") {
//     return "";
//   } else if (stringDate === "0001-01-01T00:00:00Z") {
//     return "";
//   } else if (stringDate === null) {
//     return "";
//   } else {
//     return moment(stringDate).format("DD MMMM YYYY");
//   }
// };

export const getValueOptions = (value, options) => {
  const return_value = options.filter((val) => value === val.value);
  return return_value;
};
