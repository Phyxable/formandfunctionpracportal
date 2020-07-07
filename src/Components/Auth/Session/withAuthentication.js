import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../../Firebase/firebase";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
   
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser }, ()=>{this.addUserProfileToAuthUser()})
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    async addUserProfileToAuthUser() {

      const userProfile = await this.props.firebase.doGetUserProfile(
        this.state.authUser.uid
      );
      const oldAuth = this.state.authUser;
      oldAuth.userProfile = { userProfile: userProfile };
      this.setState({ authUser: oldAuth });
    }
  
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
