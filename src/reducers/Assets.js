import * as ActionTypes from "../constants/ActionTypes";
import { initialAssetsState } from "../store/Store";

export default function(state = initialAssetsState, action) {
  let newState;
  let newAssets;

  switch (action.type) {
    case ActionTypes.ADD_ASSET:
      const newAssets = { ...state };
      const newAssetsOfType = { ...newAssets[action.assetType] };
      newAssetsOfType[action.id] = action.instance;
      newAssets[action.assetType] = newAssetsOfType;
      return newAssets;
    default:
      return state;
  }
}
