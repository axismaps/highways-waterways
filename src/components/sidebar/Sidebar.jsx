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
  constructor(props) {
    super(props);
    this.loggedInputText = '';
    this.logInputText = this.logInputText.bind(this);
  }

  logInputText(inputText) {
    this.loggedInputText = inputText;
  }

  getLegend() {
    const {
      searchView,
      legendData,
      viewsData,
      overlaysData,
      choroplethData,
      choroplethValues,
      setChoroplethValue,
      hydroRasterData,
      hydroRasterValues,
      hiddenLayers,
      toggleLayerVisibility,
      setHighlightedLayer,
      highlightedLayer,
      setRaster,
    } = this.props;


    if (searchView || legendData === null) return null;

    return (
      <SidebarLegend
        setChoroplethValue={setChoroplethValue}
        setRaster={setRaster}
        viewsData={viewsData}
        overlaysData={overlaysData}
        choroplethData={choroplethData}
        hydroRasterData={hydroRasterData}
        choroplethValues={choroplethValues}
        hydroRasterValues={hydroRasterValues}
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
      clearSearch,
      searchView,
      searchByText,
      toggleAreaSearching,
      toggleSidebar,
    } = this.props;

    return (
      <SidebarSearchBar
        logInputText={this.logInputText}
        initialText={this.loggedInputText}
        clearSearch={clearSearch}
        searchByText={searchByText}
        searchView={searchView}
        toggleAreaSearching={toggleAreaSearching}
        toggleSidebar={toggleSidebar}
      />
    );
  }

  getSearchResults() {
    const {
      highlightedFeature,
      searchView,
      searchFeatures,
      setHighlightedFeature,
    } = this.props;

    if (searchView === null) return null;

    return (
      <SidebarSearchResults
        highlightedFeature={highlightedFeature}
        searchFeatures={searchFeatures}
        setHighlightedFeature={setHighlightedFeature}
      />
    );
  }

  render() {
    const {
      sidebarOpen,
      mobile,
    } = this.props;
    if (!sidebarOpen) return null;
    let containerClass = 'sidebar';
    if (mobile) {
      containerClass += ` ${containerClass}--mobile`;
    }
    return (
      <div className={containerClass}>
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
  legendData: null,
  highlightedFeature: null,
  highlightedLayer: null,
  searchFeatures: [],
  searchView: null,
};

Sidebar.propTypes = {
  /** callback to clear application search features */
  clearSearch: PropTypes.func.isRequired,
  /** All choropleth layers for selected year */
  choroplethData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Current range slider values for available choropleths */
  choroplethValues: PropTypes.instanceOf(Map).isRequired,
  /** layer ids of all layers currently off */
  hiddenLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlightedFeature: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
  }),
  /** currently highlighted layer id */
  highlightedLayer: PropTypes.string,
  /** all hydro rasters (SLR) for selected year */
  hydroRasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Current slider values for hydro raster layers */
  hydroRasterValues: PropTypes.instanceOf(Map).isRequired,
  /** all layers and swatches */
  legendData: PropTypes.arrayOf(PropTypes.object),
  /** if app is on mobile device */
  mobile: PropTypes.bool.isRequired,
  /** All overlays for selected year */
  overlaysData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** callback to set text search value */
  searchByText: PropTypes.func.isRequired,
  /** Results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
  /** if sidebar is currently displaying search results */
  searchView: PropTypes.string,
  /** Sets choropleth filter values */
  setChoroplethValue: PropTypes.func.isRequired,
  /** Sets hydroRaster filter values */
  // setHydroRasterValue: PropTypes.func.isRequired,
  /** callback to highlight feature (GeoJSON feature object) */
  setHighlightedFeature: PropTypes.func.isRequired,
  /** callback to set highlightedLayer (layer id/name) */
  setHighlightedLayer: PropTypes.func.isRequired,
  /**
   * Set app `currentRaster` state.
   * @param {Object} raster A raster object
   * */
  setRaster: PropTypes.func.isRequired,
  /** If sidebar is open or collapsed */
  sidebarOpen: PropTypes.bool.isRequired,
  /** turn on app area search mode */
  toggleAreaSearching: PropTypes.func.isRequired,
  /** callback to toggle layers */
  toggleLayerVisibility: PropTypes.func.isRequired,
  /** callback to close sidebar */
  toggleSidebar: PropTypes.func.isRequired,
  /** All views for selected year */
  viewsData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
