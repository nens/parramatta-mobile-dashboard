import * as ActionTypes from "../constants/ActionTypes";
import { initialLegendsState } from "../store/Store";

import omit from "lodash/omit";

export default function(state = initialLegendsState, action) {
  let newState;
  let newLegend;

  switch (action.type) {
    case ActionTypes.FETCH_LEGEND:
      newState = { ...state };

      if (action.uuid in newState) {
        newLegend = { ...newState[action.uuid] };
        newLegend.isFetching = true;
      } else {
        newLegend = {
          isFetching: false,
          data: null,
          error: null
        };
      }
      newState[action.uuid] = newLegend;
      return newState;
    case ActionTypes.ADD_LEGEND:
      newState = { ...state };
      newLegend = { ...newState[action.uuid] };
      newLegend.isFetching = false;
      if (action.data === null) {
        newLegend.data = null;
        newLegend.error = "Error while fetching raster!";
      } else {
        newLegend.data = action.data;
        newLegend.error = null;
      }
      newState[action.uuid] = newLegend;
      return newState;
    default:
      return state;
  }
}
