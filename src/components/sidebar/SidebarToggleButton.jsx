import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleRight,
} from '@fortawesome/pro-regular-svg-icons';

class SidebarToggleButton extends React.PureComponent {
  render() {
    const {
      toggleSidebar,
    } = this.props;
    return (
      <div
        className="atlas__sidebar-button"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </div>
    );
  }
}

SidebarToggleButton.propTypes = {
  /** callback to toggle sidebar */
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarToggleButton;
