import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import styles from "./Tile.css";

import { selectTile } from "../actions/";

class TileComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
  }

  render() {
    const divStyle = {
      backgroundImage: `url('${this.props.tile.imageUrl}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "rgba(246,246,246,0.75)"
    };

    return (
      <div
        className={styles.repocontainer + " grid-item"}
        style={{ float: "left" }}
        key={this.props.tile.key}
      >
        <div className="repo" onClick={this.select}>
          <div className="repo-header" style={{ marginBottom: 5 }}>
            <h2 className={styles.title}>
              <a className={styles.repolink}>
                {this.props.tile.title}
              </a>
            </h2>
          </div>
          <div className={styles.picture} style={divStyle} />
        </div>
      </div>
    );
  }

  select() {
    console.log("Click!", this.props.tile.key);
    this.props.selectTile(this.props.tile.key);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectTile: tileKey => dispatch(selectTile(tileKey))
  };
}

const Tile = connect(null, mapDispatchToProps)(TileComponent);
export default translate()(Tile);
