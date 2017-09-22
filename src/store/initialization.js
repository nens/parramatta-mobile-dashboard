import { BoundingBox } from "../util/bounds";
import { addTile } from "../actions/TileActions";
import { DateTime } from "lizard-api-client";

const hardcodedTiles = [
  {
    title: "DEM Sydney",
    tileType: "rasterMap",
    rasters: [
      {
        uuid: "5cf18c6",
        opacity: 0.5
      }
    ]
  },
  {
    title: "Water depth",
    tileType: "rasterMap",
    rasters: [
      {
        uuid: "a8472933-0a9d-44c2-b74a-a72614d9be2b",
        opacity: 0.5
      }
    ],
    bbox: new BoundingBox(
      149.9476776123047, // westmost
      -34.87831497192377, // southmost
      152.0842590332031, // eastmost
      -32.76800155639643 // northmost
    ),
    datetime: new DateTime({
      type: "relative",
      to: "end",
      offset: 3 * 60 * 60 // 3 hours before end of series
    })
  },
  {
    title: "Measuring stations",
    tileType: "assetsMap",
    assetTypes: ["measuringstation"]
  },
  {
    title: "Timeseries",
    tileType: "timeseriesGraph",
    period: [
      new DateTime({
        type: "relative",
        to: "end",
        offset: -5 * 24 * 3600
      }),
      new DateTime({
        type: "relative",
        to: "end",
        offset: 6 * 3600
      })
    ],
    timeseries: ["48d39158-b98e-4267-bd7e-a73fabec53c9"]
  }
];

export function loadTiles(dispatch) {
  hardcodedTiles.map((tile, i) => {
    const key = "tile" + i;
    tile.key = key;
    dispatch(addTile(key, tile));
  });
}
