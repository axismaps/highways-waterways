import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChevronCircleLeft,
// } from '@fortawesome/pro-solid-svg-icons';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-regular-svg-icons';

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
    };
    return (
      <div className="header__stepper">
        <div
          className="header__stepper-button"
          onClick={stepBack}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
          />
        </div>
        <div className="header__stepper-year">
          {roundYear}
        </div>
        <div
          className="header__stepper-button"
          onClick={stepForward}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            
          />
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
