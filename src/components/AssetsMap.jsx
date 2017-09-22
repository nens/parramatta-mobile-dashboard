import React, { Component } from "react";
import { connect } from "react-redux";
import { render } from "react-dom";
import { translate } from "react-i18next";
import styles from "./AssetMap.css";
import { Bounds, Map, TileLayer, Marker, Popup } from "react-leaflet";

import { getMeasuringStations } from "lizard-api-client";
import BaseTile from "./BaseTile";
import { addAsset } from "../actions/AssetActions";
import { updateTimeseriesMetadata } from "../actions/TimeseriesActions";

class AssetsMapComponent extends BaseTile {
  componentDidMount() {
    // Send a request for all assets of the configured types, store them on assets
    // As it's possible that other maps also got other assets, and we don't show spinners,
    // don't use an isFetching. Means we may do the same request several times, but
    // for now that is OK.
    const inBboxFilter = this.getBbox().toLizardBbox();

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

  getPopup(asset) {
    if (this.props.isThumb) return null;

    let timeseriesTable;

    if (!asset.timeseries || !asset.timeseries.length) {
      timeseriesTable = <p>This asset has no timeseries.</p>;
    } else {
      const timeseriesWithMetadata = asset.timeseries.filter(
        ts => this.props.timeseriesMetadata[ts.uuid]
      );

      if (timeseriesWithMetadata.length) {
        // Create a table with units and latest values.
        const rows = timeseriesWithMetadata.map(ts => {
          const metadata = this.props.timeseriesMetadata[ts.uuid];
          return (
            <tr>
              <td>{metadata.name}</td>
              <td>{metadata.last_value}</td>
              <td>{metadata.observation_type.unit || ""}</td>
            </tr>
          );
        });
        timeseriesTable = (
          <table className={styles.PopupTable}>
            <thead>
              <th>Timeseries name</th>
              <th>Last value</th>
              <th>Unit</th>
            </thead>
            {rows}
          </table>
        );
      } else {
        timeseriesTable = <p>Loading timeseries...</p>;
      }
    }

    return (
      <Popup>
        <div className={styles.Popup}>
          <p>
            <strong>{asset.name}</strong>
          </p>
          {timeseriesTable}
        </div>
      </Popup>
    );
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
          <Marker
            onclick={() =>
              !this.props.isThumb && this.clickMarker(assetType, asset.id)}
            position={[coords[1], coords[0]]}
            key={asset.id}
          >
            {this.getPopup(asset)}
          </Marker>
        );
        markers.push(marker);
      });
    });

    const key = this.props.tile.key;
    const small = this.props.isThumb;
    const boundsForLeaflet = this.getBbox().toLeafletArray();

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

  clickMarker(assetType, assetId) {
    const asset = this.props.assets[assetType][assetId];

    if (!asset.timeseries) return;

    asset.timeseries.forEach(this.props.updateTimeseries);
  }
}

function mapStateToProps(state) {
  return {
    bootstrap: state.session.bootstrap,
    assets: state.assets,
    timeseriesMetadata: state.timeseries
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAsset: (assetType, id, instance) =>
      dispatch(addAsset(assetType, id, instance)),
    updateTimeseries: timeseries =>
      updateTimeseriesMetadata(dispatch, timeseries.uuid)
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(AssetsMapComponent)
);
