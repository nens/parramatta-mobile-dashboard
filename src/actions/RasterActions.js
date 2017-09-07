import {
  FETCH_RASTER,
  RECEIVE_RASTER,
  REMOVE_RASTER
} from "../constants/ActionTypes";
import { theStore } from "../store/Store";
import { getRasterDetail } from "lizard-api-client";

export const fetchRaster = uuid => {
  return {
    type: FETCH_RASTER,
    uuid
  };
};

const receiveRaster = (uuid, data) => {
  return {
    type: RECEIVE_RASTER,
    uuid,
    data
  };
};

export const removeRaster = uuid => {
  return {
    type: REMOVE_RASTER,
    uuid
  };
};

export function getRaster(uuid, dispatch) {
  const currentData = theStore.getState().rasters[uuid];

  if (currentData) {
    if (currentData.data) {
      // Already present.
      return true;
    }
    if (currentData.isFetching || currentData.error) {
      // It's not there, but we're not going to do anything either.
      return false;
    }
  }

  // We need to go fetch it.

  // Set isFetching to true.
  dispatch(fetchRaster(uuid));
  // Send a request, store the resulting raster.
  getRasterDetail(uuid).then(data => {
    dispatch(receiveRaster(uuid, data));
  });

  return false; // No data present yet.
}
