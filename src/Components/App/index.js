import React, { Component } from "react";
import SignInPage from "../../Pages/SignInPage/index.jsx";
import SignUpPage from "../../Pages/SignUpPage/index.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import * as routes from "../../Constants/routes";
import "./styles.css";
import firebase from "@firebase/app";
import { withAuthentication } from "../Auth/Session";
import LandingPage from "../../Pages/LandingPage";
import HomePage from "../../Pages/HomePage";
import ReviewPage from "../../Pages/ReviewPage";
import CompletePage from "../../Pages/CompletePage/index.jsx";
import HistoryPage from "../../Pages/HistoryPage/index.jsx";
import ExercisePage from "../../Pages/ExercisePage/index.jsx";
import ProfilePage from "../../Pages/ProfilePage/index.jsx";
import EditHistory from "../../Pages/HistoryPage/EditHistory.jsx";
import CustomPhyxPage from "../../Pages/CustomPhyxPage/index.jsx";
const JWPlatformAPI = require("jwplatform");

const jwApi = new JWPlatformAPI({
  apiKey: "66HeDPE4",
  apiSecret: "rTgQgBeYmDl914zKUJGS17rH",
});
const videos = [];
const videosCategory = [];

jwApi.videos.tags
  .list({ result_limit: 1000, order_by: "videos:desc" })
  .then((response) => videosCategory.push(response.tags));

jwApi.videos
  .list({ result_limit: 1000 })
  .then((response) => videos.push(response.videos));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: "",
      users: [],
    };
  }

  updateUserProfile = (key, value) => {
    const oldProfile = this.state.userProfile;
    oldProfile[key] = value;
    this.setState({ userProfile: oldProfile });
    const uid = this.props.firebase.auth.currentUser.uid;
    this.props.firebase.writeData(`${uid}/userProfile/`, key, value);
  };

  updateAppState = (key, value) => {
    this.setState({ [key]: value });
  };

  async componentDidMount() {
    const response = await fetch(
      `https://fnfpractitioner.phyxable.com/api/playlists`
    );
    const data = await response.json();
    this.setState({ playlist: data });
    let users = [];
    firebase
      .database()
      .ref("/users/")
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (snapshot) {
          if (snapshot.child("userProfile").child("name").val() !== null)
            users.push({
              name: snapshot.child("userProfile").child("name").val(),
              email: snapshot.child("userProfile").child("email").val(),
            });
        });
      });
    this.setState({ users: users });
  }

  componentDidUpdate() {
    if (
      this.props.firebase.auth.currentUser &&
      this.props.firebase.auth.currentUser.userProfile &&
      !this.state.userProfile
    ) {
      this.setState({
        userProfile: this.props.firebase.auth.currentUser.userProfile
          .userProfile,
      });
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path={routes.HOME}
            render={(props) => (
              <HomePage
                uid={this.props.firebase.auth.currentUser}
                updateUserProfile={this.updateUserProfile}
                userProfile={this.state.userProfile}
                users={this.state.users}
              />
            )}
          />
          <Route
            exact
            path={routes.CUSTOM_PHYX}
            render={(props) => (
              <CustomPhyxPage
                uid={this.props.firebase.auth.currentUser}
                updateUserProfile={this.updateUserProfile}
                userProfile={this.state.userProfile}
                playlist={this.state.playlist}
                users={this.state.users}
                videos={videos}
                videosCategory={videosCategory}
              />
            )}
          />
          <Route
            exact
            path={routes.EXERCISE}
            render={(props) => (
              <ExercisePage
                uid={this.props.firebase.auth.currentUser}
                updateUserProfile={this.updateUserProfile}
                userProfile={this.state.userProfile}
                playlist={this.state.playlist}
                users={this.state.users}
                videos={videos}
                videosCategory={videosCategory}
              />
            )}
          />
          <Route
            exact
            path={routes.REVIEW}
            render={(props) => (
              <ReviewPage
                uid={this.props.firebase.auth.currentUser}
                updateUserProfile={this.updateUserProfile}
                userProfile={this.state.userProfile}
                users={this.state.users}
                playlist={this.state.playlist}
                videosCategory={videosCategory}
                videos={videos}
              />
            )}
          />
          <Route
            exact
            path={routes.HISTORY}
            render={(props) => (
              <HistoryPage
                userProfile={this.state.userProfile}
                playlist={this.state.playlist}
              />
            )}
          />
          <Route
            exact
            path={routes.PROFILE}
            render={(props) => (
              <ProfilePage
                userProfile={this.state.userProfile}
                uid={this.props.firebase.auth.currentUser}
              />
            )}
          />
          <Route
            exact
            path={routes.LANDING}
            render={(props) => (
              <LandingPage
                userProfile={this.state.userProfile}
                appState={this.state}
              />
            )}
          />
          <Route
            exact
            path={routes.COMPLETE}
            render={(props) => <CompletePage />}
          />
          <Route
            exact
            path={routes.SIGN_UP}
            render={(props) => (
              <SignUpPage
                userProfile={this.state.userProfile}
                updateUserProfile={this.updateUserProfile}
                updateAppState={this.updateAppState}
              />
            )}
          />

          <Route
            exact
            path={routes.SIGN_IN}
            render={(props) => (
              <SignInPage updateUserProfile={this.updateUserProfile} />
            )}
          />

          <Route
            exact
            path="/edit/:id"
            render={(props) => (
              <EditHistory
                props={props}
                playlist={this.state.playlist}
                videosCategory={videosCategory}
                videos={videos}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}
export default withAuthentication(App);
