import React from 'react';
import * as d3 from 'd3';
import Sidebar from '../sidebar/Sidebar';
import SidebarToggleButton from '../sidebar/SidebarToggleButton';
import RasterProbe from '../rasterProbe/RasterProbe';
import Atlas from '../atlas/Atlas';
import Header from '../header/Header';
import Lightbox from '../lightbox/Lightbox';
import MobileMenu from '../mobileMenu/MobileMenu';
import exportMethods from './appExport';
import AreaSearchBox from '../areaSearchBox/AreaSearchBox';
import Loader from '../loader/Loader';
import { urlState } from '../../libs/urlState.js';

import './App.scss';

/**
 * Main application layout and state component
 *
 * This component initializes and passes props/callbacks
 * to all of the main application components--Sidebar, Atlas,
 * etc., and initializes the top-level application state.
 */

class App extends React.Component {
  static getCurrentTileRange({ tileRanges, year }) {
    const roundYear = Math.round(year);
    return tileRanges.find((d) => roundYear >= d[0] && roundYear <= d[1]);
  }

  static getCleanSearchResults({ legendData, results }) {
    const getUniqueFeatures = (features) => {
      const uniqueNames = [...new Set(features.map((d) => d.name))].filter(
        (d) => d !== ' '
      );

      return uniqueNames.map((name) => {
        const featuresOfName = features.filter((d) => d.name === name);
        const allCoords = featuresOfName.reduce((accumulator, d) => {
          const { bbox } = d;
          return [...accumulator, ...bbox];
        }, []);
        const lngExtent = d3.extent(allCoords.map((d) => d[0]));
        const latExtent = d3.extent(allCoords.map((d) => d[1]));

        return {
          name,
          ids: featuresOfName.map((d) => d.id),
          bbox: [
            [lngExtent[1], latExtent[1]],
            [lngExtent[0], latExtent[0]],
          ],
        };
      });
    };
    return Object.keys(results.response)
      .filter((d) => d !== undefined)
      .map((key) => {
        const layer = legendData.find((d) => d.id === key);
        if (layer === undefined) {
          return null;
        }
        const features = results.response[key];
        const uniqueFeatures = getUniqueFeatures(features);
        return {
          id: key,
          title: layer.title,
          features: uniqueFeatures,
        };
      })
      .filter((d) => d !== null && d.features.length > 0);
  }

  constructor(props) {
    super(props);
    const year = urlState.getQueryPar('year')
      ? Number(urlState.getQueryPar('year'))
      : 1950;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    this.state = {
      mapImage: null,
      /** mapbox-gl map instance */
      atlas: null,
      /** if area search button has been clicked but search has not yet been performed */
      areaSearching: false,
      areaBoxOn: false,
      areaBox: {
        start: [0, 0],
        end: [0, 0],
      },
      choroplethData: [],
      /**
       * choropleth layer values
       * keys correspond to layer ids
       */
      choroplethValues: new Map([]),
      /**
       * raster currently displayed in probe
       * view or overlay
       */
      currentRaster: null,
      /** current raster opacity */
      rasterOpacity: 100,
      /** List of layer ids for layers to be hidden */
      hiddenLayers: [],
      /** layer id for isolated layer */
      highlightedLayer: null,
      /** geoJSON feature object of highlighted feature */
      highlightedFeature: null,
      hydroRasterData: [],
      hydroRasterValues: new Map([]),
      loading: true,
      /**
       * raster object to be displayed in lightbox
       */
      lightbox: null,

      /** if app is running on mobile device */
      mobile,
      /** if sidebar is open */
      sidebarOpen: !mobile,
      /** overlay data for given year */
      overlaysData: [
        { name: 'overlay1', id: 1 },
        { name: 'overlay2', id: 2 },
        { name: 'overlay3', id: 3 },
      ],
      screenWidth: window.innerWidth,
      searchFeatureGeojson: [],
      /** mapbox-gl features */
      searchFeatures: [],
      /** null, text, or atlas */
      searchView: null,
      /** mapbox-gl style object */
      style: null,
      tileRanges: null,
      viewsData: [
        { name: 'placeholder1', id: 1 },
        { name: 'placeholder2', id: 2 },
        { name: 'placeholder3', id: 3 },
        { name: 'placeholder4', id: 4 },
        { name: 'placeholder5', id: 5 },
      ],
      year,
      yearRange: null,
    };

    this.searchTimer = null;
    this.dataTimer = null;
    this.choroplethTimer = null;
    this.clearLightbox = this.clearLightbox.bind(this);
    this.clearRaster = this.clearRaster.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.currentTileRange = null;
    this.nextRaster = this.nextRaster.bind(this);
    this.prevRaster = this.prevRaster.bind(this);
    this.searchByArea = this.searchByArea.bind(this);
    this.searchByPoint = this.searchByPoint.bind(this);
    this.searchByText = this.searchByText.bind(this);
    this.setAreaBoxEnd = this.setAreaBoxEnd.bind(this);
    this.setAreaBoxStart = this.setAreaBoxStart.bind(this);
    this.setChoroplethValue = this.setChoroplethValue.bind(this);
    this.setHighlightedFeature = this.setHighlightedFeature.bind(this);
    this.setHighlightedLayer = this.setHighlightedLayer.bind(this);
    this.setLightbox = this.setLightbox.bind(this);
    this.setRaster = this.setRaster.bind(this);
    this.setRasterOpacity = this.setRasterOpacity.bind(this);
    this.setSelectedThematicLayer = this.setSelectedThematicLayer.bind(this);
    this.setYear = this.setYear.bind(this);
    this.toggleAreaBox = this.toggleAreaBox.bind(this);
    this.toggleAreaSearching = this.toggleAreaSearching.bind(this);
    this.toggleLayerVisibility = this.toggleLayerVisibility.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.setAtlas = this.setAtlas.bind(this);
    this.download = this.download.bind(this);
  }

