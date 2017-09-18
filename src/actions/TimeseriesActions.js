import { ADD_TIMESERIES } from "../constants/ActionTypes";

export const addTimeseries = (uuid, timeseries) => {
  return {
    type: ADD_TIMESERIES,
    uuid: uuid,
    timeseries: timeseries
  };
};
