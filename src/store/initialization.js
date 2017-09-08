import { addTile } from "../actions/TileActions";

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
    ]
  },
  {
    title: "Measuring stations",
    tileType: "assetsMap",
    imageUrl:
      "https://geoserver9.lizard.net/geoserver/schiedam/wms?LAYERS=schiedam%3Aschdm_begaanbaarheid&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A3857&BBOX=486957.47731946,6782074.8128298,491037.45989666,6786888.0641652&WIDTH=170&HEIGHT=140",
    assetTypes: ["measuringstation"]
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
