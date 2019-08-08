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

    const boxStyle = {

    };

    return (
      <div className="area-box" />
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

