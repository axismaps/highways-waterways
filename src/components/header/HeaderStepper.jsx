import React from 'react';
import PropTypes from 'prop-types';

/**
 * This is the year stepper component.
 *
 * The component displays the current map year. Clicking stepper buttons
 * moves the application year state forward or backward, updating map
 * layers on Sidebar and data on map.
 *
 * App -> Header -> HeaderStepper
 */

class HeaderStepper extends React.PureComponent {
  render() {
    const {
      year,
      setYear,
    } = this.props;
    const roundYear = Math.round(year);
    const stepBack = () => {
      setYear(roundYear - 1);
    };
    const stepForward = () => {
      setYear(roundYear + 1);
    }
    return (
      <div className="header__stepper">
        <div
          className="header__stepper-left header__stepper-button"
          onClick={stepBack}
        >
          prev
        </div>
        <div className="header__stepper-year">
          {roundYear}
        </div>
        <div
          className="header__stepper-next header__stepper-button"
          onClick={stepForward}
        >
          next
        </div>
      </div>
    );
  }
}

HeaderStepper.propTypes = {
  /** Current year */
  year: PropTypes.number,
  /** Sets application year */
  setYear: PropTypes.func,
};

export default HeaderStepper;
