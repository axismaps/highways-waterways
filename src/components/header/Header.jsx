import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faInfo,
  faSearch,
  faShare,
} from '@fortawesome/pro-solid-svg-icons';
import HeaderStepper from './HeaderStepper';
import HeaderTimeline from './HeaderTimeline';
import Dropdown from '../dropdown/Dropdown';
import './Header.scss';
import './HeaderMobile.scss';

/**
 * This component establishes the layout of and passing props to
 * the header components--timeline, year stepper.
 *
 * App -> Header
 */

class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      dropdownPos: null,
    };

    this.shareButtonRef = React.createRef();

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    this.setDropdownPos();
  }

  getHeaderTop() {
    return (
      <div className="header__top">
        <div className="header__top-title">
          Highways + Waterways
        </div>
        <div className="header__top-right">
          <div
            className="header__top-button"
            ref={this.shareButtonRef}
            onClick={this.toggleDropdown}
          >
            <FontAwesomeIcon icon={faShare} />
          </div>
          <div className="header__top-button">
            <FontAwesomeIcon icon={faInfo} />
          </div>
          <div className="header__top-button">
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </div>
      </div>
    );
  }

  getStepper() {
    const {
      year,
      setYear,
    } = this.props;

    return (
      <HeaderStepper
        year={year}
        setYear={setYear}
      />
    );
  }

  getTimeline() {
    const {
      year,
      setYear,
      mobile,
      yearRange,
      screenWidth,
    } = this.props;

    return (
      <HeaderTimeline
        year={year}
        setYear={setYear}
        mobile={mobile}
        yearRange={yearRange}
        screenWidth={screenWidth}
      />
    );
  }

  getSidebarButton() {
    const {
      toggleSidebar,
      mobile,
    } = this.props;
    if (!mobile) return null;
    return (
      <div className="header__sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faSearch} />
      </div>
    );
  }

  getDropdown() {
    const {
      dropdownPos,
      dropdownOpen,
    } = this.state;
    console.log('open', dropdownOpen);
    console.log('pos', dropdownPos);
    if (!dropdownOpen || dropdownPos === null) return null;

    const content = (
      <div>asdfasdfasdf</div>
    );

    return (
      <Dropdown
        pos={dropdownPos}
        toggleDropdown={this.toggleDropdown}
      >
        {content}
      </Dropdown>
    );
  }

  setDropdownPos() {
    const node = this.shareButtonRef.current;
    if (node === undefined) return;
    const {
      top,
      // left,
      height,
    } = node.getBoundingClientRect();
    console.log('node', node.getBoundingClientRect());
    this.setState({
      dropdownPos: {
        // left,
        right: 15,
        top: top + height + 20,
      },
    });
  }

  toggleDropdown(status) {
    const { dropdownOpen } = this.state;
    if (typeof status === 'boolean') {
      this.setState({
        dropdownOpen: status,
      });
    } else {
      this.setState({
        dropdownOpen: !dropdownOpen,
      });
    }
  }

  render() {
    const { mobile } = this.props;

    let containerName = 'header';
    if (mobile) {
      containerName += ` ${containerName}--mobile`;
    }

    return (
      <div className={containerName}>
        <div className="header__inner">
          {this.getHeaderTop()}
          <div className="header__timeline-row">
            {this.getStepper()}
            {this.getTimeline()}
          </div>
          {this.getSidebarButton()}
        </div>
        {this.getDropdown()}
      </div>
    );
  }
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  /** Current year */
  year: PropTypes.number.isRequired,
  /** range of available years */
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  /** Sets application year */
  setYear: PropTypes.func.isRequired,
  // /** Sets year range to load in Atlas tiles */
  // setTileRange: PropTypes.func.isRequired,
  // /** All tile ranges */
  // tileRanges: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default Header;
