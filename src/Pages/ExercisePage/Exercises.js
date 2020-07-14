import React, {Component} from 'react';
import ReactJWPlayer from "react-jw-player";
import EXIT from "../HomePage/assets/icons/black_xbutton.svg";
import { Dropdown } from 'semantic-ui-react';
import SET_1 from "../HomePage/assets/icons/sets_1.png";
import SET_2 from "../HomePage/assets/icons/sets_2.png";
import SET_3 from "../HomePage/assets/icons/sets_3.png";
import CLOSE_BUTTON from "../HomePage/assets/icons/close-button.png";
import { Redirect } from 'react-router-dom';
import setsRepsData from '../../Constants/setsRepsData';
import SearchBarCategory from './SearchBarCategory';
import SearchBarVideos from './SearchBarVideos';
import ADD_BUTTON from '../HomePage/assets/icons/add-button.svg';
const JWPlatformAPI = require('jwplatform');
const jwApi = new JWPlatformAPI({ apiKey: '66HeDPE4', apiSecret: 'rTgQgBeYmDl914zKUJGS17rH'});
   
class Exercises extends Component {
    constructor(props){
        super(props);

        const initialMediaList = JSON.parse(localStorage.media_list || '[]');
        const initialProgramName = localStorage.programName || '';

        this.state = { videos: [] , selectedOption: null, addItem: false, showVideo: false, 
            playlist: '', sets: 1, reps: 1, time: 30, type: 'reps', mediaId: '', media_list: initialMediaList, noteEditing: null,
            data: [], programName: initialProgramName, redirect: false, redirectHome: false, titles: [], showSearchVideo: false, showSearchCategory: false };
    }

    componentDidMount(){
        this.setState({  data: this.props.data });
    }

  handleClick = (item) => {

    console.log(item);
    for(var i in item){
      this.state.media_list.push(item[i]);
    }
    this.setState({ addItem: true, showSearchCategory: true });
  }

   handleVideoCategoryChange = selectedCategory => {
    jwApi.videos.list({ result_limit:1000, tags: selectedCategory })
    .then(response => this.setState({ titles: response.videos }))
    .then(() => {
        this.setState({ showSearchVideo: true });
    });
  }

    handleVideoChange = selectedOption => {
        this.setState(
          { selectedOption },
          () => fetch(`https://cdn.jwplayer.com/v2/media/${selectedOption.key}`)
          .then(res => res.json())
          .then(
              (result) => {
              this.setState({ playlist: result.playlist })
              },
              (error) => {
              console.log(error)
              }),
              this.setState({ showVideo: true })
        );
        
    };

    handleSetsChange = ((event, data) => {
        this.setState({ sets: data.value });
      });

    handleRepsChange = ((event, data) => {
        this.setState({ reps: data.value });
    });
    
    handleTimesChange = ((event, data) => {
        this.setState({ time: data.value });
    });

    handleTypeChange = ((event, data) => {
        this.setState({ type: data.value,  });
    });

    handleProgramNameChange = (event => {
        this.setState({ programName: event.target.value });
        localStorage.setItem('programName', event.target.value);
    });

    handleCloseAddItem = () => {
        this.setState({ addItem: false })
    }

    handleCloseVideoTab = () => {
        this.setState({ showSearchCategory: true, showSearchVideo: false })
    }

    handleSubmit = async event => {
        this.setState({ redirect: true })
    }

    handleSubmitMediaData = () => {
        if(this.state.type === "reps"){
            this.state.media_list.push({
                title: this.state.selectedOption.title,
                mediaId: this.state.selectedOption.key,
                sets: this.state.sets,
                reps: this.state.reps,
                time: null,
                type: this.state.type
            });
        } else {
            this.state.media_list.push({
                title: this.state.selectedOption.title,
                mediaId: this.state.selectedOption.key,
                sets: this.state.sets,
                time: this.state.time,
                reps: null,
                type: this.state.type
            });
        }
        
        // Note that media_list is being updated directly by manipulating the array with a push,
        // Ideally it should be updated using setState. Updating manually can lead to unexpected
        // behaviour.
        localStorage.setItem('media_list', JSON.stringify(this.state.media_list));

        this.setState({ 
            showVideo: false, 
            addItem: false,
            showSearchVideo: false, 
            addList: true ,
            sets: 1, 
            type: 'reps',
            reps: 1
        });
    }

    removeItem(indexToDelete) {
        let media_list = [...this.state.media_list].filter(
            (item, index) => index !== indexToDelete
          );
          this.setState({ media_list });
          localStorage.setItem('media_list', JSON.stringify(media_list));
      }

