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
    const bounds = this.props.bootstrap.getBounds();
    const inBboxFilter = [
      Math.min(bounds._southWest.lng, bounds._northEast.lng),
      Math.min(bounds._southWest.lat, bounds._northEast.lat),
      Math.max(bounds._southWest.lng, bounds._northEast.lng),
      Math.max(bounds._southWest.lat, bounds._northEast.lat)
    ].join(",");

    this.props.tile.assetTypes.forEach(assetType => {
      // This is really impossible, need something more generic
      if (assetType === "measuringstation") {
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
      if (!assets) {
        return;
      }

      Object.values(assets).forEach(asset => {
        const coords = asset.geometry.coordinates;
        let marker = (
          <Marker position={[coords[1], coords[0]]}>
            <Popup>
              <strong>{asset.name}</strong>
            </Popup>
          </Marker>
        );
        markers.push(marker);
      });
    });

    const key = this.props.tile.key;
    const small = this.props.isThumb;
    const boundsForLeaflet = [
      [-33.87831497192377, 150.9476776123047],
      [-33.76800155639643, 151.0842590332031]
    ];

    return (
      <div
        className={styles.MapComponent}
        id={"MapComponent" + key + small}
        style={{ width: this.props.width, height: this.props.height }}
      >
        <Map
          ref={"MapComponent" + key + small}
          id={"MapComponent" + key + small}
          bounds={boundsForLeaflet}
          zoomControl={false}
          className={styles.MapElement}
        >
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
            attribution={
              small ? (
                ""
              ) : (
                "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              )
            }
          />
          {markers}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bootstrap: state.session.bootstrap,
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
