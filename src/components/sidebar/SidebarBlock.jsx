import React from 'react';
import PropTypes from 'prop-types';

/**
 * This is a simple wrapper component a child node
 * (filmstrip or list of layers) into a sidebar layout block.
 * Layout block has a layer category name (e.g. Vulnerability, Views)
 * and can be expanded or collapsed.
 *
 * App -> Sidebar -> SidebarBlock
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
  /** Child nodes to be rendered into block */
  children: PropTypes.node.isRequired,
};

export default SidebarBlock;
