import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
console.log('faMinus', faMinus);
/**
 * This is a simple wrapper component a child node
 * (filmstrip or list of layers) into a sidebar layout block.
 * Layout block has a layer category name (e.g. Vulnerability, Views)
 * and can be expanded or collapsed.
 *
 * App -> Sidebar -> SidebarBlock
 */

class SidebarBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  getBlockTitle() {
    const {
      title,
      icon,
    } = this.props;
    const { collapsed } = this.state;

    const toggleBlock = () => {
      
      this.setState({
        collapsed: !collapsed,
      });
    };

    const toggleIcon = collapsed
      ? faPlus
      : faMinus;

    return (
      <div className="sidebar__block-title-row">
        <div className="sidebar__block-title-row-left">
          <div className="sidebar__block-title-icon">
            {icon}
          </div>
          <div className="sidebar__block-title-text">
            {title}
          </div>
        </div>
        <div className="sidebar__block-title-row-right">
          <div
            className="sidebar__block-toggle-button"
            onClick={toggleBlock}
          >
            <FontAwesomeIcon icon={toggleIcon} />
          </div>
        </div>
      </div>
    );
  }

  getBlockContent() {
    const {
      children,
    } = this.props;
    const {
      collapsed,
    } = this.state;

    if (collapsed) return null;
    return (
      <div className="sidebar__block">
        {children}
      </div>
    );
  }

  render() {
    const {
      children,
      title,
    } = this.props;
    return (
      <div className="sidebar__block-outer">
        {this.getBlockTitle()}
        {this.getBlockContent()}
      </div>
    );
  }
}

SidebarBlock.defaultProps = {
  title: null,
};

SidebarBlock.propTypes = {
  /** Child nodes to be rendered into block */
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SidebarBlock;
