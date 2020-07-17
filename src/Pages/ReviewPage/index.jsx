import React, { Component } from "react";
import { withAuthorization } from "../../Components/Auth/Session";
import ReactJWPlayer from "react-jw-player";
import EXIT from "../HomePage/assets/icons/black_xbutton.svg";
import { Dropdown } from "semantic-ui-react";
import CLOSE_BUTTON from "../HomePage/assets/icons/close-button.png";
import BACK_BUTTON from "../HomePage/assets/icons/arrow_back.svg";
import "./styles.css";
import setsRepsData from "../../Constants/setsRepsData.js";
import ADD_BUTTON from "../HomePage/assets/icons/add-button.svg";
import HomePageNavBar from "../HomePage/HomePageNavBar";
import { Redirect, Link } from "react-router-dom";
import EditUser from "./EditUser";
import SearchBarCategory from "../ExercisePage/SearchBarCategory";
const JWPlatformAPI = require("jwplatform");
const jwApi = new JWPlatformAPI({
  apiKey: "66HeDPE4",
  apiSecret: "rTgQgBeYmDl914zKUJGS17rH",
});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    const initialMediaList = JSON.parse(localStorage.media_list || "[]");
    const initialSessionList = JSON.parse(localStorage.session_list || "[]");
    const initialSelectedUsers = JSON.parse(
      localStorage.selected_users || "[]"
    );
    const initialProgramName = localStorage.programName || "";
    const initialDnDState = {
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
      originalOrder: [],
      updatedOrder: [],
    };
    const initialDnDStateSession = {
      draggedFromSession: null,
      draggedToSession: null,
      isDraggingSession: false,
      originalOrderSession: [],
      updatedOrderSession: [],
    };

    this.state = {
      videos: [],
      selectedOption: null,
      addItem: false,
      showVideo: false,
      playlist: "",
      sets: 1,
      reps: 1,
      time: 30,
      type: "reps",
      mediaId: "",
      media_list: initialMediaList,
      session_list: initialSessionList,
      noteEditing: null,
      data: [],
      programName: initialProgramName,
      redirect: false,
      selected_users: initialSelectedUsers,
      users: [],
      titles: [],
      showSearchCategory: false,
      showSearchVideo: false,
      dragAndDrop: initialDnDState,
      dragAndDropSession: initialDnDStateSession,
      addSession: false,
      sessionIndex: null,
    };
  }

  onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    this.setState({
      dragAndDrop: {
        ...this.state.dragAndDrop,
        draggedFrom: initialPosition,
        isDragging: true,
        originalOrder: this.state.session_list[this.state.sessionIndex],
      },
    });
    event.dataTransfer.setData("text/html", "");
  };

  onDragOver = (event) => {
    event.preventDefault();

    let newList = this.state.dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = this.state.dragAndDrop.draggedFrom;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== this.state.dragAndDrop.draggedTo) {
      this.setState({
        dragAndDrop: {
          ...this.state.dragAndDrop,
          updatedOrder: newList,
          draggedTo: draggedTo,
        },
      });
    }
  };

  onDrop = (event) => {
    const { session_list } = this.state;
    session_list[this.state.sessionIndex] = this.state.dragAndDrop.updatedOrder;
    this.setState({ session_list });
    this.setState({
      dragAndDrop: {
        ...this.state.dragAndDrop,
        draggedFrom: null,
        draggedTo: null,
        isDragging: false,
      },
    });
    localStorage.setItem(
      "session_list",
      JSON.stringify(session_list)
    );
  };

  onDragLeave = () => {
    this.setState({
      dragAndDrop: { ...this.state.dragAndDrop, draggedTo: null },
    });
  };

  onDragStartSession = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    this.setState({
      dragAndDropSession: {
        ...this.state.dragAndDropSession,
        draggedFromSession: initialPosition,
        isDraggingSession: true,
        originalOrderSession: this.state.session_list,
      },
    });
    event.dataTransfer.setData("text/html", "");
  };

  onDragOverSession = (event) => {
    event.preventDefault();

    let newList = this.state.dragAndDropSession.originalOrderSession;

    // index of the item being dragged
    const draggedFromSession = this.state.dragAndDropSession.draggedFromSession;

    // index of the droppable area being hovered
    const draggedToSession = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFromSession];
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFromSession
    );

    newList = [
      ...remainingItems.slice(0, draggedToSession),
      itemDragged,
      ...remainingItems.slice(draggedToSession),
    ];

    if (draggedToSession !== this.state.dragAndDropSession.draggedToSession) {
      this.setState({
        dragAndDropSession: {
          ...this.state.dragAndDropSession,
          updatedOrderSession: newList,
          draggedToSession: draggedToSession,
        },
      });
    }
  };

  onDropSession = (event) => {
    this.setState({
      session_list: this.state.dragAndDropSession.updatedOrderSession,
      dragAndDropSession: {
        ...this.state.dragAndDropSession,
        draggedFromSession: null,
        draggedToSession: null,
        isDraggingSession: false,
      },
    });
    localStorage.setItem(
      "session_list",
      JSON.stringify(this.state.dragAndDropSession.updatedOrderSession)
    );
  };

  onDragLeaveSession = () => {
    this.setState({
      dragAndDropSession: { ...this.state.dragAndDropSession, draggedToSession: null },
    });
  };

  handleVideoCategoryChange = (selectedCategory) => {
    jwApi.videos
      .list({ result_limit: 1000, tags: selectedCategory })
      .then((response) => this.setState({ titles: response.videos }))
      .then(() => {
        this.setState({ showSearchCategory: false, showSearchVideo: true });
      });
  };

  handleVideoChange = (selectedOption) => {
    this.setState(
      { selectedOption },
      () =>
        fetch(`https://cdn.jwplayer.com/v2/media/${selectedOption.key}`)
          .then((res) => res.json())
          .then(
            (result) => {
              this.setState({ playlist: result.playlist });
            },
            (error) => {
              console.log(error);
            }
          ),
      this.setState({ showVideo: true })
    );
  };

  handleSetsChange = (event, data) => {
    this.setState({ sets: data.value });
  };

  handleRepsChange = (event, data) => {
    this.setState({ reps: data.value });
  };

  handleTimesChange = (event, data) => {
    this.setState({ time: data.value });
  };

  handleTypeChange = (event, data) => {
    this.setState({ type: data.value });
  };

  handleProgramNameChange = (event) => {
    this.setState({ programName: event.target.value });
  };

  handleCloseAddItem = () => {
    this.setState({ addItem: false });
  };

  handleCloseVideoTab = () => {
    this.setState({ showSearchCategory: true, showSearchVideo: false });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let result;
    
    for(let i in this.state.session_list){
      if(this.state.session_list[i].length !== 0){
        result = true;
      } else {
        result = false;
        break;
      }
    }

    if(result === true){
      const data = await fetch("/api/playlists", {
        method: "POST",
        body: JSON.stringify({
          media_list: this.state.session_list,
          selected_users: this.state.selected_users,
          created_by: this.props.userProfile.email,
          randomString: this.generateRandomKey(),
          program_name: this.state.programName,
          date: new Date().toLocaleString("en-US"),
          timestamp: new Date().getTime(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) => res.json(),
        localStorage.setItem("selected_users", "[]"),
        localStorage.setItem("session_list", "[]"),
        localStorage.setItem("programName", ""),
        window.history.replaceState(
          {
            ...window.history.state,
            session_list: [],
            selected_users: [],
            programName: "",
          },
          ""
        ),
        (window.location.href = "/complete")
      );
    } else {
      window.alert("Fill out all session");
    }
    
  };

  generateRandomKey = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  handleSubmitMediaData = () => {
    const { session_list } = this.state;
    
    if (this.state.type === "reps") {
      session_list[this.state.sessionIndex] = [...session_list[this.state.sessionIndex], { 
        title: this.state.selectedOption.title,
        mediaId: this.state.selectedOption.key,
        sets: this.state.sets,
        reps: this.state.reps,
        time: null,
        type: this.state.type, }];
      this.setState({ session_list });
    } else {
      session_list[this.state.sessionIndex].push({ 
        title: this.state.selectedOption.title,
        mediaId: this.state.selectedOption.key,
        sets: this.state.sets,
        reps: null,
        time: this.state.time,
        type: this.state.type, });
      this.setState({ session_list });
    }

    localStorage.setItem("session_list", JSON.stringify(session_list));

    this.setState({
      showVideo: false,
      addItem: false,
      showSearchVideo: false,
      addList: true,
      sets: 1,
      type: "reps",
      reps: 1,
    });
  };

  removeSession(indexToDelete) {
    let session_list = [...this.state.session_list].filter(
      (item, index) => index !== indexToDelete
    );
    this.setState({ session_list });
    localStorage.setItem("session_list", JSON.stringify(session_list));
  }

  removeItem(indexToDelete) {
    const { session_list } = this.state;
    session_list[this.state.sessionIndex].splice(indexToDelete, 1);
    this.setState({ session_list });
    localStorage.setItem("session_list", JSON.stringify(session_list));
  }

  setNoteEditing = (item, index) => {
    fetch(`https://cdn.jwplayer.com/v2/media/${item.mediaId}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({ playlist: result.playlist });
        },
        (error) => {
          console.log(error);
        }
      );
    if (item.type === "reps") {
      this.setState({
        noteEditing: index,
        sets: item.sets,
        reps: item.reps,
        type: item.type,
      });
    } else {
      this.setState({
        noteEditing: index,
        sets: item.sets,
        time: item.time,
        type: item.type,
      });
    }
  };

  submitEdit = (item, index) => {
    const { session_list } = this.state;
    if (this.state.type === "reps") {
      session_list[this.state.sessionIndex][index] = {
        title: item.title,
        mediaId: item.mediaId,
        sets: this.state.sets,
        time: null,
        reps: this.state.reps,
        type: this.state.type,
      };
    } else {
      session_list[this.state.sessionIndex][index] = {
        title: item.title,
        mediaId: item.mediaId,
        sets: this.state.sets,
        time: this.state.time,
        reps: null,
        type: this.state.type,
      };
    }

    this.setState({
      session_list,
      noteEditing: null,
      sets: 1,
      type: "reps",
      reps: 1,
    });
    localStorage.setItem("session_list", JSON.stringify(session_list));
  };

  render() {
    const {
      options_type,
      options_sets,
      options_reps,
      options_time,
    } = setsRepsData;
    const titles = [];

    if (this.state.videos !== []) {
      Object.entries(this.state.videos).map((value) =>
        value[1].map((val, index) => {
          titles.push({ label: val.title, value: val.key });
        })
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
        {this.state.addSession ? 
          <img
            src={BACK_BUTTON}
            onClick={() => { this.setState({ addSession: false }) }}
            style={{ cursor: "pointer", padding: "16px" }}
          ></img>
        : <Link to="/exercise">
          <img
            src={BACK_BUTTON}
            style={{ cursor: "pointer", padding: "16px" }}
          ></img>
        </Link>}
        </div>
        <div className="container futura-16-300">
          <div>
            <div className="futura-24-900 center">Overview</div>
            {this.state.addSession ? 
            <div className="center futura-20-900">Session - {this.state.sessionIndex + 1}</div>
              :
              <div className="futura-20-300 center margin-top-8">
              {this.state.programName}
              </div>}
            
            <div className="margin-top-16">
              <EditUser selected_users={this.state.selected_users} />
            </div>
            <div className="margin-top-32" />

            {!this.state.addSession && this.state.session_list.map((item, index) => 
        {
          return (
            <div
                draggable
                style={{ cursor: "move" }}
                data-position={index}
                onDragStart={this.onDragStartSession}
                onDragOver={this.onDragOverSession}
                onDrop={this.onDropSession}
                onDragLeave={this.onDragLeaveSession}
                key = {index}
                className="exercises-container"
              >
                <div className="flex-row margin-top-8">
                  <>
                    <div className="flex-1 sets-pic">
                    { index + 1 }
                    </div>
                    <div className="flex-1 margin-auto futura-14-900 padding-left-16">
                          Session { index + 1 }
                    </div>
                    <div className="flex-row">
                      <div className="flex-1 margin-auto">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                          this.setState({ addSession: true, sessionIndex: index });
                          }}
                        >
                          EDIT
                        </a>
                      </div>
                      <div className="flex-1 margin-auto padding-left-8">
                        <img
                          style={{ cursor: "pointer" }}
                          width="36px"
                          src={CLOSE_BUTTON}
                          onClick={() => { this.removeSession(index) }}
                        />
                      </div>
                    </div>
                  </>
                </div>
              </div>)})}

              {!this.state.addSession && <div
          className="margin-top-8 exercise-container"
          onClick={() => {
            this.setState({
            session_list : [ ...this.state.session_list, [] ]})
          }}
        >
          <div className="flex-row">
            <div className="flex-1 add-exercises"></div>
            <div className="flex-1 futura-14-900 margin-auto padding-left-16">
              ADD SESSION
            </div>
            <div className="flex-row">
              <div className="flex-1 center margin-auto">
                <img
                  src={ADD_BUTTON}
                  style={{ marginRight: "8px", width: "32px" }}
                />
              </div>
            </div>
          </div>
        </div>}

        {this.state.addSession && this.state.session_list[this.state.sessionIndex] && this.state.session_list[this.state.sessionIndex].map((item, index) => (
          <div className="notes" key={index}>
                {this.state.noteEditing === null ||
                this.state.noteEditing !== index ? (
                  <div
                    draggable
                    style={{ cursor: "move" }}
                    className="exercises-container"
                    data-position={index}
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                    onDragLeave={this.onDragLeave}
                  >
                    <div className="flex-row margin-top-8">
                      <>
                      <div className="flex-1 sets-pic">
                      {item.sets}x
                      </div>
                        <div className="flex-1 futura-14-900 padding-left-16">
                          {item.title}
                          <br />
                          <div className="sets-subtitle">
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
                        <div className="flex-row">
                          <div className="flex-1 margin-auto">
                            <a
                              style={{ cursor: "pointer" }}
                              onClick={() => this.setNoteEditing(item, index)}
                            >
                              EDIT
                            </a>
                          </div>
                          <div className="flex-1 margin-auto padding-left-8">
                            <img
                              style={{ cursor: "pointer" }}
                              width="36px"
                              src={CLOSE_BUTTON}
                              onClick={() => this.removeItem(index)}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                ) : (
                  <div className="video-screen">
                    <div className="exit-button">
                      <img
                        src={EXIT}
                        onClick={() => {
                          this.setState({ noteEditing: null });
                        }}
                        width="20px"
                      ></img>
                    </div>

                    <center>
                      <div className="margin-top-16 form">
                        <div className="futura-20-900">{item.title}</div>
                        <ReactJWPlayer
                          className="margin-top-16"
                          playerScript="https://cdn.jwplayer.com/libraries/pmSzzbnT.js"
                          playlist={this.state.playlist}
                          playerId="unique-id"
                        />
                        <form className="margin-top-16">
                          <Dropdown
                            selection
                            placeholder="Select Type"
                            defaultValue={item.type}
                            onChange={this.handleTypeChange}
                            options={options_type}
                          />
                          <Dropdown
                            selection
                            style={{ width: "48%", float: "left" }}
                            placeholder="Select Sets"
                            defaultValue={this.state.sets}
                            onChange={this.handleSetsChange}
                            options={options_sets}
                          />
                          {this.state.type === "reps" ? (
                            <Dropdown
                              selection
                              style={{ width: "48%", float: "right" }}
                              placeholder="Select Reps"
                              defaultValue={this.state.reps}
                              onChange={this.handleRepsChange}
                              options={options_reps}
                            />
                          ) : (
                            <Dropdown
                              selection
                              style={{ width: "48%", float: "right" }}
                              placeholder="Select Time"
                              defaultValue={this.state.time}
                              onChange={this.handleTimesChange}
                              options={options_time}
                            />
                          )}
                          <div style={{ paddingBottom: "150px" }} />
                          <div className="bottom-button-video">
                            <button
                              className="button"
                              onClick={() => {
                                this.submitEdit(item, index);
                              }}
                            >
                              SAVE
                            </button>
                          </div>
                        </form>
                      </div>
                    </center>
                  </div>
                )}
              </div>
            ))}

            {this.state.addItem ? (
              <div>
                <div className="margin-top-16 form">
                  {this.state.showSearchCategory ? (
                    <SearchBarCategory
                      handleCloseAddItem={this.handleCloseAddItem}
                      handleVideoCategoryChange={this.handleVideoCategoryChange}
                      handleVideoChange={this.handleVideoChange}
                      showSearchVideo={this.state.showSearchVideo}
                      videos={this.props.videos}
                      categories={this.props.videosCategory}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <div />
            )}
            {this.state.addItem && this.state.showVideo ? (
              <div className="video-screen">
                <div className="exit-button">
                  <img
                    src={EXIT}
                    onClick={() => {
                      this.setState({ showVideo: false });
                    }}
                    width="20px"
                  ></img>
                </div>

                <center>
                  <div className="margin-top-16 form">
                    <div className="futura-20-900">
                      {this.state.selectedOption.title}
                    </div>
                    <ReactJWPlayer
                      className="margin-top-16"
                      playerScript="https://cdn.jwplayer.com/libraries/pmSzzbnT.js"
                      playlist={this.state.playlist}
                      playerId="unique-id"
                    />
                    <form className="margin-top-16">
                      <Dropdown
                        selection
                        placeholder="Select Type"
                        defaultValue={this.state.type}
                        onChange={this.handleTypeChange}
                        options={options_type}
                      />
                      <Dropdown
                        selection
                        style={{ width: "48%", float: "left" }}
                        placeholder="Select Sets"
                        defaultValue={this.state.sets}
                        onChange={this.handleSetsChange}
                        options={options_sets}
                      />
                      {this.state.type === "reps" ? (
                        <Dropdown
                          selection
                          style={{ width: "48%", float: "right" }}
                          placeholder="Select Reps"
                          defaultValue={this.state.reps}
                          onChange={this.handleRepsChange}
                          options={options_reps}
                        />
                      ) : (
                        <Dropdown
                          selection
                          style={{ width: "48%", float: "right" }}
                          placeholder="Select Time"
                          defaultValue={this.state.time}
                          onChange={this.handleTimesChange}
                          options={options_time}
                        />
                      )}
                      <div style={{ paddingBottom: "150px" }} />
                      <div className="bottom-button-video">
                        <button
                          className="button"
                          onClick={() => {
                            this.handleSubmitMediaData();
                          }}
                        >
                          SAVE
                        </button>
                      </div>
                    </form>
                  </div>
                </center>
              </div>
            ) : null}
            
            {this.state.addSession && <div
          className="margin-top-8 exercise-container"
          onClick={() => {
            this.setState({ addItem: true, showSearchCategory: true });
          }}
        >
          <div className="flex-row">
            <div className="flex-1 add-exercises"></div>
            <div className="flex-1 futura-14-900 margin-auto padding-left-16">
              ADD EXERCISES
            </div>
            <div className="flex-row">
              <div className="flex-1 center margin-auto">
                <img
                  src={ADD_BUTTON}
                  style={{ marginRight: "8px", width: "32px" }}
                />
              </div>
            </div>
          </div>
        </div>} 

            <div style={{ paddingBottom: "100px" }} />
            <div className="bottom-button">
            {this.state.addSession ? 
            <button
            type="submit"
            className="button"
            onClick={() => { this.setState({ addSession: false }) }}
          >
            SAVE
          </button>
        : <button
              type="submit"
              className="button"
              disabled={this.state.programName === ""}
              onClick={this.handleSubmit}
            >
              ASSIGN TO CLIENT
            </button>}
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(ReviewPage);
