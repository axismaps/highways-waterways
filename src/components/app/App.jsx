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
      mobile,
      year,
      sidebarOpen: !mobile,
      rasterProbe: null,
      /** Selected raster to be shown on map + raster probe
       * view, choropleth, overlay, or hydroRaster
       */
      // currentRaster: {
      //   type: 'overlay',
      //   raster: { name: 'placeholder2', id: 3 },
      // },
      currentRaster: null,
      lightbox: null,
      // lightboxOpen: false,
      viewsData: [
        { name: 'placeholder1', id: 1 },
        { name: 'placeholder2', id: 2 },
        { name: 'placeholder3', id: 3 },
        { name: 'placeholder4', id: 4 },
        { name: 'placeholder5', id: 5 },
      ],
      overlaysData: [
        { name: 'overlay1', id: 1 },
        { name: 'overlay2', id: 2 },
        { name: 'overlay3', id: 3 },
      ],
      hydroRasterData: [],
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
      rasterOpacity: 1,
      /** List of layer ids for layers to be hidden */
      hiddenLayers: [],
      currentFilters: [],
      // currentView: null,
      // currentOverlay: null,
      // currentHydroRaster: null,
      // currentChoropleth: null,
      hydroRasterValues: new Map([]),
      choroplethValues: new Map([
        [1, 15], // keys correspond to choroplethData 'id' field
        [2, 53],
      ]),
      /** GeoJSON feature object of highlighted feature */
      highlightedFeature: null,
      /** Layer id for isolated layer */
      highlightedLayer: null,
      /** Mapbox-gl features */
      searchFeatures: [],
      /** Null, text, or atlas */
      searchView: null,
      areaSearching: false,
      style: null,
      yearRange: null,
      tileRanges: null,
    };

    this.setLightbox = this.setLightbox.bind(this);
    this.setChoroplethValue = this.setChoroplethValue.bind(this);
    this.clearLightbox = this.clearLightbox.bind(this);
    this.setRaster = this.setRaster.bind(this);
    this.clearRaster = this.clearRaster.bind(this);
    
    this.nextRaster = this.nextRaster.bind(this);
    this.prevRaster = this.prevRaster.bind(this);
    
    this.setHighlightedLayer = this.setHighlightedLayer.bind(this);
    this.setHighlightedFeature = this.setHighlightedFeature.bind(this);
    
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
    this.setYear = this.setYear.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchByText = this.searchByText.bind(this);
    this.toggleLayerVisibility = this.toggleLayerVisibility.bind(this);
    this.currentTileRange = null;
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  componentDidMount() {
    this.loadInitialData();
  }

  getAtlas() {
    const {
      style,
      hiddenLayers,
      currentFilters,
      views,
      year,
      highlightedLayer,
      highlightedFeature,
      sidebarOpen,
      currentRaster,
    } = this.state;
    if (style === null) return null;

    return (
      <Atlas
        currentRaster={currentRaster}
        hiddenLayers={hiddenLayers}
        highlightedFeature={highlightedFeature}
        highlightedLayer={highlightedLayer}
        
        sidebarOpen={sidebarOpen}
        style={style}
        toggleSidebar={this.toggleSidebar}
        views={views}
        
        currentFilters={currentFilters}
        setSearchFeatures={this.setSearchFeatures}
        
        year={year}
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

  /**
   * @public
   */

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
      tileRanges,
      views,
      viewsData,
      year,
    } = this.state;

    return (
      <div className="app">
        <Header
          mobile={mobile}
          year={year}
          setYear={this.setYear}
          tileRanges={tileRanges}
          toggleSidebar={this.toggleSidebar}
        />
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
            toggleLayerVisibility={this.toggleLayerVisibility}
            toggleSidebar={this.toggleSidebar}
            views={views}
            viewsData={viewsData}
          />
          <div className="app__atlas-outer">
            {this.getAtlas()}
            {this.getSidebarToggleButton()}
            {this.getRasterProbe()}
          </div>
        </div>
        {this.getLightbox()}
      </div>
    );
  }
}

export default App;
