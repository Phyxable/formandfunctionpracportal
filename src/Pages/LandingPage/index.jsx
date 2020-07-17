import React, { Component } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import empty_state from "../../Pages/HomePage/assets/icons/empty-state.svg";
import HomePageNavBar from "../HomePage/HomePageNavBar";

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    if (this.props.userProfile !== undefined) {
      window.location.href = "/home";
    }
  }

  render() {
    return (
      <div className="flex-column center">
        <HomePageNavBar />

        <div className="flex-1">
          <div className="center">
            <img className="d4-v1" src={empty_state} />
          </div>
        </div>

        <div className="landing-bottom-nav-bar">
          <div className="flex-1">
            <div>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "white" }}
              >
                <button
                  className="margin-top-16 button"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.getStarted();
                  }}
                >
                  GET STARTED
                </button>
              </Link>
            </div>
            <div className="flex-1 margin-top-16 futura-14-300">
              <p className="center">
                Already have an account? <Link to="/signin">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
