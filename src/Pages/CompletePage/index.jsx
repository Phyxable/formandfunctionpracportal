import React, { Component } from 'react'
import './styles.css'
import HomePageNavBar from '../HomePage/HomePageNavBar';
import VAS from '../HomePage/assets/icons/vas_jumping.gif';
import { Link } from 'react-router-dom';

class CompletePage extends Component {
    render(){
        return(
            <div className="center">
                <HomePageNavBar />
                <div className="margin-top-64">
                    <div className="futura-20-900">
                        Complete!
                    </div>
                    <div className="futura-16-300 margin-top-16">   
                        Your custom program has been sent to your<br/>
                        selected client(s)! 
                    </div>
                    <div className="margin-top-32">
                        <img src={VAS} style={{ width:'300px' }}/>
                    </div>
                </div>
                <div className="bottom-button">
                <Link to = '/home'>
                    <button 
                    type="submit"
                    className="gray-button"
                    >DONE</button>
                </Link>
                </div>
            </div>
        )
    }
}

export default CompletePage;