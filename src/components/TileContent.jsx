import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import styles from "./TileContent.css";

import { closeTile } from "../actions/TileActions";
import RasterMap from "./RasterMap";

class TileContentComponent extends Component {
  render() {
    const tile = this.props.tiles[this.props.tileKey];
    const tileType = tile.tileType;
    let tileContent;

    if (tileType === "rasterMap") {
      const bounds = this.props.bootstrap.getBounds();
      console.log("Bounds:", bounds);
      tileContent = (
        <RasterMap
          tile={tile}
          bounds={this.props.bootstrap.getBounds()}
          rasters={this.props.rasters}
        />
      );
    } else if (!tileType) {
      tileContent = JSON.stringify(tile);
    }

    return (
      <div
        className={styles.tilecontentFullscreen}
        style={{
          width: this.props.width,
          height: "100vh" // Don't know why it only works with this
        }}
      >
        <div className={styles.tileHeader}>
          <span onClick={this.props.closeTile}>&times;</span>
          {tile.title}
        </div>

        <div
          id={"tilecontent" + this.props.tileKey}
          className={styles.tileMain}
        >
          {tileContent}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    closeTile: () => dispatch(closeTile())
  };
}

function mapStateToProps(state) {
  return {
    tiles: state.tiles,
    bootstrap: state.session.bootstrap,
    rasters: state.rasters
  };
}

const TileContent = connect(mapStateToProps, mapDispatchToProps)(
  TileContentComponent
);
export default translate()(TileContent);