  componentDidMount() {
    this.loadInitialData();
    this.setResizeListener();
  }

  setResizeListener() {
    window.addEventListener('resize', () => {
      this.setState({
        screenWidth: window.innerWidth,
      });
    });
  }

  getAtlas() {
    const {
      areaBox,
      areaSearching,
      currentRaster,
      hiddenLayers,
      highlightedFeature,
      highlightedLayer,
      searchFeatures,
      sidebarOpen,
      style,
      viewsData,
      year,
      rasterOpacity,
    } = this.state;
    if (style === null) return null;

    return (
      <Atlas
        areaBox={areaBox}
        areaSearching={areaSearching}
        currentRaster={currentRaster}
        hiddenLayers={hiddenLayers}
        highlightedFeature={highlightedFeature}
        highlightedLayer={highlightedLayer}
        rasterOpacity={rasterOpacity}
        searchByArea={this.searchByArea}
        searchByPoint={this.searchByPoint}
        searchFeatures={searchFeatures}
        setAtlas={this.setAtlas}
        setAreaBoxEnd={this.setAreaBoxEnd}
        setAreaBoxStart={this.setAreaBoxStart}
        setRaster={this.setRaster}
        sidebarOpen={sidebarOpen}
        style={style}
        toggleAreaBox={this.toggleAreaBox}
        toggleAreaSearching={this.toggleAreaSearching}
        toggleSidebar={this.toggleSidebar}
        viewsData={viewsData}
        year={year}
      />
    );
  }

  getAreaSearchBox() {
    const { areaBoxOn, areaBox } = this.state;
    if (!areaBoxOn) return null;
    return <AreaSearchBox areaBox={areaBox} />;
  }

  getHeader() {
    const {
      yearRange,
      mobile,
      year,
      tileRanges,
      screenWidth,
      mapImage,
    } = this.state;
    if (yearRange === null) return null;

    return (
      <Header
        mapImage={mapImage}
        download={this.download}
        mobile={mobile}
        yearRange={yearRange}
        year={year}
        setYear={this.setYear}
        tileRanges={tileRanges}
        toggleSidebar={this.toggleSidebar}
        screenWidth={screenWidth}
      />
    );
  }

