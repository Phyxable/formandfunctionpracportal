import React, { Component } from 'react'
import './styles.css'
import HomePageNavBar from '../HomePage/HomePageNavBar';
import VAS from '../HomePage/assets/icons/vas_complete.svg';
import { withAuthorization } from '../../Components/Auth/Session';
import SignOutButton from '../../Components/Auth/SignOut';
import { Link } from 'react-router-dom';

class ProfilePage extends Component {
    render(){
        return this.props.userProfile ?(
            <div className="center">
                <HomePageNavBar />
                <div className="ui top attached tabular menu">
                <Link to='/home'><div className="item">Home</div></Link>
                <Link to='/history'><div className="item">History</div></Link>
                <div className="active item">Profile</div>
            </div>
                <div className="margin-top-64">
                    <div className="margin-top-32">
                        <img src={VAS} style={{ width:'300px' }}/>
                    </div>
                    <div className="futura-20-900">
                        {this.props.userProfile.name}
                    </div>
                    <div className="futura-16-300 margin-top-16">   
                        {this.props.userProfile.email}
                    </div>
                </div>
                <div className="bottom-button">
                <SignOutButton
                    revert={() => {
                    this.props.revert();
                    }}
                    uid={this.props.uid}
                    />
                </div>
            </div>
        ) : (<div>Loading...</div>)
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(ProfilePage);