      setNoteEditing = (item,index) => {
        fetch(`https://cdn.jwplayer.com/v2/media/${item.mediaId}`)
          .then(res => res.json())
          .then(
              (result) => {
              this.setState({ playlist: result.playlist })
              },
              (error) => {
              console.log(error)
              });
        if(item.type === "reps"){
            this.setState({ 
                noteEditing: index,
                sets: item.sets, 
                reps: item.reps, 
                type: item.type 
            });
        } 
        else {
            this.setState({ 
                noteEditing: index,
                sets: item.sets, 
                time: item.time, 
                type: item.type 
            });
        }
        
      };
      
      submitEdit = (item,index) => {
        let media_list = [...this.state.media_list];
        if(this.state.type === "reps"){
            media_list[index] = ({ 
                title: item.title,
                mediaId: item.mediaId,
                sets: this.state.sets,
                time: null, 
                reps: this.state.reps, 
                type: this.state.type 
            });
        } else {
            media_list[index] = ({ 
                title: item.title,
                mediaId: item.mediaId,
                sets: this.state.sets, 
                time: this.state.time, 
                reps: null,
                type: this.state.type 
            });
        }
        
        this.setState({ media_list, noteEditing: null, sets: 1, type: 'reps', reps: 1 });
        localStorage.setItem('media_list', JSON.stringify(media_list));
      };

