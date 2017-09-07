import { ADD_TILE, SELECT_TILE, CLOSE_TILE } from "../constants/ActionTypes";

export const addTile = (tileKey, tile) => {
  return {
    type: ADD_TILE,
    tileKey: tileKey,
    tile: { ...tile }
  };
};

export const selectTile = tileKey => {
  return {
    type: SELECT_TILE,
    tileKey: tileKey
  };
};

export const closeTile = () => {
  return {
    type: CLOSE_TILE
  };
};
