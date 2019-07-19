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
      highlightedLayer: null,
      layerOpacityProps: {},
    };
  }

  componentDidMount() {
    // const { style } = this.props;
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';
    const mbMap = new mapboxgl.Map({
      container: this.atlasRef.current,
      style: this.getFilteredStyle(),
    });

    this.mbMap = mbMap;
    this.logStyle();
    this.logLayerOpacityProps();
    this.logYear();
    this.logHighlightedLayer();
    this.logHiddenLayers();
  }

  componentDidUpdate() {
    const {
      style,
      year,
      highlightedLayer,
      hiddenLayers,
    } = this.props;
    if (style.sources.composite.url !== this.logged.style.sources.composite.url) {
      this.logStyle();
      this.logLayerOpacityProps();
      this.logYear();
      this.mbMap.setStyle(this.getFilteredStyle());
    } else if (year !== this.logged.year) {
      this.logYear();
      this.mbMap.setStyle(this.getFilteredStyle());
    }
    if (this.logged.highlightedLayer !== highlightedLayer) {
      this.logHighlightedLayer();
      this.setHighlightedLayer();
    }
    if (this.logged.hiddenLayers !== hiddenLayers) {
      this.logHiddenLayers();
      this.setLayerVisibilities();
    }
  }

  getFilteredLayer(layer) {
    const { year } = this.props;
    const roundYear = Math.round(year);
    if (!('filter' in layer)) return layer;

    const newLayer = Object.assign({}, layer);
    newLayer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((d, i) => {
          if (i === 0) return d;
          const copyFilter = [...d];
          if (copyFilter[1] === 'firstyear' || copyFilter[1] === 'lastyear') {
            copyFilter[2] = roundYear;
          }
          return copyFilter;
        });
      }
      if (f[1] === 'firstyear' || f[1] === 'lastyear') {
        const copyFilter = [...f];
        copyFilter[2] = roundYear;
        return copyFilter;
      }
      return f;
    });

    if (!('visibility' in newLayer.layout)) {
      newLayer.layout.visibility = 'visible';
    }

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

    return styleCopy;
  }

  setHighlightedLayer() {
    const { highlightedLayer } = this.props;
    const { layers } = this.mbMap.getStyle();
    const { layerOpacityProps } = this.logged;
    // console.log('logged', layerOpacityProps);
    // console.log('highlightLayer', highlightedLayer);
    layers.forEach((layer) => {
      const originalPaint = layerOpacityProps[layer.id];
      if (originalPaint !== null) {
        if (highlightedLayer === null) {
          this.mbMap.setPaintProperty(layer.id, originalPaint.field, originalPaint.value);
        } else if (!layer.id.includes(highlightedLayer)) {
          this.mbMap.setPaintProperty(layer.id, originalPaint.field, 0.1);
        } else if (layer.id.includes(highlightedLayer)) {
          this.mbMap.setPaintProperty(layer.id, originalPaint.field, originalPaint.value);
        }
      }
    });
  }

  setLayerVisibilities() {
    const { hiddenLayers } = this.props;
    const { layers } = this.mbMap.getStyle();
    console.log('hidden', hiddenLayers);

    layers.forEach((layer) => {
      // console.log('layer', layer);
      const visible = this.mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';

      const shouldBeHidden = hiddenLayers
        .includes(layer['source-layer']);

      if (visible && shouldBeHidden) {
        this.mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
      } else if (!visible && !shouldBeHidden) {
        this.mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
      }
    });
    console.log('logged style', this.logged.style);
  }

  logLayerOpacityProps() {
    const {
      layerOpacityFields,
    } = this.props;
    const {
      style,
    } = this.logged;
    this.logged.layerOpacityProps = style.layers.reduce((accumulator, layer) => {
      const field = layerOpacityFields.find(d => (d in layer.paint));
      if (field === undefined) {
        let record = { value: 1 };
        if (layer.type === 'fill') {
          record.field = 'fill-opacity';
        } else if (layer.type === 'line') {
          record.field = 'line-opacity';
        } else if (layer.type === 'symbol') {
          record.field = 'icon-opacity';
        } else {
          record = null;
        }
        accumulator[layer.id] = record;
        return accumulator;
      }
      accumulator[layer.id] = {
        field,
        value: layer.paint[field],
      };
      return accumulator;
    }, {});
  }

  logStyle() {
    const { style } = this.props;
    this.logged.style = style;
  }

  logYear() {
    const { year } = this.props;
    this.logged.year = year;
  }


  logHighlightedLayer() {
    const { highlightedLayer } = this.props;
    this.logged.highlightedLayer = highlightedLayer;
  }

  logHiddenLayers() {
    const { hiddenLayers } = this.props;
    this.logged.hiddenLayers = hiddenLayers;
  }

  render() {
    return (
      <div className="atlas" ref={this.atlasRef} />
    );
  }
}

Atlas.defaultProps = {
  views: null,
  hiddenLayers: [],
  highlightedLayer: null,
  layerOpacityFields: [
    'fill-opacity',
    'line-opacity',
    'text-opacity',
    'icon-opacity',
  ],
};

Atlas.propTypes = {
  /** mapbox-gl style object */
  style: PropTypes.object.isRequired,
  /** Available view rasters */
  views: PropTypes.arrayOf(PropTypes.object),
  /** All map layers to hide (layer ids) */
  hiddenLayers: PropTypes.arrayOf(PropTypes.string),
  /** Callback to set application search feature results */
  setSearchFeatures: PropTypes.func.isRequired,
  /** Current year */
  year: PropTypes.number.isRequired,
  /** Currently highlighted layer id */
  highlightedLayer: PropTypes.string,
  /** List of layer paint properties that affect opacity */
  layerOpacityFields: PropTypes.arrayOf(PropTypes.string),
};

export default Atlas;
