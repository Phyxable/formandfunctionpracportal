import React, { Component } from "react";
import "./styles.css";

class EquipmentMenuOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  render() {
    console.log(this.props);
    const { image, title } = this.props;
    return (
      <div className="inline-row-flex margin-top-8" style={{ width: "50%" }}>
        <>
          <div className="flex-1" style={{ maxWidth: "64px" }}>
            <img className="continue-pic" src={image} />
          </div>
          <div className="flex-1 futura-12-500 " style={{ marginTop: "10px" }}>
            {title}
          </div>
        </>
      </div>
    );
  }
}
export default EquipmentMenuOption;
