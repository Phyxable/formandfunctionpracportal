import React from 'react';
import { withAuthorization } from "../../Components/Auth/Session";
import './App.css';
import { Redirect, Link } from 'react-router-dom';
import HomePageNavBar from './HomePageNavBar';
import SearchBar from './SearchBar';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_users: [],
      filterDisplay: [],
      loading: true,
      showingList: false
    };
    setTimeout(() => {
      this.setState({ loading: false });
    }, 50);
  }

  handleUserData = (selected_users, filterDisplay) => {
    this.setState({ 
      selected_users: selected_users,
      filterDisplay: filterDisplay,
      showingList: true
    });
  }

  render() {
    if(this.state.showingList && this.state.selected_users != []){
      return (
        <Redirect
          to={{
            pathname: "/exercise",
            state: {
              selected_users: this.state.selected_users !== null ? this.state.selected_users : null, 
              uid: this.props.uid.uid
            }
          }}
          push
        />
      );
    }

    return( 
    <div>
        <HomePageNavBar />
        <div className="ui top attached tabular menu">
        <div className="active item">Home</div>
        <Link to='/history'><div className="item">History</div></Link>
        <Link to='/profile'><div className="item">Profile</div></Link>
        </div>
          <div className="container margin-top-32">
                <SearchBar handleUserData={this.handleUserData} users={this.props.users}/>
          </div>
    </div>
  );
}
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);
