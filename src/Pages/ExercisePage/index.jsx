import React, { Component } from "react";
import "./styles.scss";
import "./styles.css";
import { withAuthorization } from "../../Components/Auth/Session";
import Exercises from "./Exercises";
import HomePageNavBar from "../HomePage/HomePageNavBar";
import { Link } from "react-router-dom";

class ExercisePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HomePageNavBar />
        <div className="ui top attached tabular menu">
          <div className="active item">Home</div>
          <Link to="/history">
            <div className="item">History</div>
          </Link>
          <Link to="/profile">
            <div className="item">Profile</div>
          </Link>
        </div>
        <div>
          <Exercises
            selected_users={
              this.props.location.state
                ? this.props.location.state.selected_users
                : null
            }
            videos={this.props.videos}
            videosCategory={this.props.videosCategory}
          />
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(ExercisePage);
