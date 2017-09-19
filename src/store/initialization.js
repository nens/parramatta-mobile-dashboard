import { BoundingBox } from "../util/bounds";
import { addTile } from "../actions/TileActions";
import { DateTime } from "lizard-api-client";

const hardcodedTiles = [
  {
    title: "DEM Sydney",
    tileType: "rasterMap",
    imageUrl:
      "https://parramatta.lizard.net/api/v3/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=extern%3Aau%3Apa%3Adem_sydney&STYLES=dem-world%3A0%3A300&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=140&WIDTH=170&SRS=EPSG%3A3857&BBOX=16808808.268023398,-4001631.3047855473,16813700.23783365,-3996739.3349752952",
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
    imageUrl:
      "https://parramatta.lizard.net/api/v3/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=scenarios%3A1542%3Adepth-max-dtri&STYLES=Blues%3A0.0%3A2.0&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=140&WIDTH=170&SRS=EPSG%3A3857&BBOX=16808808.268023398,-4001631.3047855473,16811254.25292852,-3999185.3198804227",
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
    imageUrl:
      "https://geoserver9.lizard.net/geoserver/schiedam/wms?LAYERS=schiedam%3Aschdm_begaanbaarheid&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A3857&BBOX=486957.47731946,6782074.8128298,491037.45989666,6786888.0641652&WIDTH=170&HEIGHT=140",
    assetTypes: ["measuringstation"]
  },
  {
    title: "Timeseries",
    tileType: "timeseriesGraph",
    period: [
      new DateTime({
        type: "relative",
        to: "end",
        offset: -3 * 24 * 3600
      }),
      new DateTime({
        type: "relative",
        to: "end",
        offset: 6 * 3600
      })
    ],
    imageUrl:
      "https://geoserver9.lizard.net/geoserver/schiedam/wms?LAYERS=schiedam%3Aschdm_begaanbaarheid&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A3857&BBOX=486957.47731946,6782074.8128298,491037.45989666,6786888.0641652&WIDTH=170&HEIGHT=140",
    timeseries: ["48d39158-b98e-4267-bd7e-a73fabec53c9"]
  }
];

export function loadTiles(dispatch) {
  hardcodedTiles.map((tile, i) => {
    const key = "tile" + i;
    tile.key = key;
    console.log("Tile:", tile);
    dispatch(addTile(key, tile));
  });
}
