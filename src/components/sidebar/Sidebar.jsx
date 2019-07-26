import React from 'react';
import PropTypes from 'prop-types';
// import SidebarBlock from './SidebarBlock';
import SidebarSearchBar from './SidebarSearchBar';
// import SidebarViewFilmstrip from './SidebarViewFilmstrip';
import SidebarLegend from './SidebarLegend';
import SidebarSearchResults from './SidebarSearchResults';
import './Sidebar.scss';

/**
 * This component establishes the layout of and passes props to
 * all of the Sidebar map layer components (sliders, filmstrips, etc.)
 *
 * App -> Sidebar
 */

class Sidebar extends React.PureComponent {
  getLegend() {
    const {
      searching,
      legendData,
      viewsData,
      overlaysData,
      choroplethData,
      hydroRasterData,
      hiddenLayers,
      toggleLayerVisibility,
      setHighlightedLayer,
      highlightedLayer,
      setRaster,
    } = this.props;


    if (searching || legendData === null) return null;

    return (
      <SidebarLegend
        setRaster={setRaster}
        viewsData={viewsData}
        overlaysData={overlaysData}
        choroplethData={choroplethData}
        hydroRasterData={hydroRasterData}
        toggleLayerVisibility={toggleLayerVisibility}
        hiddenLayers={hiddenLayers}
        legendData={legendData}
        setHighlightedLayer={setHighlightedLayer}
        highlightedLayer={highlightedLayer}
      />
    );
  }

  getSearchBar() {
    const {
      searchFeatures,
      searchByText,
      toggleSidebar,
    } = this.props;
    return (
      <SidebarSearchBar
        searchFeatures={searchFeatures}
        searchByText={searchByText}
        toggleSidebar={toggleSidebar}
      />
    );
  }

  getSearchResults() {
    const {
      searching,
      searchFeatures,
    } = this.props;

    if (!searching) return null;

    return (
      <SidebarSearchResults
        searchFeatures={searchFeatures}
      />
    );
  }

  render() {
    const {
      // setView,
      // currentView,
      // availableViews,
      sidebarOpen,
      
    } = this.props;
    if (!sidebarOpen) return null;
    return (
      <div className="sidebar">
        {this.getSearchBar()}
        <div className="sidebar__inner">
          {this.getLegend()}
          {this.getSearchResults()}
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  searchFeatures: [],
  legendData: null,
  highlightedLayer: null,
  currentRaster: null,
};

Sidebar.propTypes = {
  /** all layers and swatches */
  legendData: PropTypes.arrayOf(PropTypes.object),
  /** if sidebar is currently displaying search results */
  searching: PropTypes.bool.isRequired,
  /** All views for selected year */
  viewsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All overlays for selected year */
  overlaysData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** all hydro rasters (SLR) for selected year */
  hydroRasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All choropleth layers for selected year */
  choroplethData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Current range slider values for available choropleths */
  choroplethValues: PropTypes.arrayOf(PropTypes.object),
  /** Current slider values for hydro raster layers */
  hydroRasterValues: PropTypes.arrayOf(PropTypes.object),
  /** Selected view */
  currentRaster: PropTypes.shape({
    type: PropTypes.string,
    raster: PropTypes.object,
  }),
  /**
   * Set app `currentRaster` state.
   * @param {Object} raster A raster object
   * */
  setRaster: PropTypes.func.isRequired,
  /** Sets hydroRaster filter values */
  setHydroRasterValue: PropTypes.func,
  /** Sets choropleth filter values */
  setChoroplethValue: PropTypes.func,
  /** If sidebar is open or collapsed */
  sidebarOpen: PropTypes.bool.isRequired,
  /** layer ids of all layers currently off */
  hiddenLayers: PropTypes.arrayOf(PropTypes.string),
  /** callback to toggle layers */
  toggleLayerVisibility: PropTypes.func,
  /** currently highlighted layer id */
  highlightedLayer: PropTypes.string,
  /** callback to set highlightedLayer (layer id/name) */
  setHighlightedLayer: PropTypes.func.isRequired,
  /** callback to highlight feature (GeoJSON feature object) */
  setHighlightedFeature: PropTypes.func,
  /** Results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
  /** callback to set application text search value */
  setTextSearch: PropTypes.func,
  /** callback to clear application search features */
  clearSearch: PropTypes.func,
  /** callback to set text search value */
  searchByText: PropTypes.func.isRequired,
  /** callback to close sidebar */
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