  setYear(newYear) {
    const { searchFeatures, choroplethValues } = this.state;

    urlState.setQuery('year', Math.round(newYear));

    let a = urlState.getQueryPar('year');
    console.log(a);
    const changeState = {
      currentRaster: null,
      highlightedFeature: null,
      highlightedLayer: null,
      searchView: null,
      year: newYear,
    };

    // some layers need to be hidden by default...
    // if (hiddenLayers.length > 0) {
    //   changeState.hiddenLayers = [];
    // }
    if (searchFeatures.length > 0) {
      changeState.searchFeatures = [];
    }
    this.setState(changeState);

    const updateData = async () => {
      this.updateStyle(newYear);
      this.updateLegendData(newYear);
      this.setRasterData(newYear);
      const choroplethData = await this.updateLegendThematicData(newYear);
      for (const choropleth of choroplethData) {
        if (choroplethValues.get(choropleth.id)) {
          this.setLayerVisibilityByChoroplethId(choropleth.id);
        } else {
          this.setChoroplethValue(choropleth.id, [
            choropleth.minValue,
            choropleth.maxValue,
          ]);
        }
      }
      this.dataTimer = null;
    };
    if (this.dataTimer === null) {
      this.dataTimer = setTimeout(updateData, 500);
    } else {
      clearTimeout(this.dataTimer);
      this.dataTimer = setTimeout(updateData, 500);
    }
  }

  setAtlas(atlas) {
    this.setState({ atlas });
  }

  setHighlightedLayer(layerId) {
    const { highlightedLayer } = this.state;
    if (highlightedLayer === layerId || layerId === null) {
      this.setState({
        highlightedLayer: null,
      });
    } else {
      this.setState({
        highlightedLayer: layerId,
      });
    }
  }

  setHighlightedFeature(newFeature) {
    const { highlightedFeature } = this.state;
    if (
      highlightedFeature !== null &&
      highlightedFeature.feature.name === newFeature.feature.name
    ) {
      this.setState({
        highlightedFeature: null,
      });
    } else {
      this.setState({
        highlightedFeature: newFeature,
      });
    }
  }

  // For [1,2,3] [2,3] it will yield [1]. On the other hand, for [1,2,3] [2,3,5] will return the same thing.
  diferenceBetweenAandB(arrayA, arrayB) {
    return arrayA.filter((id) => !arrayB.includes(id));
  }

  setSelectedThematicLayer(thematicLayerId) {
    const { choroplethData, hiddenLayers } = this.state;

    const isLayerAlreadySelected = !hiddenLayers.includes(thematicLayerId);

    if (isLayerAlreadySelected) {
      this.setState({
        hiddenLayers: [...hiddenLayers, thematicLayerId],
      });
      return;
    }

    const choroplethDataIds = choroplethData.map((layer) => layer.id);
    const layersToHide = choroplethDataIds.filter(
      (id) => id !== thematicLayerId
    );

    this.setState({
      selectedThematicLayer: thematicLayerId,
      hiddenLayers: [
        ...this.diferenceBetweenAandB(hiddenLayers, choroplethDataIds),
        ...layersToHide,
      ],
    });
  }

  setChoroplethValue(key, value) {
    const { choroplethValues } = this.state;
    const newChoroplethValues = new Map(choroplethValues);
    newChoroplethValues.set(key, value);
    this.setState({
      choroplethValues: newChoroplethValues,
    });

    const setLayerVisibility = () => {
      this.setLayerVisibilityByChoroplethId(key);
      this.choroplethTimer = null;
    };

    if (this.choroplethTimer === null) {
      this.choroplethTimer = setTimeout(setLayerVisibility, 1);
    } else {
      clearTimeout(this.choroplethTimer);
      this.choroplethTimer = setTimeout(setLayerVisibility, 1);
    }
  }

  setLayerVisibilityByChoroplethId(choroplethId) {
    const {
      hiddenLayers,
      style: { layers },
    } = this.state;

    const choroplethLayerIds = layers
      .filter((layer) => layer['source-layer'] === choroplethId)
      .map((layer) => layer.id);
    const activeTypesIds = this.getChoroplethActiveTypesIds(choroplethId);

    const layersIdToActive = activeTypesIds
      .map((typeId) => {
        return this.getLayersIdByTypeId(typeId);
      })
      .flat();

    const layersIdToHide = this.diferenceBetweenAandB(
      choroplethLayerIds,
      layersIdToActive
    );
    let newHiddenLayers = this.diferenceBetweenAandB(
      hiddenLayers,
      choroplethLayerIds
    );

    newHiddenLayers = [...newHiddenLayers, ...layersIdToHide];

    this.setState({
      hiddenLayers: newHiddenLayers,
    });
  }

