import React from "react";
import { connect } from "react-redux";
import { render } from "react-dom";
import { translate } from "react-i18next";
import styles from "./RasterMap.css";
import { Bounds, Map, TileLayer, WMSTileLayer } from "react-leaflet";

import BaseTile from "./BaseTile";
import { getRaster } from "../actions/RasterActions";

class RasterMap extends BaseTile {
  tileLayerForRaster(raster) {
    let rasterObject = null;
    if (this.props.rasters.hasOwnProperty(raster.uuid)) {
      rasterObject = this.props.rasters[raster.uuid].data;
    }

    if (!rasterObject) {
      this.props.getRaster(raster.uuid);
      return null;
    }

    let wmsUrl;
    if (rasterObject.last_value_timestamp && this.props.tile.datetime) {
      wmsUrl = rasterObject.wms_info.addTimeToEndpoint(
        this.props.tile.datetime,
        rasterObject.first_value_timestamp,
        rasterObject.last_value_timestamp
      );
    } else {
      wmsUrl = rasterObject.wms_info.endpoint;
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
