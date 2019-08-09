import React from 'react';
import PropTypes from 'prop-types';

class AreaSearchBox extends React.PureComponent {
  render() {
    const {
      areaBox,
    } = this.props;
    const {
      start,
      end,
    } = areaBox;

    console.log('start', start);
    console.log('end', end);

    const boxStyle = {
      position: 'absolute',
      left: `${start[0]}px`,
      top: `${start[1]}px`,
      width: '-50px',
      height: '50px',
      background: 'rgba(0, 0, 0, 0.9)',
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

