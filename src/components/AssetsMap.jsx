import React, { Component } from "react";
import { connect } from "react-redux";
import { render } from "react-dom";
import { translate } from "react-i18next";
import styles from "./AssetMap.css";
import { Bounds, Map, TileLayer, Marker, Popup } from "react-leaflet";

import { getMeasuringStations } from "lizard-api-client";
import { addAsset } from "../actions/AssetActions";

class AssetsMapComponent extends Component {
  componentDidMount() {
    // Send a request for all assets of the configured types, store them on assets
    // As it's possible that other maps also got other assets, and we don't show spinners,
    // don't use an isFetching. Means we may do the same request several times, but
    // for now that is OK.
    const inBboxFilter = [
      this.props.bounds._southWest.lng,
      this.props.bounds._southWest.lat,
      this.props.bounds._northEast.lng,
      this.props.bounds._northEast.lat
    ].join(",");

    console.log(inBboxFilter);

    this.props.tile.assetTypes.forEach(assetType => {
      // This is really impossible, need something more generic
      if (assetType === "measuringstation") {
        console.log("It's measuringstation");
        getMeasuringStations({
          in_bbox: inBboxFilter,
          page_size: 1000
        }).then(results => {
          results.forEach(measuringStation => {
            this.props.addAsset(
              "measuringstation",
              measuringStation.id,
              measuringStation
            );
          });
        });
      }
    });
  }

  render() {
    let markers = [];

    this.props.tile.assetTypes.forEach(assetType => {
      const assets = this.props.assets[assetType];
      console.log("Assets 1:", assets);
      if (!assets) {
        return;
      }
      console.log("Assets 2:", assets);

      Object.values(assets).forEach(asset => {
        console.log("Asset", asset.toString());
        const coords = asset.geometry.coordinates;
        console.log("Coords:", coords);
        let marker = (
          <Marker position={[coords[1], coords[0]]}>
            <Popup>
              <strong>
                {asset.name}
              </strong>
            </Popup>
          </Marker>
        );
        markers.push(marker);
      });
    });

    console.log("Markers:", markers);

    return (
      <div className={styles.MapComponent} id="MapComponent">
        <Map
          ref="mapElement"
          id="mapElement"
          bounds={[
            [
              this.props.bounds._southWest.lat,
              this.props.bounds._southWest.lng
            ],
            [this.props.bounds._northEast.lat, this.props.bounds._northEast.lng]
          ]}
          zoomControl={false}
          className={styles.MapElement}
        >
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {markers}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assets: state.assets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAsset: (assetType, id, instance) =>
      dispatch(addAsset(assetType, id, instance))
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(AssetsMapComponent)
);
