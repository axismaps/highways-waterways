import React from 'react';
import PropTypes from 'prop-types';
import './MobileMenu.scss';

class MobileMenu extends React.PureComponent {
  render() {
    return (
      <div className="mobile-menu">
        mobile menu
      </div>
    );
  }
}

MobileMenu.defaultProps = {
  categories: [],
};

MobileMenu.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
};

export default MobileMenu;