    render(){
        const { options_type, options_sets, options_reps, options_time } = setsRepsData;
        console.log(localStorage)

        if(this.state.redirect){
            return (
                <Redirect
                  to={{
                    pathname: "/review",
                    state: {
                        media_list: this.state.media_list,
                        selected_users: this.props.selected_users,
                        program_name: this.state.programName
                    }
                  }}
                  push
                />
              );
        }

        return (
            <div className="futura-16-300">
            <input
                type="text"
                placeholder="Name Custom Plan"
                value={this.state.programName}
                required
                onChange={this.handleProgramNameChange}
            />
            {/* {this.state.data !== '' ? 
                this.state.data.map((item, index) => {
                    return(<div key={index}>
                    <button onClick={() => { this.handleClick(item.playlist) }}>
                    {item.program_name}
                    </button></div>)
                }) : 
                <div/>
            } */}
            <div className='center margin-top-16 futura-16-300'>
            You can add or edit<br/>
            exersices to the existing program below. </div>
            <div className='margin-top-16' />
            {this.state.media_list.map((item, index) => (
            <div className="notes" key={index}>
            {this.state.noteEditing === null ||
            this.state.noteEditing !== index ? (
            <div draggable className="exercises-container">
            <div className="flex-row margin-top-8">
          <>
            <div className="flex-1" style={{ maxWidth: "64px" }}>
              <img
                className="sets-pic"
                src={item.sets === 1 ? SET_1 : (item.sets === 2 ? SET_2 : SET_3)}
              />
            </div>
            <div
              className="flex-1 futura-14-900 padding-left-16"
            >
              {item.title}
              <br />
              <div className="sets-subtitle">
                {item.type === "reps" ? 
                options_reps[options_reps.map(function(o) { return o.value; }).indexOf(item.reps)].text : 
                options_time[options_time.map(function(o) { return o.value; }).indexOf(item.time)].text }
              </div>
            </div>
            <div className="flex-row">
            <div className="flex-1 margin-auto">
                <a  onClick={() => this.setNoteEditing(item,index)}>EDIT</a>
            </div>
            <div className="flex-1 margin-auto padding-left-8">
                <img width='36px' src={CLOSE_BUTTON} onClick={() => this.removeItem(index)} />
            </div>
            </div>
          </>
      </div>
      </div>
            ) : (
            <div className="video-screen">
                  <div className="exit-button"> 
                    <img src={EXIT} onClick={() => { this.setState({ noteEditing: null }) }}
                    width="20px">
                    </img>
                </div>

            <center>
                <div className="margin-top-16 form">
                <div className="futura-20-900">{item.title}</div>
                <ReactJWPlayer
                    className="margin-top-16"
                    playerScript="https://cdn.jwplayer.com/libraries/pmSzzbnT.js"
                    playlist= {this.state.playlist}
                    playerId="unique-id"
                />
                <form className="margin-top-16">
                <Dropdown
                    selection
                    placeholder="Select Type"
                    defaultValue={item.type}
                    onChange={this.handleTypeChange}
                    options={options_type}
                />
                <Dropdown
                    selection
                    style={{ width: '48%', float: 'left' }}
                    placeholder="Select Sets"
                    defaultValue={this.state.sets}
                    onChange={this.handleSetsChange}
                    options={options_sets}
                />
                {this.state.type === "reps" ?
                <Dropdown
                    selection
                    style={{ width: '48%', float: 'right' }}
                    placeholder="Select Reps"
                    defaultValue={this.state.reps}
                    onChange={this.handleRepsChange}
                    options={options_reps}
                /> :
                <Dropdown
                    selection
                    style={{ width: '48%', float: 'right' }}
                    placeholder="Select Time"
                    defaultValue={this.state.time}
                    onChange={this.handleTimesChange}
                    options={options_time}
                />}
                <div style={{ paddingBottom: "150px" }}  />
                    <div className="bottom-button-video">
                        <button className="button" onClick={() => {this.submitEdit(item,index)}} >SAVE</button>
                    </div>
                    </form>
                    </div>
                </center>
                </div>
        )}
        </div>
        ))}
                

            {this.state.addItem ?
                (<div>
                  
                  <div className="margin-top-16 form">
                    {this.state.showSearchCategory ? 
                    <SearchBarCategory 
                        handleCloseAddItem={this.handleCloseAddItem}
                        handleVideoCategoryChange={this.handleVideoCategoryChange}
                        handleVideoChange={this.handleVideoChange}
                        showSearchVideo={this.state.showSearchVideo}
                        videos={this.props.videos}
                        categories={this.props.videosCategory} /> : 
                    null}
                    {/* {this.state.showSearchVideo ? 
                    <SearchBarVideos 
                        titles={this.state.titles} 
                        handleVideoChange={this.handleVideoChange}
                        handleCloseVideoTab={this.handleCloseVideoTab}/> : 
                        null} */}
                </div>
                </div>) :
                (<div/>)
            }
            {this.state.addItem && this.state.showVideo ? 
                <div className="video-screen">
                  <div className="exit-button"> 
                    <img src={EXIT} onClick={() => { this.setState({ showVideo: false }) }}
                    width="20px">
                    </img>
                </div>

            <center>
                  <div className="margin-top-16 form">
                  <div className="futura-20-900">{this.state.selectedOption.title}</div>
                    <ReactJWPlayer
                        className="margin-top-16"
                        playerScript="https://cdn.jwplayer.com/libraries/pmSzzbnT.js"
                        playlist= {this.state.playlist}
                        playerId="unique-id"
                    />
                    <form className="margin-top-16">
                        <Dropdown
                            selection
                            placeholder="Select Type"
                            defaultValue={this.state.type}
                            onChange={this.handleTypeChange}
                            options={options_type}
                        />
                        <Dropdown
                            selection
                            style={{ width: '48%', float: 'left' }}
                            placeholder="Select Sets"
                            defaultValue={this.state.sets}
                            onChange={this.handleSetsChange}
                            options={options_sets}
                        />
                        {this.state.type === "reps" ?
                        <Dropdown
                            selection
                            placeholder="Select Reps"
                            style={{ width: '48%', float: 'right' }}
                            defaultValue={this.state.reps}
                            onChange={this.handleRepsChange}
                            options={options_reps}
                        /> :
                        <Dropdown
                            selection
                            placeholder="Select Time"
                            style={{ width: '48%', float: 'right' }}
                            defaultValue={this.state.time}
                            onChange={this.handleTimesChange}
                            options={options_time}
                        />}
                    <div style={{ paddingBottom: "150px" }}  />
                    <div className="bottom-button-video">
                        <button className="button" onClick={() => {this.handleSubmitMediaData()}} >SAVE</button>
                    </div>
                    </form>
                    </div>
                </center>
                </div> : null
                    }
                
                    <div className="margin-top-8 exercise-container" onClick={() => { this.setState({ addItem: true, showSearchCategory: true }) }}>
                        <div className="flex-row">
                        <div className="flex-1 add-exercises"></div>
                        <div className="flex-1 futura-14-900 margin-auto padding-left-16">
                        ADD EXERCISES
                        </div>
                    <div className="flex-row">
                    <div className="flex-1 center margin-auto">
                        <img src={ADD_BUTTON} style={{  marginRight: '8px', width: '32px' }}  />
                    </div>
                    </div>
                    </div>
                    </div>
                    <div style={{ paddingBottom: '100px' }}/>
                    <div className="bottom-button">
                        <button 
                        type="submit"
                        className="button"
                        disabled={this.state.programName === ''} 
                        onClick={this.handleSubmit}
                        >SAVE</button>
                    </div>
            </div>
        );
    }
}

export default Exercises;