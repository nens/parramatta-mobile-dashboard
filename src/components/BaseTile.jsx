import React, { Component } from "react";
import { BOUNDS } from "../constants/config";

export default class BaseTile extends Component {
  getBbox() {
    // Either get it from the tile or return the global constant.
    if (this.props && this.props.tile && this.props.tile.bbox) {
      return this.props.tile.bbox;
    }
    return BOUNDS;
  }
}
