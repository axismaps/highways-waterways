import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component renders a list of map layers
 * into a Sidebar block. Map layers depend on current year.
 * Map layers can be toggled on/off, changing their status
 * in the Sidebar as well as toggling on the map. The parameters of
 * some layers (sea level rise value sliders, choropleth range sliders)
 * can be changed, updating the visualization on the map. Some layers can be
 * selected, highlighting corresponding features on the map.
 *
 * App -> Sidebar-> SidebarBlock -> SidebarLayersBlock
 */

class SidebarLayersBlock extends React.PureComponent {
  render() {
    return (
      <div className="sidebar__layers-block">
        Layers block
      </div>
    );
  }
}


SidebarLayersBlock.defaultProps = {
  mapLayers: [],
  currentLayers: [],
  highlightedLayer: null,
};

SidebarLayersBlock.propTypes = {
  /** map layers to be rendered in block */
  mapLayers: PropTypes.arrayOf(PropTypes.object),
  /** layer ids of all layers currently on */
  currentLayers: PropTypes.arrayOf(PropTypes.string),
  /** callback to toggle layers */
  toggleLayer: PropTypes.func.isRequired,
  /** currently highlighted layer */
  highlightedLayer: PropTypes.object,
  /** callback to set highlightedLayer */
  highlightLayer: PropTypes.func.isRequired,
};

export default SidebarLayersBlock;
