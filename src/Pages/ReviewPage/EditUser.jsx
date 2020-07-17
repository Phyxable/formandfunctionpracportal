import React, { Component } from "react";
import ADD_BUTTON from "../HomePage/assets/icons/add-button.svg";
import CHECK_BUTTON from "../HomePage/assets/icons/check-button.svg";
import USER from "../HomePage/assets/icons/user.png";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      filterDisplay: "",
      selected_users: [],
    };
  }

  componentDidMount() {
    this.setState({ selected_users: this.props.selected_users });
  }

  handleChange = (e) => {
    let oldList = this.props.users;

    if (e !== "") {
      let newList = [];
      this.setState({ word: e });
      newList = oldList.filter((users) => {
        return Object.keys(users).some((key) =>
          users.email !== null ? users.email.includes(this.state.word) : users
        );
      });
      this.setState({ filterDisplay: newList });
    } else {
      this.setState({ filterDisplay: this.props.users });
    }
  };

  addItem(users, indexToAdd) {
    this.setState({ selected_users: [...this.state.selected_users, users] });
    let filterDisplay = [...this.state.filterDisplay].filter(
      (item, index) => index !== indexToAdd
    );
    this.setState({ filterDisplay });
  }

  removeItem(user, indexToDelete) {
    let selected_users = [...this.state.selected_users].filter(
      (item, index) => index !== indexToDelete
    );
    this.setState({ selected_users });
    this.setState({ filterDisplay: [...this.state.filterDisplay, user] });
  }

  render() {
    console.log(this.state.selected_users);
    return (
      <div>
        {/* <div className='center futura-20-900'>Assign Client(s)</div>
                <div className='center margin-top-8 futura-16-300'>Add or select clients E-mail</div>
                <input onChange={e => this.handleChange(e.target.value)} /> */}
        {this.state.selected_users &&
          this.state.selected_users.map((user, i) => (
            <div
              className="users-container"
              key={i}
              style={{ border: "2px solid #9EEAA7" }}
            >
              <div className="flex-row">
                <div
                  className="flex-1 center margin-auto"
                  style={{ maxWidth: "64px" }}
                >
                  {/* <i className="fa fa-user" style={{ fontSize: "24px", color:"gray" }}></i> */}
                  <img src={USER} style={{ width: "36px" }}></img>
                </div>
                <div className="flex-1 futura-14-900 margin-auto">
                  {user.name}
                  <br />
                  <div className="futura-12-300">{user.email}</div>
                </div>
                <div className="flex-row">
                  <div className="flex-1 center margin-top-2">
                    <img
                      src={CHECK_BUTTON}
                      style={{ cursor: "pointer", marginRight: "8px" }}
                      onClick={() =>
                        //this.removeItem(user,i)
                        {
                          console.log("...");
                        }
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        {/*                 
                {this.state.filterDisplay !== '' ? this.state.filterDisplay.map((users, j) => (
                    <div className="users-container">
                    <div className="flex-row">
                    <div className="flex-1 center margin-auto" style={{ maxWidth: '64px' }}>
                        <i className="fa fa-user" style={{ fontSize: "24px", color:"gray" }}></i>
                        <img src={USER} style={{ width: '36px' }}></img>
                    </div>
                    <div className="flex-1 futura-14-900 margin-auto">
                    {users.name}
                    <br />
                    <div className="futura-12-300">
                    {users.email}
                    </div>
                    </div>
                    <div className="flex-row">
                    <div className="flex-1 center margin-top-2">
                        <img src={ADD_BUTTON} style={{ cursor: 'pointer', marginRight: '8px' }} onClick={() => this.addItem(users,j) } />
                    </div>
                    </div>
                    </div>
                    </div>
                    ))
                : <div>Loading...</div>} 
                <div style={{ paddingBottom: '100px' }}/>
                <div className="bottom-button">
                <button className="button" onClick={() => {
                    this.props.handleUserData(this.state.selected_users, this.state.filterDisplay)
                }}>NEXT
                </button></div> */}
      </div>
    );
  }
}

export default EditUser;
