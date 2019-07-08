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

    this.state = {
      year: 1950,
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
    };

    this.setView = this.setView.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
  }

  componentDidMount() {
    const { year } = this.state;
    d3.json(`http://highways.axismaps.io/api/v1/getStyle?start=${year}&end=${year}`)
      .then((data) => {
        this.setState({
          style: data,
        });
      });
  }

  getAtlas() {
    const {
      style,
      currentLayers,
      currentFilters,
      currentOverlay,
      views,
      currentView,
    } = this.state;
    if (style === null) return null;
    return (
      <Atlas
        style={style}
        views={views}
        currentView={currentView}
        currentLayers={currentLayers}
        currentFilters={currentFilters}
        currentOverlay={currentOverlay}
        setSearchFeatures={this.setSearchFeatures}
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
    } = this.state;
    return (
      <div className="app">
        <Header />
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
