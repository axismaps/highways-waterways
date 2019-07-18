import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLevelUp,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/pro-regular-svg-icons';

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


  static drawLayerRow(layer) {
    return (
      <div
        className="sidebar__layer-row"
        key={layer.name}
      >
        {layer.title}
      </div>
    );
  }

  getTitleSwitch() {
    const {
      hidden,
      toggleLayerVisibility,
      groupName,
    } = this.props;

    const icon = hidden
      ? faToggleOff
      : faToggleOn;
    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={() => toggleLayerVisibility(groupName)}
      />
    );
  }

  drawTitleRow() {
    const {
      groupTitle,
    } = this.props;
    return (
      <div className="sidebar__layers-title-row">
        <div className="sidebar__layers-title-left">
          <FontAwesomeIcon
            icon={faLevelUp}
            rotation={90}
          />
          <div className="sidebar__layers-title">
            <div className="sidebar__layers-title">
              {groupTitle}
            </div>
          </div>
        </div>
        <div className="sidebar__layers-title-right">
          {this.getTitleSwitch()}
        </div>
      </div>
    );
  }

  drawLayerRows() {
    const {
      mapLayers,
    } = this.props;
    return mapLayers.map(layer => SidebarLayersBlock.drawLayerRow(layer));
  }

  render() {
    return (
      <div className="sidebar__layers-block">
        {this.drawTitleRow()}
        {this.drawLayerRows()}
      </div>
    );
  }
}


SidebarLayersBlock.defaultProps = {
  mapLayers: [],
  currentLayers: [],
  highlightedLayer: null,
  hidden: false,
};

SidebarLayersBlock.propTypes = {
  /** layer group title (roads, etc.) */
  groupTitle: PropTypes.string.isRequired,
  /** map layers to be rendered in block */
  mapLayers: PropTypes.arrayOf(PropTypes.object),
  /** layer ids of all layers currently on */
  currentLayers: PropTypes.arrayOf(PropTypes.string),
  /** callback to toggle layers */
  toggleLayerVisibility: PropTypes.func,
  /** currently highlighted layer */
  highlightedLayer: PropTypes.object,
  /** callback to set highlightedLayer */
  highlightLayer: PropTypes.func,
  /** if layer is currently turned off */
  hidden: PropTypes.bool,
};

export default SidebarLayersBlock;
