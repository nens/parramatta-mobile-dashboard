import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Isotope from "isotope-layout";

import { loadTiles } from "../store/initialization";
import { selectTile, closeTile } from "../actions/";

import styles from "./App.css";

import NewTile from "./NewTile";

const MINIMUM_WIDTH_TO_SHOW_POWERPOINT_TILES = 700; //px
const POWERPOINT_WIDTH = 250; //px

import { fetchBootstrap } from "../actions/";

class AppComponent extends Component {
  constructor(props) {
    super(props);
    // Store dimensions on state so we can re-render if they change
    this.state = this.getDimensions();
  }

  getDimensions() {
    const root = document.getElementById("root");
    return {
      width: root.clientWidth,
      height: root.clientHeight
    };
  }

  updateDimensions() {
    this.setState(this.getDimensions());
  }

  componentDidMount() {
    this.props.fetchBootstrap(this.props.sessionState);
    this.props.loadTiles();

    window.addEventListener("resize", this.updateDimensions.bind(this));

    if (document.getElementById("isotopetiles")) {
      this.iso = new Isotope("#isotopetiles", {
        layoutMode: "fitRows"
      });
    }
  }

  getSmallTiles() {
    return this.props.tileKeys.map(key => {
      const tile = this.props.tiles[key];

      return (
        <div
          className={styles.repocontainer + " grid-item"}
          style={{ float: "left" }}
          key={key}
        >
          <div className="repo" onClick={() => this.props.selectTile(key)}>
            <div className="repo-header" style={{ marginBottom: 5 }}>
              <h2 className={styles.title}>
                <a className={styles.repolink}>{tile.title}</a>
              </h2>
            </div>
            <div className={styles.picture}>
              <NewTile
                key={key}
                tile={tile}
                width={this.state.width}
                height={this.state.height}
                closeTile={this.props.closeTile}
                isThumb={true}
              />
            </div>
          </div>
        </div>
      );
    });
  }

  getLargeTile(tile, isPowerPoint) {
    let widthStyle = isPowerPoint
      ? `calc(100% - ${POWERPOINT_WIDTH}px)`
      : "100%";
    console.log("widthStyle: ", widthStyle);
    return (
      <div
        className={styles.tilecontentFullscreen}
        style={{
          width: widthStyle,
          height: "100vh"
        }}
      >
        <div className={styles.tileHeader}>
          <span onClick={this.props.closeTile}>&times;</span>
          {tile.title}
        </div>

        <div id={"tilecontent" + tile.key} className={styles.tileMain}>
          <NewTile
            tile={tile}
            width={this.state.width}
            height={this.state.height}
            closeTile={this.props.closeTile}
            isThumb={false}
          />
        </div>
      </div>
    );
  }

  render() {
    const tileChosen = !!this.props.currentTile;
    const screenIsSmall =
      this.state.width < MINIMUM_WIDTH_TO_SHOW_POWERPOINT_TILES;

    if (!this.props.sessionState.hasBootstrap) {
      return <p>Waiting for session information...</p>;
    }

    if (tileChosen && screenIsSmall) {
      // Just show the tile content
      const tile = this.props.tiles[this.props.currentTile];
      console.log("Tile = ", tile);
      return this.getLargeTile(tile, false);
    } else {
      const tiles = this.getSmallTiles();

      if (tileChosen) {
        const tile = this.props.tiles[this.props.currentTile];
        const largeTile = this.getLargeTile(tile, true);

        // Show both ("Powerpoint style")
        return (
          <div id="app" style={{ width: "100%", height: "100vh" }}>
            <div
              id="verticaltiles"
              style={{
                float: "left",
                width: POWERPOINT_WIDTH,
                height: "100vh",
                overflow: "auto"
              }}
            >
              {tiles}
            </div>
            {largeTile}
          </div>
        );
      } else {
        // Show all tiles using Isotope
        return (
          <div id="app">
            <div id="isotopetiles">{tiles}</div>
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    tiles: state.tiles,
    tileKeys: state.ui.tileKeys,
    currentTile: state.ui.currentTile,
    sessionState: state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTiles: () => loadTiles(dispatch),
    fetchBootstrap: sessionState => fetchBootstrap(dispatch, sessionState),
    selectTile: tileKey => dispatch(selectTile(tileKey)),
    closeTile: () => dispatch(closeTile())
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default translate()(App);
