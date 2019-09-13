import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sidebar viewshed filmstrip component.
 *
 * This component displays thumbnails of map rasters.
 * Clicking a thumbnail causes the map to pan to and
 * display the corresponding viewshed or overlay.
 * For view rasters, hovering over a thumbnail also displays relevant viewshed on the map
 * and displays data probe tooltip.
 * Clicking toggle button expands or collapses filmstrip.
 * Displays number of rasters in filmstrip.
 * Component depends on the loaded raster view data for the selected year
 * and the currently selected viewshed.
 *
 * App -> Sidebar -> SidebarBlock -> SidebarViewFilmstrip
 */

class SidebarViewFilmstrip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  /**
   * Returns expand/collapse button node
  */
  getMoreButton() {
    const toggleExpansion = () => {
      const { expanded } = this.state;
      this.setState({
        expanded: !expanded,
      });
    };
    return (
      <div
        className="filmstrip__toggle"
        onClick={toggleExpansion}
      >
        Toggle Button
      </div>
    );
  }

  /**
   * Return array of thumbnail nodes
  */
  getViewThumbs() {
    const {
      rasterData,
      setRaster,
    } = this.props;

    return rasterData.map(view => (
      <div
        className="filmstrip__thumbnail"
        onClick={() => setRaster(view)}
      >
        {view.name}
      </div>
    ));
  }

  getCountDisplay() {
    const { rasterData } = this.props;
    return (
      <div className="filmstrip__count">
        {rasterData.length}
      </div>
    );
  }

  render() {
    const { expanded } = this.state;
    let containerClass = 'sidebar__filmstrip';
    if (expanded) {
      containerClass += ` ${containerClass}--expanded`;
    }
    return (
      <div className={containerClass}>
        {this.getViewThumbs()}
        {this.getMoreButton()}
        {this.getCountDisplay()}
      </div>
    );
  }
}

SidebarViewFilmstrip.propTypes = {
  /** Available rasters */
  rasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Set app `currentView` or `currentOverlay` state.
   * @param {Object} raster A viewshed or overlay object
   * */
  setRaster: PropTypes.func.isRequired,
};

export default SidebarViewFilmstrip;
