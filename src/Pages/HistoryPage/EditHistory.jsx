import React, { Component } from 'react';
import './styles.css';
import HomePageNavBar from '../HomePage/HomePageNavBar';
import SET_1 from "../HomePage/assets/icons/sets_1.png";
import SET_2 from "../HomePage/assets/icons/sets_2.png";
import SET_3 from "../HomePage/assets/icons/sets_3.png";
import USER from '../HomePage/assets/icons/user.png'
import setsRepsData from '../../Constants/setsRepsData';

class EditHistory extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null, showData: false }
    }

    async componentDidMount(){
        const response = await fetch(`https://stgpractitioner.phyxable.com/api/playlists`);
        const data = await response.json();
        this.setState({ data: data })
    }

    render(){
        console.log(this.props.props.match.params.id)
        const id = this.props.props.match.params.id;
        console.log(this.props)
        console.log(this.state.data && this.state.data[this.props.props.match.params.id])
        //console.log(this.props.playlist[this.props.props.match.params.id])

        const { options_type, options_sets, options_reps, options_time } = setsRepsData;

        return(
            <div> 
                <HomePageNavBar/>
                
            </div>
        )
    }
}

export default EditHistory;