import { ADD_TIMESERIES } from "../constants/ActionTypes";
import { getTimeseries } from "lizard-api-client";

export const addTimeseries = (uuid, timeseries) => {
  return {
    type: ADD_TIMESERIES,
    uuid: uuid,
    timeseries: timeseries
  };
};

export function updateTimeseriesMetadata(dispatch, uuid) {
  // Get timeseries with uuid, update its metadata. Does not
  // pass a start and end time, so does not receive any events,
  // although the metadata may contain a last value.
  getTimeseries(uuid).then(results => {
    if (results && results.length) {
      dispatch(addTimeseries(uuid, results[0]));
    }
  });
}
