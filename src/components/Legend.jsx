import { connect } from "react-redux";
import React, { Component } from "react";
import { translate } from "react-i18next";
import styles from "./Legend.css";
import { getLegend } from "../actions/LegendActions";

class LegendComponent extends Component {
  componentWillMount() {
    if (!this.props.legends[this.props.uuid]) {
      this.props.getLegend(
        this.props.uuid,
        this.props.wmsInfo,
        this.props.styles
      );
    }
  }

  legendData() {
    if (this.props.legends[this.props.uuid]) {
      return this.props.legends[this.props.uuid].data;
    }
  }

  render() {
    console.log("Rendering Legend...");
    const data = this.legendData();
    console.log("Data = ", data);
    if (!data) return null;

    const rows = data.legend.map(legendLine => {
      return (
        <tr key={legendLine.value}>
          <td style={{ width: 100, backgroundColor: legendLine.color }} />
          <td style={{ textAlign: "right" }}>{legendLine.value.toFixed(1)}</td>
        </tr>
      );
    });

    return (
      <div className={styles.legend}>
        <h1>
          {this.props.title}
          {this.props.observationType ? (
            this.props.observationType.getLegendString()
          ) : (
            ""
          )}
        </h1>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    legends: state.legends
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLegend: (uuid, wmsInfo, styles) =>
      getLegend(dispatch, uuid, wmsInfo, styles)
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(LegendComponent)
);
