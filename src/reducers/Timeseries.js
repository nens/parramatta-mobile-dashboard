import * as ActionTypes from "../constants/ActionTypes";
import { initialTimeseriesState } from "../store/Store";

export default function(state = initialTimeseriesState, action) {
  switch (action.type) {
    case ActionTypes.ADD_TIMESERIES:
      const newState = { ...state };
      newState[action.uuid] = action.timeseries;
      return newState;
    default:
      return state;
  }
}
