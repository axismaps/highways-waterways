import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faSearch,
} from '@fortawesome/pro-regular-svg-icons';
import {
  faArrowCircleLeft,
} from '@fortawesome/pro-solid-svg-icons';
import AreaIcon from './SidebarAreaIcon';

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
  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const {
      searchView,
      initialText,
    } = this.props;
    if (this.inputRef.current !== undefined && searchView !== null) {
      this.inputRef.current.value = initialText;
    }
  }

  getSearchIcon() {
    const {
      searchView,
      clearSearch,
    } = this.props;
    const {
      inputFocused,
    } = this.state;
    let searchIcon;
    let iconClass = 'sidebar__search-icon';
    if (searchView !== null || inputFocused) {
      searchIcon = (
        <FontAwesomeIcon
          icon={faArrowCircleLeft}
          onClick={() => {
            this.clearSearchText();
            clearSearch();
          }}
        />
      );
      iconClass += ` ${iconClass}--return`;
    } else {
      searchIcon = <FontAwesomeIcon icon={faSearch} />;
    }

    return (
      <div className={iconClass}>
        {searchIcon}
      </div>
    );
  }

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
      searchView,
      logInputText,
    } = this.props;

    return (
      <div className="sidebar__search-row sidebar__search-row--search">
        <div className="sidebar__search-row-left">
          
          {this.getSearchIcon()}

          <input
            type="text"
            className="sidebar__text-input"
            placeholder="Search this year..."
            onChange={searchByText}
            onFocus={() => {
              this.setState({
                inputFocused: true,
              });
            }}
            onBlur={() => {
              if (searchView === null) {
                this.clearSearchText();
              }
              this.setState({
                inputFocused: false,
              });
            }}
            ref={this.inputRef}
          />
        </div>
        <div className="sidebar__search-row-right">
          <div
            className="sidebar__search-area-button"
            onClick={toggleAreaSearching}
          >
            <AreaIcon />
          </div>
          <div className="sidebar__search-row-divider" />
          <div
            className="sidebar__toggle-button"
            onClick={() => {
              logInputText(this.inputRef.current.value);
              toggleSidebar();
            }}
          >
            <FontAwesomeIcon
              icon={faAngleDoubleLeft}
            />
          </div>
        </div>
      </div>
    );
  }

  clearSearchText() {
    const inputNode = this.inputRef.current;
    if (inputNode !== undefined) {
      inputNode.value = '';
    }
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
  /** callback to set application text search value */
  searchByText: PropTypes.func.isRequired,
  /** callback to clear application search features */
  clearSearch: PropTypes.func.isRequired,
  /** turn on app area search mode */
  toggleAreaSearching: PropTypes.func.isRequired,
  /** callback to close sidebar */
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarSearchBar;