  getChoroplethActiveTypesIds(choroplethId) {
    const { choroplethValues, choroplethData } = this.state;

    const choropleth = choroplethData.filter((item) => {
      return item.id === choroplethId;
    })[0];
    const choroplethValue = choroplethValues.get(choroplethId);
    const start = Math.floor(choroplethValue[0]);
    const end = Math.floor(choroplethValue[1]);

    let ids = [];
    for (let i = start; i < end; i++) {
      try {
        const layerId = choropleth.types[i].id;
        ids.push(layerId);
      } catch (error) {}
    }

    return ids;
  }

  getLayersIdByTypeId(typeId) {
    const {
      style: { layers },
    } = this.state;

    let layerIds = [];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.filter && layer.filter[3])
        if (layer.filter[3][2] === typeId) {
          layerIds.push(layer.id);
        }
    }
    return layerIds;
  }

  getStylePromise() {
    return d3.json(
      `http://highways.georio.axismaps.io/api/v1/get/style?start=${this.currentTileRange[0]}&end=${this.currentTileRange[1]}`
    );
  }

  static getLegendPromise(year) {
    return d3.json(
      `http://highways.georio.axismaps.io/api/v1/get/legend?start=${year}&end=${year}`
    );
  }

  static getLegendThematicPromise(year) {
    return d3.json(
      `http://highways.georio.axismaps.io/api/v1/get/legend/thematic?start=${year}&end=${year}`
    );
  }

  static getVisualPromise(year) {
    return d3.json(
      `http://highways.georio.axismaps.io/api/v1/get/visual?start=${year}`
    );
  }

  async setRasterData(year) {
    const { response } = await App.getVisualPromise(year);

    let viewsData = [];
    let overlaysData = [];

    for (let i = 0; i < response.length; i++) {
      const element = response[i];
      if (element.viewcone) {
        viewsData = element.documents.map((d) => {
          return {
            ...d,
            id: Math.random(),
          };
        });
      } else {
        overlaysData.push(element);
      }
    }
    // console.log('viewsData', viewsData);
    // console.log('overlaysData', overlaysData);
    this.setState({ overlaysData, viewsData });
  }

  getSidebarToggleButton() {
    const { mobile, sidebarOpen } = this.state;
    if (sidebarOpen || mobile) return null;
    return <SidebarToggleButton toggleSidebar={this.toggleSidebar} />;
  }

  setAreaBoxStart(pos) {
    const { areaBox } = this.state;
    const newBox = Object.assign({}, areaBox, { start: pos, end: pos });

    this.setState({
      areaBoxOn: true,
      areaBox: newBox,
    });
  }

  setAreaBoxEnd(pos) {
    const { areaBox } = this.state;
    const newBox = Object.assign({}, areaBox, { end: pos });
    this.setState({
      areaBox: newBox,
    });
  }

  setRasterOpacity(rasterOpacity) {
    this.setState({
      rasterOpacity: parseInt(rasterOpacity),
    });
  }

  getRasterProbe() {
    const { currentRaster, rasterOpacity, setRasterOpacity } = this.state;
    if (currentRaster === null) return null;

    return (
      <RasterProbe
        clearRaster={this.clearRaster}
        setRasterOpacity={this.setRasterOpacity}
        rasterOpacity={rasterOpacity}
        currentRaster={currentRaster}
        nextRaster={this.nextRaster}
        prevRaster={this.prevRaster}
        setLightbox={this.setLightbox}
      />
    );
  }

  getMobileMenu() {
    const { mobile } = this.state;
    if (!mobile) return null;
    return <MobileMenu toggleSidebar={this.toggleSidebar} />;
  }

  setRaster(newRaster) {
    this.setState({
      currentRaster: newRaster,
    });
  }

  getRastersByCurrentType() {
    const { currentRaster, viewsData, overlaysData } = this.state;
    const { type } = currentRaster;
    const allRasters = {
      view: viewsData,
      overlay: overlaysData,
    };
    return allRasters[type];
  }

  setLightbox(raster) {
    this.setState({
      lightbox: raster,
    });
  }

  getLightbox() {
    const { lightbox } = this.state;
    if (lightbox === null) return null;
    return (
      <Lightbox clearLightbox={this.clearLightbox} lightboxRaster={lightbox} />
    );
  }

  getLoader() {
    const { loading } = this.state;
    if (!loading) return null;
    return <Loader />;
  }

  getCurrentRasterIndex() {
    const { currentRaster } = this.state;
    const rasters = this.getRastersByCurrentType();
    const rasterIds = rasters.map((d) => d.id);
    return rasterIds.indexOf(currentRaster.raster.id);
  }

  prevRaster() {
    const { currentRaster } = this.state;
    const rasters = this.getRastersByCurrentType();
    const { type } = currentRaster;
    const currentIndex = this.getCurrentRasterIndex();

    let prevRaster;

    if (currentIndex === 0) {
      prevRaster = rasters[rasters.length - 1];
    } else {
      prevRaster = rasters[currentIndex - 1];
    }
    this.setState({
      currentRaster: {
        type,
        raster: prevRaster,
      },
    });
  }

  nextRaster() {
    const { currentRaster } = this.state;
    const rasters = this.getRastersByCurrentType();
    const { type } = currentRaster;
    const currentIndex = this.getCurrentRasterIndex();

    let nextRaster;

    if (currentIndex === rasters.length - 1) {
      [nextRaster] = rasters;
    } else {
      nextRaster = rasters[currentIndex + 1];
    }
    this.setState({
      currentRaster: {
        type,
        raster: nextRaster,
      },
    });
  }

  clearLightbox() {
    this.setState({
      lightbox: null,
    });
  }

  clearRaster() {
    this.setRaster(null);
  }

  toggleAreaBox(bool) {
    const { areaBoxOn } = this.state;
    if (bool !== undefined) {
      this.setState({
        areaBoxOn: bool,
      });
    } else {
      this.setState({
        areaBoxOn: !areaBoxOn,
      });
    }
  }

  clearSearch() {
    this.setState({
      highlightedFeature: null,
      searchFeatures: [],
      searchView: null,
    });
  }

  async updateLegendData(newYear) {
    const legendData = await App.getLegendPromise(newYear);

    this.setState({
      legendData: legendData.response.legend,
    });
  }

  async updateLegendThematicData(newYear) {
    const thematicData = await App.getLegendThematicPromise(newYear);
    const choroplethData = thematicData.response.legend.map((choropleth) => {
      return {
        name: choropleth.title,
        id: choropleth.id,
        types: choropleth.Types,
        slider: choropleth.slider,
        minValue: 0,
        maxValue: choropleth.Types.length,
        colorRamp: choropleth.Types.map((type) => {
          return type.swatch;
        }),
      };
    });

    this.setState({
      choroplethData: choroplethData,
    });
    return choroplethData;
  }

  async updateStyle(newYear) {
    if (this.currentTileRange === null) return;
    const { tileRanges } = this.state;

    const newTileRange = App.getCurrentTileRange({
      year: newYear,
      tileRanges,
    });

    if (this.currentTileRange[0] !== newTileRange[0]) {
      this.currentTileRange = newTileRange;

      const style = await this.getStylePromise(newYear);
      this.setState({
        style,
      });
    }
  }

  async loadInitialData() {
    const { year } = this.state;
    const [tileRangesData, legendData, choroplethData] = await Promise.all([
      d3.json('http://highways.georio.axismaps.io/api/v1/get/timeline'),
      App.getLegendPromise(year),
      this.updateLegendThematicData(year),
      this.setRasterData(year),
    ]);

    const tileRanges = tileRangesData.response;

    const yearRange = d3.extent(
      tileRanges.reduce((accumulator, d) => [...accumulator, ...d], [])
    );
    this.currentTileRange = App.getCurrentTileRange({
      tileRanges,
      year,
    });

    const stylePromise = this.getStylePromise();
    const style = await stylePromise;

    const hiddenLayers = style.layers
      .filter((layer) => {
        if (layer.layout && layer.layout.visibility === 'none') {
          return layer;
        }
      })
      .map((layer) => layer.source);

    for (const chropleth of choroplethData) {
      this.setChoroplethValue(chropleth.id, [0, chropleth.maxValue]);
    }

    this.setState({
      loading: false,
      style,
      tileRanges,
      yearRange,
      choroplethData,
      hiddenLayers,
      legendData: legendData.response.legend,
    });
  }

  toggleLayerVisibility(layerId) {
    const { hiddenLayers } = this.state;

    if (!hiddenLayers.includes(layerId)) {
      this.setState({
        hiddenLayers: [...hiddenLayers, layerId],
      });
    } else {
      this.setState({
        hiddenLayers: hiddenLayers.filter((d) => d !== layerId),
      });
    }
  }

  toggleSidebar() {
    const { sidebarOpen } = this.state;
    this.setState({
      sidebarOpen: !sidebarOpen,
    });
  }

  toggleAreaSearching() {
    const { areaSearching } = this.state;
    this.setState({
      areaSearching: !areaSearching,
    });
  }

  searchByText(e) {
    const { searchView, year, legendData } = this.state;
    const { value } = e.target;

    const doSearch = () => {
      this.setState({ loading: true });
      d3.json(
        `http://highways.georio.axismaps.io/api/v1/search/${value}?start=${year}`
      )
        .then((results) => {
          const searchResults = App.getCleanSearchResults({
            results,
            legendData,
          });
          this.setState({
            loading: false,
            highlightedFeature: null,
            searchView: 'text',
            searchFeatures: searchResults,
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
      this.searchTimer = null;
    };

    if (value.length < 3) {
      if (this.searchTimer !== null) {
        clearTimeout(this.searchTimer);
      }
      if (searchView !== null) {
        this.setState({
          loading: false,
          searchView: null,
          searchFeatures: [],
        });
      }
    } else if (this.searchTimer === null) {
      this.searchTimer = setTimeout(doSearch, 500);
    } else {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(doSearch, 500);
    }
  }

  searchByArea(area) {
    const { legendData } = this.state;

    const xMin = d3.min([area[0].lng, area[1].lng]);
    const yMin = d3.min([area[0].lat, area[1].lat]);
    const xMax = d3.max([area[0].lng, area[1].lng]);
    const yMax = d3.max([area[0].lat, area[1].lat]);

    this.setState({ loading: true });
    d3.json(
      `http://highways.georio.axismaps.io/api/v1/probe/[${xMin},${yMin},${xMax},${yMax}]`
    )
      .then((results) => {
        const searchResults = App.getCleanSearchResults({
          results,
          legendData,
        });

        this.setState({
          loading: false,
          highlightedFeature: null,
          searchView: 'atlas',
          searchFeatures: searchResults,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  searchByPoint(point) {
    const { legendData } = this.state;
    this.setState({ loading: true });
    d3.json(
      `http://highways.georio.axismaps.io/api/v1/probe/[${point.lng},${point.lat}]`
    )
      .then((results) => {
        const searchResults = App.getCleanSearchResults({
          results,
          legendData,
        });

        this.setState({
          sidebarOpen: true,
          loading: false,
          highlightedFeature: null,
          searchView: 'atlas',
          searchFeatures: searchResults,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  rasterize() {
    exportMethods.rasterize(this);
  }

  download() {
    const mapImage = exportMethods.download(this);
    this.setState({ mapImage: mapImage });
  }

  render() {
    const {
      legendData,
      hydroRasterData,
      hydroRasterValues,
      choroplethData,
      choroplethValues,
      hiddenLayers,
      highlightedFeature,
      highlightedLayer,
      mobile,
      overlaysData,
      searchFeatures,
      searchView,
      sidebarOpen,
      views,
      viewsData,
    } = this.state;

    return (
      <div className="app">
        {this.getHeader()}
        <div className="app__body">
          <Sidebar
            choroplethData={choroplethData}
            choroplethValues={choroplethValues}
            setSelectedThematicLayer={this.setSelectedThematicLayer}
            clearSearch={this.clearSearch}
            hiddenLayers={hiddenLayers}
            highlightedFeature={highlightedFeature}
            highlightedLayer={highlightedLayer}
            hydroRasterData={hydroRasterData}
            hydroRasterValues={hydroRasterValues}
            legendData={legendData}
            mobile={mobile}
            overlaysData={overlaysData}
            searchByText={this.searchByText}
            searchFeatures={searchFeatures}
            searchView={searchView}
            setChoroplethValue={this.setChoroplethValue}
            setHighlightedFeature={this.setHighlightedFeature}
            setHighlightedLayer={this.setHighlightedLayer}
            setRaster={this.setRaster}
            sidebarOpen={sidebarOpen}
            toggleAreaSearching={this.toggleAreaSearching}
            toggleLayerVisibility={this.toggleLayerVisibility}
            toggleSidebar={this.toggleSidebar}
            views={views}
            viewsData={viewsData}
          />
          <div className="app__atlas-outer">
            {this.getAtlas()}
            {this.getSidebarToggleButton()}
            {this.getRasterProbe()}
            {this.getAreaSearchBox()}
          </div>
        </div>
        {this.getLightbox()}
        {this.getLoader()}
      </div>
    );
  }
}

export default App;
