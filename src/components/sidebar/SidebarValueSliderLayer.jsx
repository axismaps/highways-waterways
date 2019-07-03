import React from 'react';
import PropTypes from 'prop-types';
/**
 * This component renders a value slider for a hydro raster layer (e.g. sea level rise)
 *
 * The slider displays the current value for a hydro raster layer.
 * Changing the slider value changes the value of that layer on the map.
 *
 * App -> Sidebar -> SidebarBlock -> SidebarLayersBlock -> SidebarValueSliderLayer
 */
class SidebarValueSliderLayer extends React.PureComponent {
  render() {
    return (
      <div className="sidebar__value-slider">
        Value slider
      </div>
    );
  }
}

SidebarValueSliderLayer.propTypes = {
  /** Current layer value */
  currentValue: PropTypes.number,
  /** Layer overall value range */
  sliderRange: PropTypes.arrayOf(PropTypes.number),
  /** Layer color */
  colorRamp: PropTypes.string,
};

export default SidebarValueSliderLayer;
