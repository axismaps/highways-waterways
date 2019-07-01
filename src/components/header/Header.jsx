import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component establishes the layout of and passing props to
 * the header components--timeline, year stepper.
 *
 * App -> Header
 */

class Header extends React.PureComponent {
  render() {
    return (
      <div className="header">
        Header
      </div>
    );
  }
}

Header.propTypes = {
  /** Current year */
  year: PropTypes.number,
  /** Sets application year */
  setYear: PropTypes.func,
};

export default Header;
