import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLevelUp,
  faToggleOff,
  faToggleOn
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
  getTitleSwitch() {
    const { hidden, toggleLayerVisibility, groupId } = this.props;

    const icon = hidden ? faToggleOff : faToggleOn;
    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={() => toggleLayerVisibility(groupId)}
      />
    );
  }

  drawLayerRow(layer) {
    const { setHighlightedLayer, highlightedLayer } = this.props;

    let buttonClass = 'sidebar__layer-button';
    if (highlightedLayer === layer.id) {
      buttonClass += ` ${buttonClass}--highlighted`;
    }

    return (
      <div className="sidebar__layer-row" key={layer.id}>
        <div
          className={buttonClass}
          onClick={() => setHighlightedLayer(layer.id)}
        >
          <div className="sidebar__layer-button-inner">{layer.title}</div>
        </div>
        <div
          className="sidebar__layer-swatch"
          style={{ backgroundColor: layer.swatch }}
        />
      </div>
    );
  }

  drawTitleRow() {
    const { groupTitle } = this.props;
    return (
      <div className="sidebar__layers-title-row">
        <div className="sidebar__layers-title-left">
          <FontAwesomeIcon icon={faLevelUp} rotation={90} />
          <div className="sidebar__layers-title">
            <div className="sidebar__layers-title">{groupTitle}</div>
          </div>
        </div>
        <div className="sidebar__layers-title-right">
          {this.getTitleSwitch()}
        </div>
      </div>
    );
  }

  drawLayerRows() {
    const { mapLayers } = this.props;
    return mapLayers.map(layer => this.drawLayerRow(layer));
  }

  render() {
    const { firstBlock } = this.props;
    let containerClass = 'sidebar__layers-block';
    if (firstBlock) {
      containerClass += `${containerClass}--first`;
    }
    return (
      <div className={containerClass}>
        {this.drawTitleRow()}
        {this.drawLayerRows()}
      </div>
    );
  }
}

SidebarLayersBlock.defaultProps = {
  mapLayers: [],
  highlightedLayer: null,
  hidden: false
};

SidebarLayersBlock.propTypes = {
  /** block is first in the list of layer blocks */
  firstBlock: PropTypes.bool.isRequired,
  /** layer group display name */
  groupTitle: PropTypes.string.isRequired,
  /** layer group mapbox (id) name */
  groupId: PropTypes.string.isRequired,
  /** map layers to be rendered in block */
  mapLayers: PropTypes.arrayOf(PropTypes.object),
  /** callback to toggle layers */
  toggleLayerVisibility: PropTypes.func.isRequired,
  /** if layer is currently turned off */
  hidden: PropTypes.bool,
  /** currently highlighted layer id */
  highlightedLayer: PropTypes.string,
  /** callback to set highlightedLayer (layer id/name) */
  setHighlightedLayer: PropTypes.func.isRequired
};

export default SidebarLayersBlock;
