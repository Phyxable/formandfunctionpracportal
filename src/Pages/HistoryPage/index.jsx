import React, { Component } from "react";
import "./styles.css";
import { withAuthorization } from "../../Components/Auth/Session";
import HomePageNavBar from "../HomePage/HomePageNavBar";
import USER from "../HomePage/assets/icons/user.png";
import setsRepsData from "../../Constants/setsRepsData";
import { Link } from "react-router-dom";

class HistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = { playlist: "", data: [] };
  }

  componentDidMount() {
    this.setState({ playlist: this.props.playlist });
  }

  deleteId = async (id) => {
    const data = await fetch("/api/playlists", {
      method: "DELETE",
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json(), window.location.reload(false));
  };

  render() {
    const {
      options_type,
      options_sets,
      options_reps,
      options_time,
    } = setsRepsData;
    if (this.state.playlist !== "" && this.props.userProfile) {
      for (var i in this.state.playlist) {
        if (this.state.playlist[i].created_by === this.props.userProfile.email)
          this.state.data.push(this.state.playlist[i]);
      }
    }

    return (
      <div>
        <HomePageNavBar />
        <div className="ui top attached tabular menu">
          <Link to="/home">
            <div className="item">Home</div>
          </Link>
          <div className="active item">History</div>
          <Link to="/profile">
            <div className="item">Profile</div>
          </Link>
        </div>
        <div className="margin-top-16 futura-22-900 center">History</div>
        <div>
          {this.state.data.length !== 0 ? (
            this.state.data &&
            this.state.data
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((item) => {
                try{
                return (
                  <div
                    key={item.id}
                    className="history-card margin-top-8 futura-16-300"
                  >
                    <Link to={`/edit/${item.id}`}>
                      <span style={{ float: "right" }}>EDIT</span>
                    </Link>
                    <div className="futura-22-900">{item.program_name}</div>

                    <div className="margin-top-16 futura-16-900">
                      Session Details:
                    </div>
                    {item.playlist &&
                      item.playlist.map((item, index) => {
                        return(
                        <div key={index}>
                        <div  className="margin-top-16 futura-16-900">
                          Session - { index + 1 }
                        </div>
                        {item.map((item, index) => {
                        return (
                          <div key={index} className="exercises-container">
                            <div className="flex-row margin-top-8">
                            <div className="flex-1 sets-pic">
                            {item.sets}x
                            </div>
                              <div className="flex-1 futura-14-600 sets-title">
                                {item.title}
                                <br />
                                <div className="futura-12-300 width-100 sets-subtitle">
                                  {item.type === "reps"
                                    ? options_reps[
                                        options_reps
                                          .map(function (o) {
                                            return o.value;
                                          })
                                          .indexOf(item.reps)
                                      ].text
                                    : options_time[
                                        options_time
                                          .map(function (o) {
                                            return o.value;
                                          })
                                          .indexOf(item.time)
                                      ].text}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                      );
                    })}
                    <div className="margin-top-16 futura-16-900">Users:</div>
                    {item.selected_users &&
                      item.selected_users.map((item, index) => {
                        return (
                          <div key={index} className="users-container">
                            <div className="flex-row">
                              <div
                                className="flex-1 center margin-auto"
                                style={{ maxWidth: "64px" }}
                              >
                                {/* <i className="fa fa-user" style={{ fontSize: "24px", color:"gray" }}></i> */}
                                <img src={USER} style={{ width: "36px" }}></img>
                              </div>
                              <div className="flex-1 futura-14-900 margin-auto">
                                {item.name}
                                <br />
                                <div className="futura-12-300">
                                  {item.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    <div className="margin-top-16 center">
                      <button
                        className="button-delete"
                        onClick={() => this.deleteId(item.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                );} catch{
                  console.log("cannot fetch data");
                }
              })
          ) : (
            <div className="center margin-top-32 futura-14-300 gray">
              No history
            </div>
          )}
        </div>
        <div style={{ paddingBottom: "50px" }} />
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(HistoryPage);
