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
    return tileRanges.find(d => roundYear >= d[0] && roundYear <= d[1]);
  }

  constructor(props) {
    super(props);
    const year = 1950;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.state = {
      /** if area search button has been clicked but search has not yet been performed */
      areaSearching: false,
      areaBoxOn: false,
      areaBox: {
        start: [0, 0],
        end: [0, 0],
      },
      choroplethData: [
        {
          name: 'choropleth placeholder 1',
          id: 1,
          minValue: 2,
          maxValue: 20,
        },
        {
          name: 'choropleth placeholder 2',
          id: 2,
          minValue: 5,
          maxValue: 60,
        },
      ],
      /**
       * choropleth layer values
       * keys correspond to layer ids
       */
      choroplethValues: new Map([
        [1, 15],
        [2, 53],
      ]),
      /** List of layer ids for layers to be hidden */
      currentFilters: [],
      /**
       * raster currently displayed in probe
       * view or overlay
       */
      currentRaster: null,
      hiddenLayers: [],
      /** layer id for isolated layer */
      highlightedLayer: null,
      /** geoJSON feature object of highlighted feature */
      highlightedFeature: null,
      hydroRasterData: [],
      hydroRasterValues: new Map([]),
      /**
       * raster object to be displayed in lightbox
       */
      lightbox: null,
      /** if app is running on mobile device */
      mobile,
      rasterOpacity: 1,
      /** if sidebar is open */
      sidebarOpen: !mobile,
      /** overlay data for given year */
      overlaysData: [
        { name: 'overlay1', id: 1 },
        { name: 'overlay2', id: 2 },
        { name: 'overlay3', id: 3 },
      ],
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

    this.clearLightbox = this.clearLightbox.bind(this);
    this.clearRaster = this.clearRaster.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.currentTileRange = null;
    this.nextRaster = this.nextRaster.bind(this);
    this.prevRaster = this.prevRaster.bind(this);
    this.searchByText = this.searchByText.bind(this);
    this.setAreaBoxEnd = this.setAreaBoxEnd.bind(this);
    this.setAreaBoxStart = this.setAreaBoxStart.bind(this);
    this.setChoroplethValue = this.setChoroplethValue.bind(this);
    this.setHighlightedFeature = this.setHighlightedFeature.bind(this);
    this.setHighlightedLayer = this.setHighlightedLayer.bind(this);
    this.setLightbox = this.setLightbox.bind(this);
    this.setRaster = this.setRaster.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
    this.setYear = this.setYear.bind(this);
    this.toggleAreaBox = this.toggleAreaBox.bind(this);
    this.toggleAreaSearching = this.toggleAreaSearching.bind(this);
    this.toggleLayerVisibility = this.toggleLayerVisibility.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  componentDidMount() {
    this.loadInitialData();
  }

  getAtlas() {
    const {
      areaSearching,
      currentFilters,
      currentRaster,
      hiddenLayers,
      highlightedFeature,
      highlightedLayer,
      sidebarOpen,
      style,
      views,
      year,
    } = this.state;
    if (style === null) return null;

    return (
      <Atlas
        areaSearching={areaSearching}
        currentFilters={currentFilters}
        currentRaster={currentRaster}
        hiddenLayers={hiddenLayers}
        highlightedFeature={highlightedFeature}
        highlightedLayer={highlightedLayer}
        setAreaBoxEnd={this.setAreaBoxEnd}
        setAreaBoxStart={this.setAreaBoxStart}
        setSearchFeatures={this.setSearchFeatures}
        sidebarOpen={sidebarOpen}
        style={style}
        toggleAreaBox={this.toggleAreaBox}
        toggleSidebar={this.toggleSidebar}
        views={views}
        year={year}
      />
    );
  }

  getAreaSearchBox() {
    const {
      areaBoxOn,
      areaBox,
    } = this.state;
    if (!areaBoxOn) return null;
    return (
      <AreaSearchBox
        areaBox={areaBox}
      />
    );
  }

  getHeader() {
    const {
      yearRange,
      mobile,
      year,
      tileRanges,
    } = this.state;
    if (yearRange === null) return null;

    return (
      <Header
        mobile={mobile}
        yearRange={yearRange}
        year={year}
        setYear={this.setYear}
        tileRanges={tileRanges}
        toggleSidebar={this.toggleSidebar}
      />
    );
  }

  setYear(newYear) {
    this.setState({
      currentRaster: null,
      hiddenLayers: [],
      highlightedFeature: null,
      highlightedLayer: null,
      searchFeatures: [],
      searchView: null,
      year: newYear,
    });
    // combine these, where possible
    this.updateStyle(newYear);
    this.updateLegendData(newYear);
  }

  /**
   * Sets application `searchFeatures`
   * @param {array} newFeatures
   * @public
   */

  setSearchFeatures({ view, features }) {
    this.setState({
      sidebarOpen: true,
      searchFeatures: features,
      searchView: view,
    });
  }

  setHighlightedLayer(layerId) {
    const { highlightedLayer } = this.state;
    if (highlightedLayer === layerId
    || layerId === null) {
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
    this.setState({
      highlightedFeature: newFeature,
    });
  }

  setChoroplethValue(key, value) {
    const {
      choroplethValues,
    } = this.state;
    const newChoroplethValues = new Map(choroplethValues);
    newChoroplethValues.set(key, value);
    this.setState({
      choroplethValues: newChoroplethValues,
    });
  }

  getStylePromise() {
    // return d3.json('temp/style.json');
    return d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${this.currentTileRange[0]}&end=${this.currentTileRange[1]}`);
  }

  static getLegendPromise(year) {
    // return d3.json('temp/newlegend.json');
    return d3.json(`http://highways.axismaps.io/api/v1/getLegend?start=${year}&end=${year}`);
  }

  getSidebarToggleButton() {
    const {
      mobile,
      sidebarOpen,
    } = this.state;
    if (sidebarOpen || mobile) return null;
    return (
      <SidebarToggleButton
        toggleSidebar={this.toggleSidebar}
      />
    );
  }

  setAreaBoxStart(pos) {
    const { areaBox } = this.state;
    const newBox = Object.assign({}, areaBox, { start: pos });
    console.log('set box start', newBox);
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

  getRasterProbe() {
    const {
      currentRaster,
    } = this.state;
    if (currentRaster === null) return null;
    return (
      <RasterProbe
        clearRaster={this.clearRaster}
        currentRaster={currentRaster}
        nextRaster={this.nextRaster}
        prevRaster={this.prevRaster}
        setLightbox={this.setLightbox}
      />
    );
  }

  getMobileMenu() {
    const {
      mobile,
    } = this.state;
    if (!mobile) return null;
    return (
      <MobileMenu
        toggleSidebar={this.toggleSidebar}
      />
    );
  }

  setRaster(newRaster) {
    this.setState({
      currentRaster: newRaster,
    });
  }

  prevRaster() {
    console.log('prev raster');
  }

  nextRaster() {
    console.log('next raster');
  }

  setLightbox(raster) {
    this.setState({
      lightbox: raster,
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

  getLightbox() {
    const {
      lightbox,
    } = this.state;
    if (lightbox === null) return null;
    return (
      <Lightbox
        clearLightbox={this.clearLightbox}
        lightboxRaster={lightbox}
      />
    );
  }

  toggleAreaBox(bool) {
    const {
      areaBoxOn,
    } = this.state;
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

  async updateStyle(newYear) {

    if (this.currentTileRange === null) return;
    const { tileRanges } = this.state;
    console.log('tileRanges', tileRanges);
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
    const [
      tileRangesData,
      legendData,
    ] = await Promise.all([
      d3.json('http://highways.axismaps.io/api/v1/getTimeline'),
      // d3.json('temp/tileranges.json'),
      App.getLegendPromise(year),
    ]);


    const tileRanges = tileRangesData.response;

    const yearRange = d3.extent(tileRanges
      .reduce((accumulator, d) => [...accumulator, ...d], []));
    this.currentTileRange = App.getCurrentTileRange({
      tileRanges,
      year,
    });

    const stylePromise = this.getStylePromise();
    const style = await stylePromise;

    this.setState({
      style,
      tileRanges,
      yearRange,
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
        hiddenLayers: hiddenLayers.filter(d => d !== layerId),
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

  searchByText(input) {
    console.log('input', input);
    const featureResults = null;
    if (featureResults) {
      this.setSearchFeatures(featureResults);
    }
  }

  searchByArea(area) {
    // query API here
    console.log('area');
  }

  rasterize() {
    exportMethods.rasterize(this);
  }

  download() {
    exportMethods.download(this);
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
      </div>
    );
  }
}

export default App;
