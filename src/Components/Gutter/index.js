import React, { Component } from "react";

class Gutter extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props.children);
    return (
      <div className="flex-row width-100vw height-100">
        <div className="flex-1" style={{ maxWidth: "5vw" }} />
        <div
          className="flex-1"
          style={{ maxWidth: "90vw", marginBottom: "40px" }}
        >
          {this.props.children}
        </div>
        <div className="flex-1" style={{ maxWidth: "5vw" }} />
      </div>
    );
  }
}
export default Gutter;
