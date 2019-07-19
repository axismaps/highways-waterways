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
      hiddenLayers,
      toggleLayerVisibility,
      setHighlightedLayer,
      highlightedLayer,
    } = this.props;


    if (searching || legendData === null) return null;

    return (
      <SidebarLegend
        toggleLayerVisibility={toggleLayerVisibility}
        hiddenLayers={hiddenLayers}
        legendData={legendData}
        setHighlightedLayer={setHighlightedLayer}
        highlightedLayer={highlightedLayer}
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
      searchFeatures,
      searchByText,
    } = this.props;
    if (!sidebarOpen) return null;
    return (
      <div className="sidebar">
        <SidebarSearchBar
          searchFeatures={searchFeatures}
          searchByText={searchByText}
        />
        <div className="sidebar__inner">
          {this.getLegend()}
          {this.getSearchResults()}
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  availableViews: [],
  currentView: null,
  searchFeatures: [],
  legendData: null,
  highlightedLayer: null,
};

Sidebar.propTypes = {
  /** all layers and swatches */
  legendData: PropTypes.arrayOf(PropTypes.object),
  /** if sidebar is currently displaying search results */
  searching: PropTypes.bool.isRequired,
  /** All views for selected year */
  availableViews: PropTypes.arrayOf(PropTypes.object),
  /** All base layers for selected year (e.g. roads, buildings, etc.) */
  availableBaseLayers: PropTypes.arrayOf(PropTypes.object),
  /** All overlays for selected year */
  availableOverlays: PropTypes.arrayOf(PropTypes.object),
  /** all hydro rasters (SLR) for selected year */
  availableHydroRasters: PropTypes.arrayOf(PropTypes.object),
  /** All choropleth layers for selected year */
  availableChoropleth: PropTypes.arrayOf(PropTypes.object),
  /** Current range slider values for available choropleths */
  choroplethValues: PropTypes.arrayOf(PropTypes.object),
  /** Current slider values for hydro raster layers */
  hydroRasterValues: PropTypes.arrayOf(PropTypes.object),
  /** Selected view */
  currentView: PropTypes.shape({
    name: PropTypes.string,
  }),
  /**
   * Set app `currentView` state.
   * @param {Object} view A viewshed object
   * */
  setView: PropTypes.func.isRequired,
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
};

export default Sidebar;
