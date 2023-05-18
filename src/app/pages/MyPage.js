import React, { useRef } from "react";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";

export const MyPage = () => {
  return (
    <div>
      <DropzoneArea
        acceptedFiles={["image/*"]}
        dropzoneText={"Drag and drop an image here or click"}
        onChange={(files) => console.log("Files:", files)}
      />
    </div>
  );
};
