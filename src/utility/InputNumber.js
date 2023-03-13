import React, { useRef, useEffect, useState } from "react";

class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    // this.videoEl = React.createRef();
    this.getValue = this.getValue.bind(this);
  }
  getValue() {
    if (this.range.value) {
      return parseFloat(this.range.value);
    }
  }

  render() {
    const { value, onUpdate, ...rest } = this.props;
    return (
      <input
        {...rest}
        ref={(node) => (this.range = node)}
        type="number"
        step="any"
        className="input-box-table"
      />
    );
  }
}

///refference https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/column-props.html#columneditorstyle-object-function

// const InputNumber = (props) =>{
//     const{value,onUpdate, ...rest}=props
//     const inputReff = useRef(null)

//     function getValue() {
//         return parseInt(inputReff.value, 10);
//     }

//     return (
//       <input
//       { ...rest }
//       ref={inputReff}
//       onBlur = {onUpdate(getValue())}
//     //   onChange={(e)=>onUpdate(e.target.value)}
//     //   value={value}
//       type='number'
//       />
//     )

//   }

export default InputNumber;
