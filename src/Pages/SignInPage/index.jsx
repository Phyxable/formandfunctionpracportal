import { SignUpLink } from "../SignUpPage";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withFirebase } from "../../Components/Firebase/firebase";
import * as ROUTES from "../../Constants/routes";
import { compose } from "recompose";
import "./styles.css";
import { array_email } from "../../Constants/email";

class SignInPage extends Component {
  render() {
    return (
      <div className="center background">
        <div className="margin-top-16">
          <div className="flex-row width-100vw">
            <div className="flex-1" style={{ maxWidth: "5vw" }} />
            <div className="flex-1">
              <div className="flex-row" style={{ width: "90vw" }}>
                {/* <div className="flex-1" style={{ textAlign: "left" }}>
                <a href="/">
                  <img
                    style= {{ width: "24px" }}
                    src={arrow_back}
                  />
                </a>
                </div> */}
                <div className="flex-1">
                  <div
                    className="home-nav-bar-title futura-20-300 center"
                    style={{ width: "80vw" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="futura-24-900 margin-top-64 ">Practitioner Portal</div>
        <div className="margin-top-16 futura-20-300">LOGIN</div>
        <div className="center flex-1">
          <div className="inline-block margin-top-16">
            <SignInForm updateUserProfile={this.props.updateUserProfile} />
          </div>
        </div>
      </div>
    );
  }
}

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = (event) => {
    console.log("sign in button pressed");
    console.log(this.props);
    const { email, password } = this.state;
    if (array_email.includes(email.toLowerCase())) {
      this.props.firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        })
        .catch((error) => {
          this.setState({ error });
        });
      event.preventDefault();
    } else {
      alert("not authenticated");
    }
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <form onSubmit={this.onSubmit} className="si-form margin-top-16">
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button
          disabled={isInvalid}
          type="submit signin-btn"
          className="button margin-top-16"
        >
          Sign In
        </button>
        <SignUpLink />
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInLink = () => (
  <p className="center margin-top-8 futura-14-300">
    Already have an account? <Link to="/signin">Sign In</Link>
  </p>
);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm, SignInLink };
