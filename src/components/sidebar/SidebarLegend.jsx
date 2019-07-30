import React from 'react';
import PropTypes from 'prop-types';
import SidebarLayersBlock from './SidebarLayersBlock';
import SidebarBlock from './SidebarBlock';
import SidebarFilmstrip from './SidebarFilmstrip';

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
    const {
      viewsData,
      setRaster,
    } = this.props;
    if (viewsData.length === 0) return null;

    const thumbs = viewsData.map(view => (
      <div
        key={view.id}
        className="sidebar__view-thumb"
        onClick={() => {
          setRaster({
            type: 'view',
            raster: view,
          });
        }}
      />
    ));
    return (
      <SidebarBlock
        title="views"
        icon="x"
      >
        <div className="sidebar__filmstrip">
          {thumbs}
        </div>
      </SidebarBlock>
    );
  }

  drawLayerBlocks() {
    const {
      hiddenLayers,
      legendData,
      toggleLayerVisibility,
      highlightedLayer,
      setHighlightedLayer,
    } = this.props;
    if (legendData.length === 0) return null;
    const layerBlocks = legendData.map(legendGroup => (
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
    return (
      <SidebarBlock>
        {layerBlocks}
      </SidebarBlock>
    );
  }

  render() {
    // draw film strips, hydrolayers, etc.
    return (
      <div className="sidebar__legend">
        {this.drawViewFilmstrip()}
        {this.drawLayerBlocks()}
      </div>
    );
  }
}

SidebarLegend.defaultProps = {
  highlightedLayer: null,
};

SidebarLegend.propTypes = {
  /** All views for selected year */
  viewsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All overlays for selected year */
  overlaysData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** all hydro rasters (SLR) for selected year */
  hydroRasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All choropleth layers for selected year */
  choroplethData: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  /** Callbak to set app `currentRaster` state field */
  setRaster: PropTypes.func.isRequired,
};

export default SidebarLegend;
