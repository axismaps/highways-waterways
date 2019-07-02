import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Atlas from '../atlas/Atlas';
import Header from '../header/Header';
import exportMethods from './appExport';
import './App.css';
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
    };

    this.setView = this.setView.bind(this);
    this.setSearchFeatures = this.setSearchFeatures.bind(this);
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
      currentLayers,
      currentFilters,
      currentOverlay,
      searchFeatures,
    } = this.state;
    return (
      <div className="App">
        <Header />
        <Sidebar
          sidebarOpen={sidebarOpen}
          setView={this.setView}
          views={views}
          currentView={currentView}
          searchFeatures={searchFeatures}
        />
        <Atlas
          views={views}
          currentView={currentView}
          currentLayers={currentLayers}
          currentFilters={currentFilters}
          currentOverlay={currentOverlay}
          setSearchFeatures={this.setSearchFeatures}
        />
      </div>
    );
  }
}

export default App;
