import React from 'react';
import * as d3 from 'd3';
import Sidebar from '../sidebar/Sidebar';
import Atlas from '../atlas/Atlas';
import Header from '../header/Header';
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
    this.state = {
      year,
      sidebarOpen: true,
      rasterProbe: null,
      viewsData: [
        { name: 'placeholder1', id: 1 },
        { name: 'placeholder2', id: 2 },
      ],
      overlaysData: [
        { name: 'overlay1', id: 1 },
        { name: 'overlay2', id: 2 },
        { name: 'overlay3', id: 3 },
      ],
      /** List of layer ids for layers to be hidden */
      hiddenLayers: [],
      currentFilters: [],
      currentView: null,
      currentOverlay: null,
      currentHydroRaster: null,
      hydroRasterValues: [],
      choroplethValues: [],
      /** GeoJSON feature object of highlighted feature */
      highlightedFeature: null,
      /** Layer id for isolated layer */
      highlightedLayer: null,
      searchFeatures: [],
      style: null,
      yearRange: null,
      tileRanges: null,
    };

    this.setView = this.setView.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setHighlightedLayer = this.setHighlightedLayer.bind(this);
    this.setHighlightedFeature = this.setHighlightedFeature.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
    this.searchByText = this.searchByText.bind(this);
    this.toggleLayerVisibility = this.toggleLayerVisibility.bind(this);
    this.currentTileRange = null;
  }

  componentDidMount() {
    this.loadInitialData();
  }

  getAtlas() {
    const {
      style,
      hiddenLayers,
      currentFilters,
      currentOverlay,
      views,
      currentView,
      // tileRanges,
      year,
      highlightedLayer,
      highlightedFeature,
    } = this.state;
    if (style === null) return null;

    // const newTileRange = App.getCurrentTileRange({
    //   year,
    //   tileRanges,
    // });
    // const formattedStyle = App.formatStyle({
    //   style,
    //   currentTileRange: newTileRange,
    // });
    return (
      <Atlas
        year={year}
        // style={formattedStyle}
        style={style}
        views={views}
        currentView={currentView}
        hiddenLayers={hiddenLayers}
        currentFilters={currentFilters}
        currentOverlay={currentOverlay}
        setSearchFeatures={this.setSearchFeatures}
        highlightedLayer={highlightedLayer}
        highlightedFeature={highlightedFeature}
        // currentTileRange={this.currentTileRange}
      />
    );
  }

  setView(newView) {
    const { currentView } = this.state;

    if (currentView === newView) {
      this.setState({
        currentView: null,
      });
    } else {
      this.setState({
        currentView: newView,
      });
    }
  }

  setYear(newYear) {
    // combine all of these into one setState call?
    // or would that be too slow w/ the async stuff?
    this.setState({
      hiddenLayers: [],
      highlightedLayer: null,
      highlightedFeature: null,
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

  setSearchFeatures(newFeatures) {
    this.setState({
      searchFeatures: newFeatures,
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

  setHighlightedFeature(features) {

  }

  getStylePromise() {
    return d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${this.currentTileRange[0]}&end=${this.currentTileRange[1]}`);
  }

  static getLegendPromise(year) {
    return d3.json(`http://highways.axismaps.io/api/v1/getLegend?start=${year}&end=${year}`);
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


  searchByText(input) {
    console.log('input', input);
    const featureResults = null;
    if (featureResults) {
      this.setSearchFeatures(featureResults);
    }
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

  async updateLegendData(newYear) {
    const legendData = await App.getLegendPromise(newYear);

    this.setState({
      legendData: legendData.response.legend,
    });
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
      currentView,
      sidebarOpen,
      searchFeatures,
      year,
      legendData,
      tileRanges,
      // currentTileRange,
      viewsData,
      overlaysData,
      hiddenLayers,
      highlightedLayer,
      highlightedFeature,
    } = this.state;
    const searching = searchFeatures.length > 0;
    return (
      <div className="app">
        <Header
          year={year}
          setYear={this.setYear}
          tileRanges={tileRanges}
          // currentTileRange={currentTileRange}
        />
        <div className="app__body">
          <Sidebar
            hiddenLayers={hiddenLayers}
            overlaysData={overlaysData}
            viewsData={viewsData}
            legendData={legendData}
            sidebarOpen={sidebarOpen}
            setView={this.setView}
            views={views}
            currentView={currentView}
            searchFeatures={searchFeatures}
            searching={searching}
            searchByText={this.searchByText}
            toggleLayerVisibility={this.toggleLayerVisibility}
            setHighlightedLayer={this.setHighlightedLayer}
            setHighlightedFeature={this.setHighlightedFeature}
            highlightedLayer={highlightedLayer}
            highlightedFeature={highlightedFeature}
          />
          {this.getAtlas()}
        </div>
        
      </div>
    );
  }
}

export default App;
