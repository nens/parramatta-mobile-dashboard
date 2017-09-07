import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Isotope from "isotope-layout";

import { loadTiles } from "../store/initialization";

import styles from "./App.css";

import Tile from "./Tile";
import TileContent from "./TileContent";

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

  render() {
    const tileChosen = !!this.props.currentTile;
    const screenIsSmall =
      this.state.width < MINIMUM_WIDTH_TO_SHOW_POWERPOINT_TILES;

    if (!this.props.sessionState.hasBootstrap) {
      return <p>Waiting for session information...</p>;
    }

    if (tileChosen && screenIsSmall) {
      // Just show the tile content
      return (
        <div id="app" className={styles.fullHeight}>
          <TileContent
            tileKey={this.props.currentTile}
            width={this.state.width}
          />
        </div>
      );
    } else {
      let tiles = this.props.tileKeys.map(
        function(key) {
          const tile = this.props.tiles[key];
          return <Tile key={key} tile={tile} />;
        }.bind(this)
      );

      if (tileChosen) {
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
            <TileContent
              tileKey={this.props.currentTile}
              width={this.state.width - POWERPOINT_WIDTH}
            />
          </div>
        );
      } else {
        // Show all tiles using Isotope
        return (
          <div id="app">
            <div id="isotopetiles">
              {tiles}
            </div>
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
    fetchBootstrap: sessionState => fetchBootstrap(dispatch, sessionState)
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default translate()(App);
