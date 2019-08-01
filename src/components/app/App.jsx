import React from 'react';
import * as d3 from 'd3';
import Sidebar from '../sidebar/Sidebar';
import SidebarToggleButton from '../sidebar/SidebarToggleButton';
import RasterProbe from '../rasterProbe/RasterProbe';
import Atlas from '../atlas/Atlas';
import Header from '../header/Header';
import Lightbox from '../lightbox/Lightbox';
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
    // const {
    //   tileRanges,
    //   year,
    // } = this.state;
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
      choroplethData: [],
      rasterOpacity: 1,
      /** List of layer ids for layers to be hidden */
      hiddenLayers: [],
      currentFilters: [],
      // currentView: null,
      // currentOverlay: null,
      // currentHydroRaster: null,
      // currentChoropleth: null,
      hydroRasterValues: [],
      choroplethValues: [],
      /** GeoJSON feature object of highlighted feature */
      highlightedFeature: null,
      /** Layer id for isolated layer */
      highlightedLayer: null,
      /** Mapbox-gl features */
      searchFeatures: [],
      /** Null, text, or atlas */
      searchView: null,
      style: null,
      yearRange: null,
      tileRanges: null,
    };

    this.setLightbox = this.setLightbox.bind(this);
    this.clearLightbox = this.clearLightbox.bind(this);
    this.setRaster = this.setRaster.bind(this);
    this.clearRaster = this.clearRaster.bind(this);
    this.prevRaster = this.prevRaster.bind(this);
    this.nextRaster = this.nextRaster.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setHighlightedLayer = this.setHighlightedLayer.bind(this);
    this.setHighlightedFeature = this.setHighlightedFeature.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
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
        sidebarOpen={sidebarOpen}
        toggleSidebar={this.toggleSidebar}
        year={year}
        style={style}
        views={views}
        hiddenLayers={hiddenLayers}
        currentFilters={currentFilters}
        setSearchFeatures={this.setSearchFeatures}
        highlightedLayer={highlightedLayer}
        highlightedFeature={highlightedFeature}
      />
    );
  }

  setYear(newYear) {
    // combine all of these into one setState call?
    // or would that be too slow w/ the async stuff?
    this.setState({
      hiddenLayers: [],
      highlightedLayer: null,
      highlightedFeature: null,
      searchFeatures: [],
      searchView: null,
      currentRaster: null,
      year: newYear,
    });
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
      searchView: view,
      searchFeatures: features,
      sidebarOpen: true,
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

  getStylePromise() {
    return d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${this.currentTileRange[0]}&end=${this.currentTileRange[1]}`);
  }

  static getLegendPromise(year) {
    return d3.json(`http://highways.axismaps.io/api/v1/getLegend?start=${year}&end=${year}`);
  }

  getSidebarToggleButton() {
    const {
      sidebarOpen,
      mobile,
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
        currentRaster={currentRaster}
        clearRaster={this.clearRaster}
        prevRaster={this.prevRaster}
        nextRaster={this.nextRaster}
        setLightbox={this.setLightbox}
      />
    );
  }

  setRaster(newRaster) {
    this.setState({
      currentRaster: newRaster,
    });
  }


  clearRaster() {
    this.setRaster(null);
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

  getLightbox() {
    const {
      lightbox,
    } = this.state;
    if (lightbox === null) return null;
    return (
      <Lightbox
        lightboxRaster={lightbox}
        clearLightbox={this.clearLightbox}
      />
    );
  }

  clearSearch() {
    this.setState({
      searchView: null,
      searchFeatures: [],
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
      // need to cancel previous promise if scrubbing too fast
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

  /**
   * @public
   */

  download() {
    exportMethods.download(this);
  }

  render() {
    const {
      views,
      sidebarOpen,
      searchFeatures,
      year,
      legendData,
      tileRanges,
      // currentTileRange,
      viewsData,
      hydroRasterData,
      choroplethData,
      overlaysData,
      hiddenLayers,
      highlightedLayer,
      highlightedFeature,
      searchView,
      mobile,
    } = this.state;
    // const searchView = searchFeatures.length > 0;
    return (
      <div className="app">
        <Header
          mobile={mobile}
          year={year}
          setYear={this.setYear}
          tileRanges={tileRanges}
        />
        <div className="app__body">
          <Sidebar
            mobile={mobile}
            setRaster={this.setRaster}
            hiddenLayers={hiddenLayers}
            overlaysData={overlaysData}
            viewsData={viewsData}
            choroplethData={choroplethData}
            hydroRasterData={hydroRasterData}
            legendData={legendData}
            sidebarOpen={sidebarOpen}
            views={views}
            searchFeatures={searchFeatures}
            searchView={searchView}
            searchByText={this.searchByText}
            clearSearch={this.clearSearch}
            toggleLayerVisibility={this.toggleLayerVisibility}
            setHighlightedLayer={this.setHighlightedLayer}
            setHighlightedFeature={this.setHighlightedFeature}
            highlightedLayer={highlightedLayer}
            highlightedFeature={highlightedFeature}
            toggleSidebar={this.toggleSidebar}
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
