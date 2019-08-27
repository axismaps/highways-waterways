import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/pro-solid-svg-icons';
import HeaderStepper from './HeaderStepper';
import HeaderTimeline from './HeaderTimeline';
import './Header.scss';
import './HeaderMobile.scss';

/**
 * This component establishes the layout of and passing props to
 * the header components--timeline, year stepper.
 *
 * App -> Header
 */

class Header extends React.PureComponent {
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
    } = this.props;

    return (
      <HeaderTimeline
        year={year}
        setYear={setYear}
        mobile={mobile}
        yearRange={yearRange}
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

  render() {
    const { mobile } = this.props;

    let containerName = 'header';
    if (mobile) {
      containerName += ` ${containerName}--mobile`;
    }

    return (
      <div className={containerName}>
        <div className="header__inner">
          <div className="header__top">
            <div className="header__top-title">
              Highways + Waterways
            </div>
            <div className="header__top-right">
            </div>
          </div>
          <div className="header__timeline-row">
            {this.getStepper()}
            {this.getTimeline()}
          </div>
          {this.getSidebarButton()}
        </div>
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
