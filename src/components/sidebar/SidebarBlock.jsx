import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple wrapper component. Render child node into layout block.
 */

class SidebarBlock extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="sidebar__block">
        {children}
      </div>
    );
  }
}

SidebarBlock.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SidebarBlock;
