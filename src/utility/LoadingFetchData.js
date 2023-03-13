import React from "react";
import LoadingOverlay from "react-loading-overlay";

const LoadingFetchData = (props) => {
  const { active } = props;
  return (
    <LoadingOverlay
      active={active}
      spinner
      text="Loading..."
      classNamePrefix="loading-overlay-"
    >
      {/*<p>Some content or children or something.</p>*/}
    </LoadingOverlay>
  );
};

export default LoadingFetchData;
