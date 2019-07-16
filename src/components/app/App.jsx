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
      /** List of available base layers */
      availableBaseLayers: [],
      availableViews: [],
      availableOverlays: [],
      availableHydroRasters: [],
      availableChoropleth: [],
      /** List of layer ids for layers to be displayed */
      currentLayers: [],
      currentFilters: [],
      currentView: null,
      currentOverlay: null,
      currentHydroRaster: null,
      hydroRasterValues: [],
      choroplethValues: [],
      highlightedFeatures: [],
      highlightedLayer: [],
      searchFeatures: [],
      style: null,
      yearRange: null,
      tileRanges: null,
      // currentTileRange: null,
    };

    this.setView = this.setView.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
    this.searchByText = this.searchByText.bind(this);
    this.currentTileRange = null;
  }

  componentDidMount() {
    this.loadInitialData1();
  }

  getAtlas() {
    const {
      style,
      currentLayers,
      currentFilters,
      currentOverlay,
      views,
      currentView,
      tileRanges,
      year,
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
        currentLayers={currentLayers}
        currentFilters={currentFilters}
        currentOverlay={currentOverlay}
        setSearchFeatures={this.setSearchFeatures}
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
    // add async update style object / tiles here
    this.setState({
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


  getStylePromise() {
    return d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${this.currentTileRange[0]}&end=${this.currentTileRange[1]}`);
  }

  getLegendPromise(year) {
    return d3.json(`http://highways.axismaps.io/api/v1/getLegend?start=${year}&end=${year}`);
  }


  searchByText(input) {
    console.log('input', input);
    const featureResults = null;
    if (featureResults) {
      this.setSearchFeatures(featureResults);
    }
  }

  updateStyle(newYear) {
    if (this.currentTileRange === null) return;
    const { tileRanges } = this.state;
    const newTileRange = App.getCurrentTileRange({
      year: newYear,
      tileRanges,
    });

    if (this.currentTileRange[0] !== newTileRange[0]) {
      this.currentTileRange = newTileRange;
      // need to cancel previous promise if scrubbing too fast
      this.getStylePromise(newYear)
        .then((style) => {
          console.log('STYLE????', style);
          // const formattedStyle = App.formatStyle({
          //   style,
          //   currentTileRange: newTileRange,
          // });
          
          // slide style.sources.composite.url to use currentTileRange
          // add style update method to Atlas module
          this.setState({
            // style: formattedStyle,
            style,
          });
        });
    }
  }

  updateLegendData(newYear) {
    this.getLegendPromise(newYear)
      .then((legendData) => {
        this.setState({
          legendData,
        });
      });
  }

  async loadInitialData2({
    tileRanges,
    yearRange,
    legendData,
  }) {
    const stylePromise = this.getStylePromise();

    const style = await stylePromise;

    this.setState({
      style,
      tileRanges,
      yearRange,
      legendData,
    });
    // this.setState({ style });
  }

  async loadInitialData1() {
    const { year } = this.state;
    const [
      tileRangesData,
      legendData,
    ] = await Promise.all([
      d3.json('http://highways.axismaps.io/api/v1/getTimeline'),
      this.getLegendPromise(year),
    ]);

    const tileRanges = tileRangesData.response;

    const yearRange = d3.extent(tileRanges
      .reduce((accumulator, d) => [...accumulator, ...d], []));
    this.currentTileRange = App.getCurrentTileRange({
      tileRanges,
      year,
    });
    this.loadInitialData2({
      legendData,
      tileRanges,
      yearRange,
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
      tileRanges,
      // currentTileRange,
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
            sidebarOpen={sidebarOpen}
            setView={this.setView}
            views={views}
            currentView={currentView}
            searchFeatures={searchFeatures}
            searching={searching}
            searchByText={this.searchByText}
          />
          {this.getAtlas()}
        </div>
        
      </div>
    );
  }
}

export default App;
