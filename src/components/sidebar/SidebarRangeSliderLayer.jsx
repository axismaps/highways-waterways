import React from 'react';
import PropTypes from 'prop-types';
/**
 * This component renders a range slider for a choropleth layer.
 *
 * The slider displays the current values for a choropleth layer.
 * Changing the slider values changes the values of that layer on the map.
 *
 * App -> Sidebar -> SidebarBlock -> SidebarLayersBlock -> SidebarRangeSliderLayer
 */
class SidebarRangeSliderLayer extends React.PureComponent {
  render() {
    return (
      <div className="sidebar__range-slider">
        Range slider
      </div>
    );
  }
}

SidebarRangeSliderLayer.propTypes = {
  /** Current layer filter values */
  currentValues: PropTypes.arrayOf(PropTypes.number),
  /** Layer overall value range */
  sliderRange: PropTypes.arrayOf(PropTypes.number),
  /** Layer color ramp */
  colorRamp: PropTypes.arrayOf(PropTypes.string),
};

export default SidebarRangeSliderLayer;
