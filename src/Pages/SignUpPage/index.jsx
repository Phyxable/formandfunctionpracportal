import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Redirect } from "react-router";
import PasswordMask from "react-password-mask";
import { withFirebase } from "../../Components/Firebase/firebase";
import moment from "moment";
import "./styles.css";
import { compose } from "recompose";
import { SignInLink } from "../SignInPage";
import { array_email } from "../../Constants/email";

class SignUpPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center background" style={{ overflowX: "hidden" }}>
        <div className="margin-top-16">
          <div className="flex-row width-100vw">
            <div className="flex-1" style={{ maxWidth: "5vw" }} />
            <div className="flex-1">
              <div className="flex-row" style={{ width: "90vw" }}>
                <div className="flex-1">
                  <div
                    className="home-nav-bar-title  futura-20-300 center"
                    style={{ width: "80vw" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="futura-24-900 margin-top-64">Practitioner Portal</div>
          <div className="futura-20-300 margin-top-16">SIGNUP</div>
        </div>
        <div className="center flex-1">
          <div className="inline-block">
            <SignUpForm />
          </div>
        </div>
        <div style={{ flex: 0.1 }} />
      </div>
    );
  }
}

const INITIAL_STATE = {
  username: "",
  lastname: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, redirect: false, colorChange: "#E1E2E3" };
  }

  onSubmit = (event) => {
    const { username, lastname, email, passwordOne } = this.state;

    if (array_email.includes(email.toLowerCase())) {
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then((authUser) => {
          return this.props.firebase.user(authUser.uid).update({
            joinDate: moment().format("YYYY/MM/DD"),
            userProfile: {
              subscription: { paid: true },
              progress: {},
              name: username,
              lastname: lastname,
              email: email,
              VAS: {},
              currentPhyx: "posture",
              rewards:
                localStorage.getItem("data4") === "true"
                  ? {
                      default: {
                        date: new Date().toLocaleString("en-US"),
                        timestamp: new Date().getTime(),
                        id: 1,
                        status: "completed",
                      },
                    }
                  : {},
              accountType: "PRACTITIONER",
              notification: {},
              signedIn: false,
              toolTip: false,
            },
          });
        })
        .then((authUser) => {
          console.log("in on submit sign up", this.props);

          this.setState({ ...INITIAL_STATE });
          this.setState({ authRedirect: true });
        })
        .catch((error) => {
          this.setState({ error });
          alert(error);
        });

      event.preventDefault();
    } else {
      alert("not authenticated");
    }
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (
      this.state.passwordOne === "" ||
      this.state.email === "" ||
      this.state.username === ""
    ) {
      this.setState({ colorChange: "#E1E2E3" });
    } else {
      this.setState({ colorChange: "#FF5A66" });
    }
  };

  handleTryFirstClick = () => {
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/demo-page-one" />;
    }
    if (this.state.authRedirect) {
      window.location.href = "/home";
    }

    //const { signUpPageEvent } = this.props;

    const {
      username,
      lastname,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      // passwordOne !== passwordTwo ||
      passwordOne === "" || email === "" || username === "";

    return (
      <form>
        <div className="center margin-top-16">
          <div className="inline-block">
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <PasswordMask
              id="password"
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password (6+ characters)"
              inputClassName="PasswordMaskInput"
            />
          </div>
        </div>
        <div className="margin-top-32">
          <button
            id="noHover"
            onClick={(event) => {
              this.onSubmit(event);
            }}
            disabled={isInvalid}
            type="submit"
            className="button"
            style={{ backgroundColor: this.state.colorChange }}
          >
            SIGN UP
          </button>
          <SignInLink />
        </div>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="center margin-top-8 futura-14-300">
    Don't have an account? <Link to="/signup">Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };
