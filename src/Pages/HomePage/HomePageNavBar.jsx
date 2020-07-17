import React, { Component } from "react";
import logo from "./assets/icons/logo_webbanner.png";
import "./App.css";

class HomePageNavBar extends Component {
  render() {
    return (
      <div className="home-nav-bar">
        <div className="center">
          <img className="margin-top-12" src={logo} width="96px"></img>
        </div>
      </div>
    );
  }
}
export default HomePageNavBar;
