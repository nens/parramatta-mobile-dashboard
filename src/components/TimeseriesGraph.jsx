import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { translate } from "react-i18next";
import { addTimeseries } from "../actions/TimeseriesActions";
import { getTimeseries } from "lizard-api-client";
import { Legend, LineChart, XAxis, YAxis, Line } from "recharts";
import * as d3 from "d3";
import { MAX_TIMESERIES_POINTS } from "../constants/config";

class TimeseriesGraphComponent extends Component {
  constructor() {
    super();
    this.state = {
      start: null,
      end: null,
      eventsPerTimeseries: {}
    };
  }

  allTimeseriesHaveMetadata() {
    const result = this.props.tile.timeseries.every(uuid =>
      this.props.timeseries.hasOwnProperty(uuid)
    );
    return result;
  }

  allTimeseriesHaveEvents() {
    const result = this.props.tile.timeseries.every(
      uuid =>
        this.state.eventsPerTimeseries.hasOwnProperty(uuid) &&
        !this.state.eventsPerTimeseries[uuid].fetching
    );
    return result;
  }

  componentDidMount() {
    if (!this.allTimeseriesHaveMetadata()) {
      this.getAllTimeseriesMetadata();
    } else {
      this.componentDidUpdate();
    }
  }

  updateStartEnd() {
    const period = this.props.tile.period;

    const startDatetime = period[0];
    const endDatetime = period[1];

    let startOfTs = null;
    let endOfTs = null;

    if (startDatetime.needsStartEnd() || endDatetime.needsStartEnd()) {
      let startendOfTs = this.startEndOfTs();
      startOfTs = startendOfTs[0];
      endOfTs = startendOfTs[1];
    }

    const startTimestamp = startDatetime.asTimestamp(startOfTs, endOfTs);
    const endTimestamp = endDatetime.asTimestamp(startOfTs, endOfTs);

    if (
      startTimestamp !== this.state.start ||
      endTimestamp !== this.state.end
    ) {
      this.setState({
        start: startTimestamp,
        end: endTimestamp,
        eventsPerTimeseries: {}
      });
    }
  }

  startEndOfTs() {
    // Get minimum start and maximum end of all timeseries
    let start = null;
    let end = null;
    this.props.tile.timeseries.forEach(uuid => {
      if (start === null) {
        start = this.props.timeseries[uuid].start;
      } else {
        start = Math.min(start, this.props.timeseries[uuid].start);
      }
      if (end === null) {
        end = this.props.timeseries[uuid].end;
      } else {
        end = Math.max(end, this.props.timeseries[uuid].end);
      }
    });
    return [start, end];
  }

  componentDidUpdate() {
    if (!this.allTimeseriesHaveMetadata()) {
      return; // Still waiting for requests
    }

    if (!this.state.start || !this.state.end) {
      this.updateStartEnd();
      return;
    }

    if (!this.allTimeseriesHaveEvents()) {
      this.props.tile.timeseries.forEach(uuid => {
        if (this.state.eventsPerTimeseries.hasOwnProperty(uuid)) {
          return;
        }

        let newEvents = { ...this.state.eventsPerTimeseries };
        newEvents[uuid] = { fetching: true, events: null };
        this.setState({ eventsPerTimeseries: newEvents });
        this.updateTimeseries(uuid, this.state.start, this.state.end, {
          min_points: Math.min(this.props.width, MAX_TIMESERIES_POINTS)
        });
      });
    }
  }

  getAllTimeseriesMetadata() {
    const result = this.props.tile.timeseries.forEach(uuid => {
      this.updateTimeseries(uuid, null, null);
    });
    return result;
  }

  tickFormatter(tick) {
    return moment(tick).format("DD/MM/YY");
  }

  updateTimeseries(uuid, start, end, params) {
    getTimeseries(uuid, start, end, params).then(results => {
      if (results && results.length) {
        if (!this.props.timeseries[uuid]) {
          this.props.addTimeseriesToState(uuid, results[0]);
        }
        if (start && end) {
          let newEvents = { ...this.state.eventsPerTimeseries };
          newEvents[uuid] = { fetching: false, events: results[0].events };
          this.setState({ eventsPerTimeseries: newEvents });
        }
      }
    });
  }

  render() {
    let uuid = this.props.tile.timeseries[0];

    if (this.allTimeseriesHaveMetadata() && this.allTimeseriesHaveEvents()) {
      const xaxis = this.props.isThumb ? null : (
        <XAxis dataKey="timestamp" tickFormatter={this.tickFormatter} />
      );
      const yaxis = this.props.isThumb ? null : <YAxis />;
      const margin = this.props.isThumb ? 5 : 15;
      const legend = this.props.isThumb ? null : (
        <Legend verticalAlign="bottom" height={36} />
      );
      return (
        <LineChart
          width={this.props.width - margin}
          height={this.props.height - margin}
          data={this.state.eventsPerTimeseries[uuid].events}
          margin={{
            top: margin,
            bottom: margin,
            left: 2 * margin,
            right: 2 * margin
          }}
        >
          {xaxis}
          {yaxis}
          <Line
            name={this.props.timeseries[
              uuid
            ].observation_type.getLegendString()}
            type="monotone"
            dataKey="value"
            stroke="#00f"
          />
          {legend}
        </LineChart>
      );
    } else {
      return <span>No timeseries.</span>;
    }
  }
}

function mapStateToProps(state) {
  return {
    timeseries: state.timeseries
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addTimeseriesToState: (uuid, timeseries) =>
      dispatch(addTimeseries(uuid, timeseries))
  };
}

const TimeseriesGraph = connect(mapStateToProps, mapDispatchToProps)(
  TimeseriesGraphComponent
);

export default translate()(TimeseriesGraph);
