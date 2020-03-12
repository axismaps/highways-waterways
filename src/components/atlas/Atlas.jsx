import React from 'react';
import PropTypes from 'prop-types';
import * as mapboxgl from 'mapbox-gl';

import searchMethods from './AtlasSearchMethods';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Atlas.scss';
import viewIcon from './viewshed-new.png';

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
      areaSearching: null,
      style: null,
      year: null,
      highlightedLayer: null,
      layerOpacityProps: {},
      viewsData: null
    };

    this.highlightLayerIds = [];
    this.styleTimer = null;

    this.onAreaMouseDown = this.onAreaMouseDown.bind(this);
    this.onAreaMouseMove = this.onAreaMouseMove.bind(this);
    this.onAreaMouseUp = this.onAreaMouseUp.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';
    const mbMap = new mapboxgl.Map({
      container: this.atlasRef.current,
      style: this.getFilteredStyle(),
      minZoom: 10,
      maxZoom: 17
    }).addControl(new mapboxgl.NavigationControl(), 'top-left');

    this.mbMap = mbMap;

    this.canvas = mbMap.getCanvasContainer();
    this.logAreaSearching();
    this.logStyle();
    this.logLayerOpacityProps();
    this.logYear();
    this.logHighlightedFeature();
    this.logHighlightedLayer();
    this.logHiddenLayers();
    this.logRasterOpacity();
    this.logViewsData();
    this.logSidebarOpen();
    this.setClickSearchListener();
    this.setAreaSearchListener();
    this.loadIcon();
  }

  componentDidUpdate() {
    const {
      areaSearching,
      style,
      year,
      highlightedFeature,
      highlightedLayer,
      hiddenLayers,
      sidebarOpen,
      currentRaster,
      rasterOpacity,
      viewsData
    } = this.props;

    const updateYear = () => {
      this.logYear();
      this.mbMap.setStyle(this.getFilteredStyle());
      this.styleTimer = null;
    };

    const updateYearDebounced = () => {
      if (this.styleTimer === null) {
        this.styleTimer = setTimeout(updateYear, 500);
      } else {
        clearTimeout(this.styleTimer);
        this.styleTimer = setTimeout(updateYear, 500);
      }
    };

    if (
      style.sources.composite.url !== this.logged.style.sources.composite.url
    ) {
      this.logStyle();
      this.logLayerOpacityProps();
      updateYearDebounced();
    } else if (year !== this.logged.year) {
      const { url } = style.sources.composite;
      const tileStart = url.slice(
        url.indexOf('start=') + 6,
        url.indexOf('start=') + 10
      );
      const tileEnd = url.slice(
        url.indexOf('end=') + 4,
        url.indexOf('end=') + 8
      );
      /**
       * do not update style year filters if style object is not update
       * instead, wait for style object to update (above)
       */
      if (year >= tileStart && year <= tileEnd) {
        updateYearDebounced();
      }
    }
    if (this.logged.highlightedLayer !== highlightedLayer) {
      this.logHighlightedLayer();
      this.setHighlightedLayer();
    }
    if (this.logged.hiddenLayers !== hiddenLayers) {
      this.logHiddenLayers();
      this.setLayerVisibilities();
    }
    if (this.logged.sidebarOpen !== sidebarOpen) {
      this.logSidebarOpen();
      this.mbMap.resize();
    }
    if (this.logged.areaSearching !== areaSearching) {
      this.logAreaSearching();
      this.setAtlasAreaSearching();
    }
    if (this.logged.highlightedFeature !== highlightedFeature) {
      this.logHighlightedFeature();
      this.clearHighlightedFeature();
      this.zoomToHighlightedFeature();
      this.setHighlightedFeature();
    }
    if (this.logged.currentRaster !== currentRaster) {
      this.setRasterOverlayLayer();
      this.setViewCone();
    }
    if (this.logged.rasterOpacity !== rasterOpacity) {
      this.setRasterOpacity();
    }
    if (this.logged.viewsData !== viewsData) {
      this.setViewPoints();
      this.logViewsData();
    }
  }

  getFilteredLayer(layer) {
    const { year } = this.props;
    const roundYear = Math.round(year);
    if (!('filter' in layer)) return layer;

    const newLayer = Object.assign({}, layer);
    newLayer.filter = layer.filter.map(f => {
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
    const { style, viewsData } = this.props;
    const styleCopy = JSON.parse(JSON.stringify(style));
    styleCopy.layers = styleCopy.layers.map(layer =>
      this.getFilteredLayer(layer)
    );

    const pointsFeature = viewsData.map(view => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: view.point
        },
        properties: {
          title: view.title,
          credit: view.credit,
          creator: view.creator,
          thumb: view.thumb,
          viewcone: view.viewcone
        }
      };
    });

    const viewPointsSource = {
      'view-points': {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointsFeature
        }
      }
    };

    const viewPointsLayer = {
      id: 'view-points',
      source: 'view-points',
      type: 'symbol',
      layout: {
        'icon-image': 'view-icon',
        'icon-size': 0.45
      }
    };

    styleCopy.sources = { ...styleCopy.sources, ...viewPointsSource };
    styleCopy.layers.push(viewPointsLayer);

    return styleCopy;
  }

  setClickSearchListener() {
    const { searchByPoint } = this.props;

    this.mbMap.on('click', e => {
      searchByPoint(
        this.mbMap.unproject(new mapboxgl.Point(e.point.x, e.point.y))
      );
    });
  }

  setAreaSearchListener() {
    this.canvas.addEventListener('mousedown', this.onAreaMouseDown, true);
  }

  setAtlasAreaSearching() {
    const { areaSearching } = this.props;
    if (areaSearching) {
      this.mbMap.dragPan.disable();
      this.mbMap.scrollZoom.disable();
    } else {
      this.mbMap.dragPan.enable();
      this.mbMap.scrollZoom.enable();
    }
  }

  setHighlightedLayer() {
    const { highlightedLayer } = this.props;
    const { layers } = this.mbMap.getStyle();
    const { layerOpacityProps } = this.logged;

    layers.forEach(layer => {
      const originalPaint = layerOpacityProps[layer.id];
      if (originalPaint !== null) {
        if (highlightedLayer === null) {
          this.mbMap.setPaintProperty(
            layer.id,
            originalPaint.field,
            originalPaint.value
          );
        } else if (!layer.id.includes(highlightedLayer)) {
          this.mbMap.setPaintProperty(layer.id, originalPaint.field, 0.1);
        } else if (layer.id.includes(highlightedLayer)) {
          this.mbMap.setPaintProperty(
            layer.id,
            originalPaint.field,
            originalPaint.value
          );
        }
      }
    });
  }

  setLayerVisibilities() {
    const { hiddenLayers } = this.props;
    const { layers } = this.mbMap.getStyle();

    layers.forEach(layer => {
      const visible =
        this.mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';

      const shouldBeHidden =
        hiddenLayers.includes(layer.id) ||
        hiddenLayers.includes(layer['source-layer']);

      if (visible && shouldBeHidden) {
        this.mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
      } else if (!visible && !shouldBeHidden) {
        this.mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
      }
    });
  }

  setHighlightedFeature() {
    const { highlightedFeature } = this.props;

    if (highlightedFeature === null) return;

    const bottomHighlightBaseId = 'highlighted-feature-outline-bottom';
    const topHighlightBaseId = 'highlighted-feature-outline-top';
    const fillHighlightBaseId = 'highlighted-feature-fill';

    const idsFilter = ['any'];
    highlightedFeature.feature.ids.forEach(id => {
      idsFilter.push(['==', 'id', id]);
    });

    this.mbMap
      .getStyle()
      .layers.filter(d => d['source-layer'] === highlightedFeature.source)
      .forEach((layer, i) => {
        const yearFilter = layer.filter;
        const newFilter = ['all', yearFilter, idsFilter];
        const highlightColor = 'rgb(50, 50, 50)';
        if (layer.type === 'fill') {
          const id = `${fillHighlightBaseId}--${i}`;
          this.highlightLayerIds.push(id);
          const fillLayer = {
            id,
            type: 'fill',
            filter: newFilter,
            source: 'composite',
            'source-layer': layer['source-layer'],
            layout: {},
            paint: {
              'fill-color': highlightColor,
              'fill-opacity': 0.2
            }
          };
          this.mbMap.addLayer(fillLayer);
        } else if (layer.type === 'line') {
          const bottomId = `${bottomHighlightBaseId}--${i}`;
          const topId = `${topHighlightBaseId}--${i}`;
          this.highlightLayerIds.push(bottomId);
          this.highlightLayerIds.push(topId);
          const outlineLayerBottom = {
            id: bottomId,
            type: 'line',
            filter: newFilter,
            source: 'composite',
            'source-layer': layer['source-layer'],
            layout: {
              'line-join': 'round'
            },
            paint: {
              'line-width': 8,
              'line-color': highlightColor,
              'line-opacity': 0.5
            }
          };
          const outlineLayerTop = {
            id: topId,
            type: 'line',
            filter: newFilter,
            source: 'composite',
            'source-layer': layer['source-layer'],
            layout: {
              'line-join': 'round'
            },
            paint: {
              'line-width': 2,
              'line-color': '#000'
            }
          };
          this.mbMap.addLayer(outlineLayerBottom);
          this.mbMap.addLayer(outlineLayerTop);
        }
      });
  }

  clearHighlightedFeature() {
    this.highlightLayerIds.forEach(id => {
      this.mbMap.removeLayer(id);
    });
    this.highlightLayerIds = [];
  }

  zoomToHighlightedFeature() {
    const { highlightedFeature } = this.props;
    if (highlightedFeature === null) return;

    this.mbMap.fitBounds(highlightedFeature.feature.bbox);
  }

  setRasterOverlayLayer() {
    const { currentRaster } = this.props;

    const source = this.mbMap.getSource('raster-overlay');
    if (source) {
      this.mbMap.removeLayer('raster-overlay');
      this.mbMap.removeSource('raster-overlay');
    }

    if (currentRaster === null || currentRaster.type === 'view') return;

    this.mbMap.addSource('raster-overlay', {
      type: 'raster',
      tiles: [currentRaster.raster.tiles],
      scheme: 'tms'
    });

    this.mbMap.addLayer({
      id: 'raster-overlay',
      type: 'raster',
      source: 'raster-overlay'
    });

    this.mbMap.fitBounds(currentRaster.raster.extent);
  }

  setRasterOpacity() {
    const { rasterOpacity, currentRaster } = this.props;
    if (currentRaster === null || currentRaster.type === 'view') return;

    this.mbMap.setPaintProperty(
      'raster-overlay',
      'raster-opacity',
      rasterOpacity / 100
    );
  }

  setViewCone() {
    const { currentRaster } = this.props;
    if (currentRaster === null || currentRaster.type !== 'view') return;

    const {
      raster: { point, viewcone }
    } = currentRaster;

    this.mbMap.addLayer(
      {
        id: 'raster-overlay',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: viewcone
          }
        },
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.4
        }
      },
      'view-points'
    );

    this.mbMap.fitBounds([point, point]);
  }

  setViewPoints() {
    const { viewsData } = this.props;

    const pointsFeature = viewsData.map(view => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: view.point
        },
        properties: {
          title: view.title,
          credit: view.credit,
          creator: view.creator,
          thumb: view.thumb,
          viewcone: view.viewcone
        }
      };
    });

    //   this.mbMap.addLayer({
    //     id: 'view-points',
    //     source: {
    //       type: 'geojson',
    //       data: {
    //         type: 'FeatureCollection',
    //         features: pointsFeature
    //       }
    //     },
    //     type: 'symbol',
    //     layout: {
    //       'icon-image': 'view-icon',
    //       'icon-size': 0.45
    //     }
    //   });
  }

  loadIcon() {
    this.mbMap.loadImage(viewIcon, (error, image) => {
      if (error) throw error;
      this.mbMap.addImage('view-icon', image);
    });
  }

  logLayerOpacityProps() {
    const { layerOpacityFields } = this.props;
    const { style } = this.logged;
    this.logged.layerOpacityProps = style.layers.reduce(
      (accumulator, layer) => {
        const field = layerOpacityFields.find(d => d in layer.paint);
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
          value: layer.paint[field]
        };
        return accumulator;
      },
      {}
    );
  }

  logRasterOpacity() {
    const { rasterOpacity } = this.props;
    this.logged.rasterOpacity = rasterOpacity;
  }

  logCurrentRaster() {
    const { currentRaster } = this.props;
    this.logged.currentRaster = currentRaster;
  }
  logAreaSearching() {
    const { areaSearching } = this.props;
    this.logged.areaSearching = areaSearching;
  }

  logStyle() {
    const { style } = this.props;
    this.logged.style = style;
  }

  logYear() {
    const { year } = this.props;
    this.logged.year = year;
  }

  logSidebarOpen() {
    const { sidebarOpen } = this.props;
    this.logged.sidebarOpen = sidebarOpen;
  }

  logHighlightedFeature() {
    const { highlightedFeature } = this.props;
    this.logged.highlightedFeature = highlightedFeature;
  }

  logHighlightedLayer() {
    const { highlightedLayer } = this.props;
    this.logged.highlightedLayer = highlightedLayer;
  }

  logHiddenLayers() {
    const { hiddenLayers } = this.props;
    this.logged.hiddenLayers = hiddenLayers;
  }

  logViewsData() {
    const { viewsData } = this.props;
    this.logged.viewsData = viewsData;
  }

  render() {
    const { areaSearching } = this.props;
    let containerClass = 'atlas';
    if (areaSearching) {
      containerClass += ' atlas--area-searching';
    }
    return <div className={containerClass} ref={this.atlasRef} />;
  }
}

