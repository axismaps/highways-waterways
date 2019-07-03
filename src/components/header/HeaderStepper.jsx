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
    return (
      <div className="header__stepper">
        Stepper
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
