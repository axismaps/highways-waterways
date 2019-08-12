import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
} from '@fortawesome/pro-regular-svg-icons';
import {
  faArrowCircleLeft,
} from '@fortawesome/pro-solid-svg-icons';


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
  getReturnBar() {
    const {
      clearSearch,
    } = this.props;
    return (
      <div
        className="sidebar__search-row sidebar__search-row--return"
        onClick={clearSearch}
      >
        <div className="sidebar__search-back-icon">
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </div>
        <div className="sidebar__search-back-text">
          Back to Legend
        </div>
      </div>
    );
  }

  getSearchBar() {
    const {
      searchByText,
      toggleSidebar,
      toggleAreaSearching,
    } = this.props;


    return (
      <div className="sidebar__search-row sidebar__search-row--search">
        <input
          type="text"
          className="sidebar__text-input"
          placeholder="Search this year..."
          onChange={searchByText}
        />
        <div className="sidebar__search-row-right">
          <div
            className="sidebar__search-area-button"
            onClick={toggleAreaSearching}
          >
            area
          </div>
          <div className="sidebar__search-row-divider" />
          <div
            className="sidebar__toggle-button"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon
              icon={faAngleDoubleLeft}
            />
          </div>
        </div>
      </div>
    );
  }


  render() {
    const {
      searchView,
    } = this.props;
    if (searchView === 'atlas') {
      return this.getReturnBar();
    }
    return this.getSearchBar();
  }
}

SidebarSearchBar.defaultProps = {
  searchView: null,
};

SidebarSearchBar.propTypes = {
  /** Current search view (null, atlas, or text) */
  searchView: PropTypes.string,
  /** callback to highlight feature */
  highlightFeature: PropTypes.func,
  /** callback to set application text search value */
  setTextSearch: PropTypes.func,
  /** callback to clear application search features */
  clearSearch: PropTypes.func,
  /** turn on app area search mode */
  toggleAreaSearching: PropTypes.func.isRequired,
  /** callback to close sidebar */
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarSearchBar;
