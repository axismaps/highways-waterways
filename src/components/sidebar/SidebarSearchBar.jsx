import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
} from '@fortawesome/pro-regular-svg-icons';

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

class SidebarSearchBar extends React.PureComponent {
  render() {
    return (
      <div className="sidebar__search-row">
        <input
          type="text"
          className="sidebar__text-input"
          placeholder="Search this year..."
        />
        <div className="sidebar__search-row-right">
          <div className="sidebar__search-area-button">area</div>
          <div className="sidebar__search-row-divider" />
          <div className="sidebar__toggle-button">
            <FontAwesomeIcon
              icon={faAngleDoubleLeft}
            />
          </div>
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
