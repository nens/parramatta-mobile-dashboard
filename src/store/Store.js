import { createStore, combineReducers } from "redux";
import reducers from "../reducers/index";

export const initialAssetsState = {
  measuringstation: {}
};

export const initialUiState = {
  tileKeys: [],
  currentTile: null
};

export const initialTilesState = {};

export const initialSessionState = {
  // Authentication and user information
  isFetching: false, // Sent a request to bootstrap
  hasBootstrap: false, // Whether result is in
  bootstrap: null // Resulting bootstrap object from Lizard API /bootstrap/lizard
};

export const initialRastersState = {};

export const initialTimeseriesState = {};

// rasterUuid => {
//   isFetching: false, legendData: null
// }
// no different numbers of steps or scaling
export const initialLegendsState = {};

const initialState = {
  assets: initialAssetsState,
  ui: initialUiState,
  rasters: initialRastersState,
  session: initialSessionState,
  tiles: initialTilesState,
  timeseries: initialTimeseriesState,
  legends: initialLegendsState
};

/**
 * Consumer applications may call createStore({}initialState, {}ownReducers) to
 * create a store with Lizard state and application specific state.
 */
function configureStore(initialState = {}) {
  const rootReducer = combineReducers(reducers);

  return createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

export const theStore = configureStore(initialState);
