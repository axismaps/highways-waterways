import React from 'react';
import PropTypes from 'prop-types';
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
      // setTileRange,
      // tileRanges,
    } = this.props;

    return (
      <HeaderStepper
        year={year}
        setYear={setYear}
        // setTileRange={setTileRange}
        // tileRanges={tileRanges}
      />
    );
  }

  getTimeline() {
    const {
      year,
      setYear,
    } = this.props;

    return (
      <HeaderTimeline
        year={year}
        setYear={setYear}
      />
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
          {this.getStepper()}
          {this.getTimeline()}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  mobile: PropTypes.bool.isRequired,
  /** Current year */
  year: PropTypes.number.isRequired,
  /** Sets application year */
  setYear: PropTypes.func.isRequired,
  // /** Sets year range to load in Atlas tiles */
  // setTileRange: PropTypes.func.isRequired,
  // /** All tile ranges */
  // tileRanges: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default Header;
