import React from 'react';
import PropTypes from 'prop-types';
import SidebarBlock from './SidebarBlock';
import SidebarViewFilmstrip from './SidebarViewFilmstrip';
import './Sidebar.scss';

/**
 * This component establishes the layout of and passes props to
 * all of the Sidebar map layer components (sliders, filmstrips, etc.)
 *
 * App -> Sidebar
 */

class Sidebar extends React.PureComponent {
  render() {
    const {
      setView,
      currentView,
      availableViews,
      sidebarOpen,
    } = this.props;
    if (!sidebarOpen) return null;
    return (
      <div className="sidebar">
        SIDEBAR
        <SidebarBlock>
          <SidebarViewFilmstrip
            setView={setView}
            currentView={currentView}
            availableViews={availableViews}
          />
        </SidebarBlock>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  availableViews: [],
  currentView: null,
  searchFeatures: [],
};

Sidebar.propTypes = {
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
  /** layer ids of all layers currently on */
  currentLayers: PropTypes.arrayOf(PropTypes.string),
  /** callback to toggle layers */
  toggleLayer: PropTypes.func,
  /** currently highlighted layer */
  highlightedLayer: PropTypes.object,
  /** callback to set highlightedLayer */
  highlightLayer: PropTypes.func,
  /** callback to highlight feature */
  highlightFeature: PropTypes.func,
  /** Results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
  /** callback to set application text search value */
  setTextSearch: PropTypes.func,
  /** callback to clear application search features */
  clearSearch: PropTypes.func,
};

export default Sidebar;
