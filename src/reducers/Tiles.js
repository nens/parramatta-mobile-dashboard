import * as ActionTypes from "../constants/ActionTypes";
import { initialTilesState } from "../store/Store";

export default function(state = initialTilesState, action) {
  switch (action.type) {
    case ActionTypes.ADD_TILE:
      let newState = { ...state };
      newState[action.tileKey] = action.tile;
      return newState;
    default:
      return state;
  }
}
