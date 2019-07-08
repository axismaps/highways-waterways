import React from 'react';
import PropTypes from 'prop-types';
import HeaderStepper from './HeaderStepper';
import HeaderTimeline from './HeaderTimeline';
import './Header.scss';

/**
 * This component establishes the layout of and passing props to
 * the header components--timeline, year stepper.
 *
 * App -> Header
 */

class Header extends React.PureComponent {
  render() {
    const {
      year,
      setYear,
    } = this.props;

    return (
      <div className="header">
        <div className="header__inner">
          <HeaderStepper
            year={year}
            setYear={setYear}
          />
          <HeaderTimeline
            year={year}
            setYear={setYear}
          />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  /** Current year */
  year: PropTypes.number.isRequired,
  /** Sets application year */
  setYear: PropTypes.func.isRequired,
};

export default Header;
