import React, { Component } from "react";
import "./styles.css";
import { withAuthorization } from "../../Components/Auth/Session";
import BACK_BUTTON from "../HomePage/assets/icons/arrow_back.svg";
import CLOSE_BUTTON from "../HomePage/assets/icons/close-button.png";
import ADD_BUTTON from "../HomePage/assets/icons/add-button.svg";
import HomePageNavBar from "../HomePage/HomePageNavBar";
import { Link, Redirect } from "react-router-dom";

class CustomPhyxPage extends Component {
  constructor(props) {
    super(props);
    this.state = { addItem: false, playlist: "", data: [] };
  }

  componentDidMount() {
    this.setState({ playlist: this.props.playlist });
  }

  removeTemplate = async (id) => {
    const data = await fetch("/api/playlists", {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        type: "removeTemplate",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json(), window.location.reload(false));
  };

  render() {
    if (this.state.playlist !== "" && this.props.userProfile) {
      for (var i in this.state.playlist) {
        if (
          this.state.playlist[i].created_by === this.props.userProfile.email &&
          this.state.playlist[i].showTemplate !== false
        )
          this.state.data.push(this.state.playlist[i]);
      }
    }

    if (this.state.addItem) {
      return (
        <Redirect
          to={{
            pathname: "/exercise",
          }}
          push
        />
      );
    }

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
        <div className="margin-top-8">
          <Link to="/home">
            <img
              src={BACK_BUTTON}
              style={{ cursor: "pointer", padding: "16px" }}
            ></img>
          </Link>
        </div>
        <div className="container">
          <div className="center futura-20-900">Program Library</div>
          <div className="center margin-top-8 futura-16-300">
            This program library allows you to select or <br />
            create your own program, and send to your client(s).
          </div>
          <div
            className="margin-top-16 exercise-container"
            onClick={() => {
              localStorage.setItem("session_list", "[]");
              localStorage.setItem("programName", "");
              this.setState({ addItem: true });
            }}
          >
            <div className="flex-row">
              <div className="flex-1 add-exercises"></div>
              <div className="flex-1 margin-auto futura-14-900 padding-left-16">
                Custom Program
                <br />
                <div className="futura-12-300 gray">
                  Create a personalized solution.
                </div>
              </div>
              <div className="flex-row">
                <div className="flex-1 center margin-auto">
                  <i className="chevron right icon"></i>
                </div>
              </div>
            </div>
          </div>

          {localStorage.session_list && JSON.parse(localStorage.session_list).length !== 0 ? (
            <div
              className="margin-top-16 exercise-container"
              onClick={() => {
                this.setState({ addItem: true });
              }}
            >
              <div className="flex-row">
                <div className="flex-1 add-exercises"></div>
                <div className="flex-1 margin-auto futura-14-900 padding-left-16">
                  Custom Program
                  <br />
                  <div className="futura-12-300 gray">
                    {localStorage.programName !== ""
                      ? localStorage.programName
                      : null}
                  </div>
                </div>
                <div className="flex-row">
                  <div className="flex-1 center margin-auto">
                    <i className="chevron right icon"></i>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {this.state.data.length !== 0
            ? this.state.data &&
              this.state.data
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item) => {
                  return (
                    <div
                      className="margin-top-16 exercise-container"
                      key={item.id}
                      style={{ cursor: "default" }}
                    >
                      <div className="flex-row">
                        <div className="flex-1 add-exercises"></div>
                        <div className="flex-1 margin-auto futura-14-900 padding-left-16">
                          {item.program_name}
                          <br />
                          <div className="futura-12-300 gray">{item.date}</div>
                        </div>
                        <div
                          className="flex-row"
                          style={{ paddingRight: "8px" }}
                        >
                          <div className="flex-1 margin-auto">
                            <img
                              style={{ cursor: "pointer", width: "26px" }}
                              src={ADD_BUTTON}
                              onClick={() => {
                                localStorage.setItem(
                                  "session_list",
                                  JSON.stringify(item.playlist)
                                );
                                localStorage.setItem(
                                  "programName",
                                  item.program_name
                                );
                                this.setState({ addItem: true });
                              }}
                            />
                          </div>
                          <div className="flex-1 margin-auto padding-left-8">
                            <img
                              style={{ cursor: "pointer", width: "36px" }}
                              src={CLOSE_BUTTON}
                              onClick={() => {
                                let answer = window.confirm('Are you sure you want to delete this program?');
                                if(answer === true){
                                  this.removeTemplate(item.id);
                                }                              
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            : null}
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(CustomPhyxPage);
