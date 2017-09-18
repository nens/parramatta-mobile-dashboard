import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import styles from "./TileContainer.css";

import { selectTile } from "../actions/";

import AssetsMap from "./AssetsMap";
import RasterMap from "./RasterMap";
import TimeseriesGraph from "./TimeseriesGraph";

class TileContainerComponent extends Component {
  constructor() {
    super();
    this.state = {
      width: null,
      height: null
    };
  }

  componentDidMount() {
    this.setDimensions();
  }

  componentDidReceiveProps() {
    this.setDimensions();
  }

  setDimensions() {
    // Some trickery to find the size of the element excluding padding, etc
    const thisElement = ReactDOM.findDOMNode(this);
    if (!thisElement) {
      console.log("DOM node not found");
      return;
    }
    const element = thisElement.parentElement;
    const style = window.getComputedStyle(element, null);
    console.log("Setting dimensions", style);
    this.setState({
      height: parseInt(style.getPropertyValue("height")),
      width: parseInt(style.getPropertyValue("width"))
    });
  }

  render() {
    const tile = this.props.tile;
    const tileType = tile.tileType;

    if (!this.state.height) {
      console.log("Not rendering, no height.");
      return <span />;
    }

    if (tileType === "rasterMap") {
      console.log("Rendering raster map");
      return (
        <RasterMap
          tile={tile}
          isThumb={this.props.isThumb}
          width={this.state.width}
          height={this.state.height}
        />
      );
    } else if (tileType === "assetsMap") {
      return (
        <AssetsMap
          tile={tile}
          width={this.state.width}
          height={this.state.height}
          isThumb={this.props.isThumb}
        />
      );
    } else if (tileType === "timeseriesGraph") {
      console.log("Rendering timeseries");
      return (
        <TimeseriesGraph
          width={this.state.width}
          height={this.state.height}
          tile={tile}
          isThumb={this.props.isThumb}
        />
      );
    } else if (!tileType) {
      console.log("Shouldn't get here.");
      return <span>{JSON.stringify(tile)}</span>;
    }
    console.log("Absolutely shouldn't get here.");
    return <span>Hmm.</span>;
  }
}

const TileContainer = connect(null, null)(TileContainerComponent);
export default translate()(TileContainer);
