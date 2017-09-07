import * as ActionTypes from "../constants/ActionTypes";
import { initialRastersState } from "../store/Store";

import omit from "lodash/omit";

export default function(state = initialRastersState, action) {
  let newState;
  let newRaster;

  switch (action.type) {
    case ActionTypes.FETCH_RASTER:
      newState = { ...state };

      if (action.uuid in newState) {
        newRaster = { ...newState[action.uuid] };
      } else {
        newRaster = {
          isFetching: false,
          data: null,
          error: null
        };
      }
      newRaster.isFetching = true;
      newState[action.uuid] = newRaster;
      return newState;
    case ActionTypes.RECEIVE_RASTER:
      newState = { ...state };
      newRaster = { ...newState[action.uuid] };
      newRaster.isFetching = false;
      if (action.data === null) {
        newRaster.data = null;
        newRaster.error = "Error while fetching raster!";
      } else {
        newRaster.data = action.data;
        newRaster.error = null;
      }
      newState[action.uuid] = newRaster;
      return newState;
    case ActionTypes.REMOVE_RASTER:
      return omit(state, action.uuid);
    default:
      return state;
  }
}
