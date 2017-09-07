import * as ActionTypes from "../constants/ActionTypes";
import { initialUiState } from "../store/Store";

export default function(state = initialUiState, action) {
  let newState;

  switch (action.type) {
    case ActionTypes.ADD_TILE:
      // Add tile key to tileKeys
      if (state.tileKeys.indexOf(action.tileKey) === -1) {
        let newState = { ...state };
        let newTileKeys = state.tileKeys.slice();
        newTileKeys.push(action.tileKey);
        newState.tileKeys = newTileKeys;
        return newState;
      } else {
        return state;
      }
    case ActionTypes.SELECT_TILE:
      newState = { ...state };
      newState.currentTile = action.tileKey;
      return newState;
    case ActionTypes.CLOSE_TILE:
      newState = { ...state };
      newState.currentTile = null;
      return newState;
    default:
      return state;
  }
}
