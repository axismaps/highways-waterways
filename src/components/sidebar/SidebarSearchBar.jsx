import React from 'react';
import PropTypes from 'prop-types';

/**

 *
 * This component displays the sidebar search header--text search input,
 * sidebar toggle button. Filling out the component's
 * text box sets the application text search value,
 * searching the Atlas component and displaying feature
 * results in the Sidebar (SidebarSearchResults component).
 *
 * Sidebar -> SidebarBlock -> SidebarSearchBar
 */

class SidebarSearchBar extends React.Component {
  render() {
    return (
      <div className="sidebar__search search">
        <div className="search__top-row">
          <input type="text" className="search__text-input" />
          <div className="search__area-button">area</div>
          <div className="sidebar__toggle-button">tog</div>
        </div>
        <div className="search__results">
          Search results
        </div>
      </div>
    );
  }
}

SidebarSearchBar.propTypes = {
  /** callback to highlight feature */
  highlightFeature: PropTypes.func,
  /** callback to set application text search value */
  setTextSearch: PropTypes.func,
  /** callback to clear application search features */
  clearSearch: PropTypes.func,
};

export default SidebarSearchBar;
