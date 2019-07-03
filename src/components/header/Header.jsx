import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

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
        <div className="header__inner">
          Header
        </div>
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
