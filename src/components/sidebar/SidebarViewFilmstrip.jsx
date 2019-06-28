import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sidebar viewshed filmstrip component.
 *
 * This component displays thumbnails of viewshed rasters.
 * Clicking a thumbnail causes the map to pan to and
 * display the corresponding viewshed.
 * Hovering over a thumbnail also displays relevant viewshed on the map
 * and displays data probe tooltip.
 * Clicking toggle button expands or collapses filmstrip.
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
      views,
      currentView,
      setView,
    } = this.props;

    const isCurrentView = view => view === currentView;

    return views.map((view) => {
      let thumbClass = 'filmstrip__thumbnail';
      if (isCurrentView(view)) {
        thumbClass += ` ${thumbClass}--selected`;
      }
      return (
        <div
          className={thumbClass}
          onClick={() => setView(view)}
        >
          {view.name}
        </div>
      );
    });
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
      </div>
    );
  }
}

SidebarViewFilmstrip.defaultProps = {
  views: [],
  currentView: null,
};

SidebarViewFilmstrip.propTypes = {
  /** Available view rasters */
  views: PropTypes.arrayOf(PropTypes.object),
  /** Selected views */
  currentView: PropTypes.object,
  /**
   * Set app `currentView` state.
   * @param {Object} view A viewshed object
   * */
  setView: PropTypes.func.isRequired,
};

export default SidebarViewFilmstrip;
