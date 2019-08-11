import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './AreaSearchBox.scss';

class AreaSearchBox extends React.PureComponent {
  render() {
    const {
      areaBox,
    } = this.props;
    const {
      start,
      end,
    } = areaBox;

    const left = d3.min([start[0], end[0]]);
    const top = d3.min([start[1], end[1]]);
    const width = Math.abs(start[0] - end[0]);
    const height = Math.abs(start[1] - end[1]);

    const boxStyle = {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };

    return (
      <div style={boxStyle} className="area-box" />
    );
  }
}

AreaSearchBox.propTypes = {
  areaBox: PropTypes.shape({
    start: PropTypes.arrayOf(PropTypes.number),
    end: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default AreaSearchBox;

