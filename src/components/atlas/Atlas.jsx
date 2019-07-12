import React from 'react';
import PropTypes from 'prop-types';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Atlas.scss';


/**
 * Map component
 *
 * This component displays the application map.
 * The map is rendered with mapbox-gl (not React).
 * Displays the following map layers:
 * view icons, viewsheds, historical raster overlays,
 * environmental raster overlays, choropleth vulnerability metrics,
 * and various static base layers. Layers are toggled on/off in
 * the sidebar. Data-driven layers (slider dependent) are
 * configured in the sidebar as well. Map layer data and overlays
 * depend on the year selected from the timeline. Clicking on a map view
 * icon selects that view, displaying the viewshed polygon
 * on the map and opening the view image in the raster probe.
 * Clicking on map or using the area drag feature
 * searches the map and brings up search results in Sidebar.
 */

class Atlas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.atlasRef = React.createRef();
    this.logged = {
      style: null,
      year: null,
    };
  }

  componentDidMount() {
    const { style } = this.props;
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';
    const mbMap = new mapboxgl.Map({
      container: this.atlasRef.current,
      style: this.getFilteredStyle(),
    });

    this.mbMap = mbMap;
    this.logStyle();
    this.logYear();
  }

  componentDidUpdate() {
    const { style, year } = this.props;
    if (style.sources.composite.url !== this.logged.style.sources.composite.url) {
      this.logStyle();
      this.logYear();
      this.mbMap.setStyle(this.getFilteredStyle());
    } else if (year !== this.logged.year) {
      // console.log('UPDATE YEAR');
      this.logYear();
      this.mbMap.setStyle(this.getFilteredStyle());
      // console.log('filtered style', this.getFilteredStyle());
    }
  }

  getFilteredLayer(layer) {
    const { year } = this.props;
    if (!('filter' in layer)) return layer;

    const newLayer = Object.assign({}, layer);
    newLayer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((d, i) => {
          if (i === 0) return d;
          const copyFilter = [...d];
          if (copyFilter[1] === 'FirstYear' || copyFilter[1] === 'LastYear') {
            copyFilter[2] = year;
          }
          return copyFilter;
        });
      }
      if (f[1] === 'FirstYear' || f[1] === 'LastYear') {
        const copyFilter = [...f];
        copyFilter[2] = year;
        return copyFilter;
      }
      return f;
    });

    return newLayer;
  }

  getFilteredStyle() {
    const {
      // year,
      style,
    } = this.props;
    // console.log('style', style);
    const styleCopy = JSON.parse(JSON.stringify(style));
    styleCopy.layers = styleCopy.layers.map(layer => this.getFilteredLayer(layer));
    // style.layers.forEach((layer) => {
    //   const filteredLayer = this.getFilteredLayer(layer);
    //   console.log('filteredLayer', filteredLayer);
    // });
    return styleCopy;
  }

  logStyle() {
    const { style } = this.props;
    this.logged.style = style;
  }

  logYear() {
    const { year } = this.props;
    this.logged.year = year;
  }

  render() {
    // const {
    //   style,
    // } = this.props;

    return (
      <div className="atlas" ref={this.atlasRef} />
    );
  }
}

Atlas.defaultProps = {
  views: null,
  currentLayers: [],
};

Atlas.propTypes = {
  /** mapbox-gl style object */
  style: PropTypes.object.isRequired,
  /** Available view rasters */
  views: PropTypes.arrayOf(PropTypes.object),
  /** All map layers to display (layer ids) */
  currentLayers: PropTypes.arrayOf(PropTypes.string),
  /** Callback to set application search feature results */
  setSearchFeatures: PropTypes.func.isRequired,
  /** Current year */
  year: PropTypes.number.isRequired,
};

export default Atlas;