Object.assign(Atlas.prototype, searchMethods);

Atlas.defaultProps = {
  currentRaster: null,
  hiddenLayers: [],
  highlightedFeature: null,
  highlightedLayer: null,
  layerOpacityFields: [
    'fill-opacity',
    'line-opacity',
    'text-opacity',
    'icon-opacity'
  ]
};

Atlas.propTypes = {
  /** pixel position of current area search box */
  areaBox: PropTypes.shape({
    end: PropTypes.arrayOf(PropTypes.number),
    start: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  /** if area search is on */
  areaSearching: PropTypes.bool.isRequired,
  /** Current raster overlay/view/choropleth/hydroRaster */
  currentRaster: PropTypes.shape({
    type: PropTypes.string,
    raster: PropTypes.object
  }),
  /** List of view points */
  viewsData: PropTypes.arrayOf(PropTypes.object),
  /** All map layers to hide (layer ids) */
  hiddenLayers: PropTypes.arrayOf(PropTypes.string),
  /** Currently highlighted layer id */
  highlightedLayer: PropTypes.string,
  highlightedFeature: PropTypes.shape({
    feature: PropTypes.shape({
      bbox: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      ids: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string
    }),
    source: PropTypes.string
  }),
  /** List of layer paint properties that affect opacity */
  layerOpacityFields: PropTypes.arrayOf(PropTypes.string),
  /** callback to search by point (click) */
  searchByPoint: PropTypes.func.isRequired,
  /** If sidebar is current open */
  sidebarOpen: PropTypes.bool.isRequired,
  /** mapbox-gl style object */
  style: PropTypes.shape({
    bearing: PropTypes.number,
    center: PropTypes.array,
    glyphs: PropTypes.string,
    layers: PropTypes.array,
    name: PropTypes.string,
    pitch: PropTypes.number,
    sources: PropTypes.object,
    sprite: PropTypes.string,
    version: PropTypes.number,
    zoom: PropTypes.number
  }).isRequired,
  /** Current year */
  year: PropTypes.number.isRequired
};

export default Atlas;
