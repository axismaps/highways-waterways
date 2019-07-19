import React from 'react';
import PropTypes from 'prop-types';
import SidebarLayersBlock from './SidebarLayersBlock';
import SidebarBlock from './SidebarBlock';

/**
 * This component displays the map legend--map layers,
 * raster filmstrips, layer filters, etc.
 *
 * App -> Sidebar-> SidebarBlock -> SidebarLegend
 */

// <SidebarBlock>
// <SidebarViewFilmstrip
//   setView={setView}
//   currentView={currentView}
//   availableViews={availableViews}
// />
// </SidebarBlock>

class SidebarLegend extends React.PureComponent {
  drawOverlayFilmstrip() {

  }

  drawViewFilmstrip() {

  }

  drawLayerBlocks() {
    const {
      hiddenLayers,
      legendData,
      toggleLayerVisibility,
      highlightedLayer,
      setHighlightedLayer,
    } = this.props;
    return legendData.map(legendGroup => (
      <SidebarLayersBlock
        highlightedLayer={highlightedLayer}
        setHighlightedLayer={setHighlightedLayer}
        key={legendGroup.id}
        mapLayers={legendGroup.Types}
        groupTitle={legendGroup.title}
        groupName={legendGroup.name}
        toggleLayerVisibility={toggleLayerVisibility}
        hidden={hiddenLayers.includes(legendGroup.name)}
      />
    ));
  }

  render() {
    // draw film strips, hydrolayers, etc.
    return (
      <div className="sidebar__legend">
        <SidebarBlock>
          {this.drawLayerBlocks()}
        </SidebarBlock>
      </div>
    );
  }
}

SidebarLegend.defaultProps = {
  highlightedLayer: null,
};

SidebarLegend.propTypes = {
  /** all layers and swatches */
  legendData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** layers (ids) currently turned off */
  hiddenLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** toggles layer groups on/off */
  toggleLayerVisibility: PropTypes.func.isRequired,
  /** currently highlighted layer */
  highlightedLayer: PropTypes.string,
  /** callback to set highlightedLayer (layer id/name) */
  setHighlightedLayer: PropTypes.func.isRequired,
};

export default SidebarLegend;
