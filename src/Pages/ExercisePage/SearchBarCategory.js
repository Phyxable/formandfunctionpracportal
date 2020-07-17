import React, { Component } from "react";
import EXIT from "../HomePage/assets/icons/black_xbutton.svg";
const JWPlatformAPI = require("jwplatform");
const jwApi = new JWPlatformAPI({
  apiKey: "66HeDPE4",
  apiSecret: "rTgQgBeYmDl914zKUJGS17rH",
});

class SearchBarCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      wordVideo: "",
      filterDisplay: "",
      filterDisplayVideos: "",
      tags: null,
    };
  }

  componentDidMount() {
    this.setState({
      filterDisplay: this.props.categories[0],
      filterDisplayVideos: this.props.videos[0],
    });
  }

  handleVideoCategoryChange = (selectedCategory) => {
    jwApi.videos
      .list({ result_limit: 1000, tags: selectedCategory.name })
      .then((response) =>
        this.setState({
          filterDisplayVideos: response.videos,
          tags: selectedCategory,
        })
      );
  };

  handleChange = (e) => {
    let oldList = this.props.categories[0];

    if (e !== "") {
      let newList = [];
      this.setState({ word: e.toLowerCase() });
      newList = oldList.filter((categories) => {
        return Object.keys(categories).some((key) =>
          categories.name !== null
            ? categories.name.toLowerCase().includes(this.state.word)
            : categories
        );
      });
      this.setState({ filterDisplay: newList });
    } else {
      this.setState({ filterDisplay: this.props.categories[0] });
    }
  };

  handleChangeVideos = (e) => {
    let oldList = this.props.videos[0];

    if (e !== "") {
      let newList = [];
      this.setState({ wordVideo: e.toLowerCase() });
      newList = oldList.filter((titles) => {
        return Object.keys(titles).some((key) =>
          titles.title !== null
            ? titles.title.toLowerCase().includes(this.state.wordVideo)
            : titles
        );
      });
      this.setState({ filterDisplayVideos: newList });
    } else {
      this.setState({ filterDisplayVideos: this.props.videos[0] });
    }
  };

  render() {
    return (
      <div className="video-screen">
        <div className="exit-button">
          <img
            src={EXIT}
            onClick={() => {
              this.props.handleCloseAddItem();
            }}
            width="20px"
          ></img>
        </div>
        <div id="left">
          {/* <input placeholder='Search Categories...' onChange={e => this.handleChange(e.target.value)} /> */}
          {this.state.tags === null ? (
            <ul style={{ cursor: "pointer" }} className="futura-14-900">
              All ({this.props.videos[0].length})
            </ul>
          ) : (
            <ul
              style={{ cursor: "pointer" }}
              className="futura-14-300"
              onClick={() => {
                this.setState({
                  filterDisplayVideos: this.props.videos[0],
                  tags: null,
                });
              }}
            >
              All ({this.props.videos[0].length})
            </ul>
          )}
          {this.state.filterDisplay !== "" ? (
            this.state.filterDisplay.map((categories, j) =>
              this.state.tags ? (
                categories.name === this.state.tags.name ? (
                  <ul
                    style={{ cursor: "pointer" }}
                    key={categories.name}
                    className="futura-14-900"
                  >
                    {categories.name} ({categories.videos})
                  </ul>
                ) : (
                  <ul
                    style={{ cursor: "pointer" }}
                    key={categories.name}
                    className="futura-14-300"
                    onClick={() => {
                      this.handleVideoCategoryChange(categories);
                    }}
                  >
                    {categories.name} ({categories.videos})
                  </ul>
                )
              ) : (
                <ul
                  style={{ cursor: "pointer" }}
                  key={categories.name}
                  className="futura-14-300"
                  onClick={() => {
                    this.handleVideoCategoryChange(categories);
                  }}
                >
                  {categories.name} ({categories.videos})
                </ul>
              )
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div id="right">
          <center>
            <input
              className="search-bar"
              placeholder="Search Videos..."
              onChange={(e) => this.handleChangeVideos(e.target.value)}
            />
            {this.state.tags ? (
              <div className="margin-top-16">
                <div className="futura-20-900">{this.state.tags.name}</div>
                <div className="futura-16-300">
                  {this.state.tags.videos} VIDEOS
                </div>
              </div>
            ) : (
              <div className="margin-top-16">
                <div className="futura-20-900">All</div>
                <div className="futura-16-300">
                  {this.props.videos[0].length} VIDEOS
                </div>
              </div>
            )}
          </center>
          {this.state.filterDisplayVideos.length !== 0 ? (
            this.state.filterDisplayVideos &&
            this.state.filterDisplayVideos.map((titles, j) => (
              <ul key={titles.key} className="grid">
                <li className="video-card playWrapper">
                  <a
                    onClick={() => {
                      this.props.handleVideoChange(titles);
                    }}
                  >
                    <div
                      data-tooltip={titles.title}
                      data-position="top left"
                      data-inverted=""
                    >
                      <img
                        src={`https://cdn.jwplayer.com/thumbs/${titles.key}-320.jpg`}
                      ></img>
                      <span className="playBtn">
                        <img
                          src="http://wptf.com/wp-content/uploads/2014/05/play-button.png"
                          width="50"
                          height="50"
                          alt=""
                        ></img>
                      </span>
                      <h2>
                        {titles.title.length <= 20
                          ? titles.title
                          : `${titles.title.slice(0, 19)}...`}
                      </h2>
                    </div>
                  </a>
                </li>
              </ul>
            ))
          ) : (
            <div className="center margin-top-32 futura-14-300 gray">
              No videos found
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchBarCategory;
