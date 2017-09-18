import React, { Component } from "react";
import { connect } from "react-redux";
import { render } from "react-dom";
import { translate } from "react-i18next";
import styles from "./RasterMap.css";
import { Bounds, Map, TileLayer, WMSTileLayer } from "react-leaflet";
import { getRaster } from "../actions/RasterActions";

class RasterMap extends Component {
  tileLayerForRaster(raster) {
    let rasterObject = null;
    if (this.props.rasters.hasOwnProperty(raster.uuid)) {
      rasterObject = this.props.rasters[raster.uuid].data;
    }

    if (!rasterObject) {
      this.props.getRaster(raster.uuid);
      return null;
    }

    let wmsUrl = rasterObject.wms_info.endpoint;
    if (rasterObject.last_value_timestamp) {
      // String of the form '01-01-1970T00:00:00.000Z'
      let utcTime = new Date(rasterObject.last_value_timestamp).toISOString();
      // Remove '.000Z'
      if (utcTime.substring(19, 24) === ".000Z") {
        utcTime = utcTime.substring(0, 19);
      }
      wmsUrl += "?TIME=" + utcTime;
    }

    return (
      <WMSTileLayer
        url={wmsUrl}
        key={rasterObject.uuid}
        layers={rasterObject.wms_info.layer}
        styles={rasterObject.options.styles}
        opacity={raster.opacity}
      />
    );
  }

  render() {
    const visibleRasters = [];
    const bounds = this.props.bootstrap.getBounds();
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
          ref={"mapElement" + key + small}
          id={"mapElement" + key + small}
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
          {this.props.tile.rasters.map(raster =>
            this.tileLayerForRaster(raster)
          )}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bootstrap: state.session.bootstrap,
    rasters: state.rasters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRaster: uuid => getRaster(uuid, dispatch)
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(RasterMap)
);
