import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Atlas from '../atlas/Atlas';
import Header from '../header/Header';
import exportMethods from './appExport';
import * as d3 from 'd3';
import './App.scss';
/**
 * Main application layout and state component
 *
 * This component initializes and passes props/callbacks
 * to all of the main application components--Sidebar, Atlas,
 * etc., and initializes the top-level application state.
 */

class App extends React.Component {
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
    this.currentTileRange = null;
  }

  componentDidMount() {
    this.loadData();
  }

  static getCurrentTileRange({ tileRanges, year }) {
    const roundYear = Math.round(year);
    // const {
    //   tileRanges,
    //   year,
    // } = this.state;
    return tileRanges.find(d => roundYear >= d[0] && roundYear <= d[1]);
  }

  getAtlas() {
    const {
      style,
      currentLayers,
      currentFilters,
      currentOverlay,
      views,
      currentView,
      // tileRanges,
      // year,
    } = this.state;
    if (style === null) return null;
    // this.currentTileRange = App.getCurrentTileRange({
    //   tileRanges,
    //   year,
    // });
    // console.log('currenttilerange', this.currentTileRange);
    return (
      <Atlas
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
    const { year } = this.state;
    return d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${year}&end=${year}`);
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
      console.log('new range', newTileRange);
      // need to cancel previous promise if scrubbing too fast
      this.getStylePromise()
        .then((style) => {
          this.setState({
            style,
          });
        });
    }
  }

  async loadData() {
    const { year } = this.state;
    console.log('load data');
    const [style, tileRangesData] = await Promise.all([
      this.getStylePromise(),
      d3.json('http://highways.axismaps.io/api/v1/getTimeline'),
    ]);

    const tileRanges = tileRangesData.response;

    const yearRange = d3.extent(tileRanges
      .reduce((accumulator, d) => [...accumulator, ...d], []));
    this.currentTileRange = App.getCurrentTileRange({
      tileRanges,
      year,
    });
    // console.log('currentTile', this.currentTileRange);

    this.setState({
      style,
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
          />
          {this.getAtlas()}
        </div>
        
      </div>
    );
  }
}

export default App;
