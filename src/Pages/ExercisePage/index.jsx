import React, { Component } from 'react';
import './styles.css';
import { withAuthorization } from '../../Components/Auth/Session';
import Exercises from './Exercises';
import BACK_BUTTON from "../HomePage/assets/icons/arrow_back.svg"
import HomePageNavBar from '../HomePage/HomePageNavBar';
import { Link } from 'react-router-dom';

class ExercisePage extends Component {
    constructor(props) {
        super(props);
    }

    render(){

    return (
    <div>
    <HomePageNavBar />
    <div className="ui top attached tabular menu">
        <div className="active item">Home</div>
        <Link to='/history'><div className="item">History</div></Link>
        <Link to='/profile'><div className="item">Profile</div></Link>
        </div>
    <div className='margin-top-8'>
        <Link to = '/home'>
        <img src={BACK_BUTTON}
            style={{ cursor: 'pointer', padding: '16px' }} 
        ></img>
        </Link>
        </div>
    <div className="container">
      <Exercises
        selected_users={this.props.location.state ? this.props.location.state.selected_users : null}
        videos={this.props.videos}
        videosCategory={this.props.videosCategory}
      />
      </div>
    </div>
    );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(ExercisePage);