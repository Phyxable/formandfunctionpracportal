import React, { Component } from "react";
import "./styles.scss";
import EXIT from "../HomePage/assets/icons/black_xbutton.svg";

class SearchBarVideos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      filterDisplay: "",
    };
  }

  componentDidMount() {
    this.setState({ filterDisplay: this.props.titles });
  }

  handleChange = (e) => {
    let oldList = this.props.titles;

    if (e !== "") {
      let newList = [];
      this.setState({ word: e.toLowerCase() });
      newList = oldList.filter((titles) => {
        return Object.keys(titles).some((key) =>
          titles.title !== null
            ? titles.title.toLowerCase().includes(this.state.word)
            : titles
        );
      });
      this.setState({ filterDisplay: newList });
    } else {
      this.setState({ filterDisplay: this.props.titles });
    }
  };

  render() {
    console.log(this.state.filterDisplay);
    return (
      <div className="video-screen">
        <div className="exit-button">
          <img
            src={EXIT}
            onClick={() => {
              this.props.handleCloseVideoTab();
            }}
            width="20px"
          ></img>
        </div>
        <div>
          <div className="container">
            <input
              placeholder="Search Videos..."
              onChange={(e) => this.handleChange(e.target.value)}
            />
          </div>
          {this.state.filterDisplay &&
            this.state.filterDisplay.map((titles, j) => (
              <ul key={titles.key} className="grid">
                <li className="video-card">
                  <a
                    onClick={() => {
                      this.props.handleVideoChange(titles);
                    }}
                  >
                    <h2>{titles.title}</h2>
                    <img
                      src={`https://cdn.jwplayer.com/thumbs/${titles.key}-1280.jpg`}
                    ></img>
                  </a>
                </li>
              </ul>
            ))}
        </div>
      </div>
    );
  }
}

export default SearchBarVideos;
