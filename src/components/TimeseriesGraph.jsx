import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { translate } from "react-i18next";
import { addTimeseries } from "../actions/TimeseriesActions";
import { getTimeseries } from "lizard-api-client";
import { LineChart, XAxis, YAxis, Line } from "recharts";
import * as d3 from "d3";

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
    console.log("[TSG] allTimeseriesHaveMetadata()", result);
    return result;
  }

  allTimeseriesHaveEvents() {
    const result = this.props.tile.timeseries.every(
      uuid =>
        this.state.eventsPerTimeseries.hasOwnProperty(uuid) &&
        !this.state.eventsPerTimeseries[uuid].fetching
    );
    console.log("[TSG] allTimeseriesHaveEvents()", result);
    return result;
  }

  componentDidMount() {
    console.log("[TSG] componentDidMount()");
    if (!this.allTimeseriesHaveMetadata()) {
      this.getAllTimeseriesMetadata();
    } else {
      this.componentDidUpdate();
    }
  }

  updateStartEnd() {
    console.log("[TSG] updateStartEnd()");
    const period = this.props.tile.period;

    let startend;
    if (period.type === "relative_to_now") {
      startend = this.startEndRelativeToNow(period);
    } else if (period.type === "all") {
      startend = this.startEndAll();
    }

    const start = startend[0];
    const end = startend[1];
    if (start !== this.state.start || end !== this.state.end) {
      this.setState({
        start: start,
        end: end,
        eventsPerTimeseries: {}
      });
    }
  }

  startEndRelativeToNow(period) {
    const now = new Date().getTime(); // is UTC
    return [
      now - (period.minSeconds || 0) * 1000,
      now + (period.maxSeconds || 0) * 1000
    ];
  }

  startEndAll() {
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
    console.log("[TSG] componentDidUpdate()");
    if (!this.allTimeseriesHaveMetadata()) {
      console.log("--- Not all timeseries have metadata");
      return; // Still waiting for requests
    }

    if (!this.state.start || !this.state.end) {
      console.log("--- Will update start end");
      this.updateStartEnd();
      return;
    }

    if (!this.allTimeseriesHaveEvents()) {
      console.log("--- Update events");
      this.props.tile.timeseries.forEach(uuid => {
        if (this.state.eventsPerTimeseries.hasOwnProperty(uuid)) {
          console.log("Uuid", uuid, "has events");
          return;
        }

        let newEvents = { ...this.state.eventsPerTimeseries };
        newEvents[uuid] = { fetching: true, events: null };
        this.setState({ eventsPerTimeseries: newEvents });
        console.log("Updating timeseries", uuid);
        console.log("Width =", this.props.width);
        this.updateTimeseries(uuid, this.state.start, this.state.end, {
          min_points: this.props.width
        });
      });
    }
  }

  getAllTimeseriesMetadata() {
    console.log("[TSG] getAllTimeseriesHaveMetadata()");
    const result = this.props.tile.timeseries.forEach(uuid => {
      this.updateTimeseries(uuid, null, null);
    });
    console.log(result);
    return result;
  }

  updateTimeseries(uuid, start, end, params) {
    console.log("[TSG] updateTimeseries()");
    getTimeseries(uuid, start, end, params).then(results => {
      console.log("[TSG] receiving timeseries", results);
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

  tickFormatter(tick) {
    return moment(tick).format("DD/MM/YY");
  }

  render() {
    console.log("[TSG] render()");
    let uuid = this.props.tile.timeseries[0];

    if (this.allTimeseriesHaveMetadata() && this.allTimeseriesHaveEvents()) {
      console.log("DATA:", this.state.eventsPerTimeseries[uuid].events);

      const xaxis = this.props.isThumb ? null : (
        <XAxis dataKey="timestamp" tickFormatter={this.tickFormatter} />
      );
      const yaxis = this.props.isThumb ? null : <YAxis />;
      const margin = this.props.isThumb ? 5 : 15;

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
          <Line type="monotone" dataKey="value" stroke="#00f" />
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
