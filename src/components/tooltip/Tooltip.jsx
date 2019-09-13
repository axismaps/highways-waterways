import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Tooltip.scss';

const tooltipRoot = document.getElementById('tooltip-root');


/**
 * This component displays a mouse hover data probe.
 * Tooltip position and content are passed to it by
 * its parent component. Displays when hovering
 * over Sidebar film strip thumbnails, Sidebar
 * layer sliders, and Atlas view icons.
 *
 * App -> Sidebar -> SidebarBlock -> SidebarViewFilmstrip -> Tooltip
 *
 * App -> Sidebar -> SidebarBlock -> SidebarLayersBlock
 * -> SliderLayer -> Tooltip
 *
 * App -> Atlas -> Tooltip
 */

class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    tooltipRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    tooltipRoot.removeChild(this.el);
  }

  render() {
    const {
      x,
      y,
      children,
      width,
    } = this.props;
    const style = {
      width: `${width}px`,
      top: `${y}px`,
      left: `${x}px`,
    };

    const tooltip = (
      <div className="tooltip" style={style}>
        <div className="tooltip__inner">
          {children}
        </div>
      </div>
    );

    return ReactDOM.createPortal(
      tooltip,
      this.el,
    );
  }
}

Tooltip.defaultProps = {
  width: 100,
};

Tooltip.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]).isRequired,
  width: PropTypes.number,
};

export default Tooltip;
