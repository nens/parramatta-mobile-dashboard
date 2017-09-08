import { ADD_ASSET } from "../constants/ActionTypes";

export const addAsset = (assetType, id, instance) => {
  return {
    type: ADD_ASSET,
    assetType: assetType,
    id: id,
    instance: instance
  };
};
