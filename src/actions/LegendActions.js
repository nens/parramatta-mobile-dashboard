import { FETCH_LEGEND, ADD_LEGEND } from "../constants/ActionTypes";
import { theStore } from "../store/Store";

export const fetchLegend = uuid => {
  return {
    type: FETCH_LEGEND,
    uuid: uuid
  };
};

export const addLegend = (uuid, legendData) => {
  return {
    type: ADD_LEGEND,
    uuid: uuid,
    data: legendData
  };
};

export function getLegend(dispatch, uuid, wmsInfo, styles, steps = 15) {
  dispatch(fetchLegend(uuid));

  wmsInfo.getLegend(styles, steps).then(data => {
    console.log("Retrieving data:", data);
    dispatch(addLegend(uuid, data));
  });
}
