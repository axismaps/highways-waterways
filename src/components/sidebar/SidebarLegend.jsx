import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
} from '@fortawesome/pro-solid-svg-icons';
import SidebarLayersBlock from './SidebarLayersBlock';
import SidebarBlock from './SidebarBlock';
import SidebarVulnerabilityLayer from './SidebarVulnerabilityLayer';

// import SidebarFilmstrip from './SidebarFilmstrip';

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
        title="Views"
        icon={<FontAwesomeIcon icon={faCamera} />}
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

    const layerBlocks = legendData.map((legendGroup, i) => (
      <SidebarLayersBlock
        firstBlock={i === 0}
        highlightedLayer={highlightedLayer}
        setHighlightedLayer={setHighlightedLayer}
        key={legendGroup.id}
        mapLayers={legendGroup.Types}
        groupTitle={legendGroup.title}
        groupId={legendGroup.id}
        toggleLayerVisibility={toggleLayerVisibility}
        hidden={hiddenLayers.includes(legendGroup.id)}
      />
    ));
    // this block should be split into categories
    return (
      <SidebarBlock
        title="Environment"
      >
        {layerBlocks}
      </SidebarBlock>
    );
  }

  drawVulnerability() {
    const {
      choroplethData,
      choroplethValues,
      hiddenLayers,
      setChoroplethValue,
      toggleLayerVisibility,
    } = this.props;

    const choroplethBlocks = choroplethData.map((d) => {
      const {
        name,
        id,
        minValue,
        maxValue,
        colorRamp,
      } = d;

      return (
        <SidebarVulnerabilityLayer
          colorRamp={colorRamp}
          hidden={hiddenLayers.includes(id)}
          id={id}
          key={id}
          setChoroplethValue={setChoroplethValue}
          name={name}
          minValue={minValue}
          maxValue={maxValue}
          value={choroplethValues.get(id)}
          toggleLayerVisibility={toggleLayerVisibility}
        />
      );
    });
    return (
      <SidebarBlock
        title="Vulnerability"
      >
        {choroplethBlocks}
      </SidebarBlock>
    );
  }

  render() {
    // draw film strips, hydrolayers, etc.
    return (
      <div className="sidebar__legend">
        {this.drawVulnerability()}
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
  /** Sets choropleth filter values */
  setChoroplethValue: PropTypes.func.isRequired,
  /** All views for selected year */
  viewsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All overlays for selected year */
  overlaysData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** all hydro rasters (SLR) for selected year */
  hydroRasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All choropleth layers for selected year */
  choroplethData: PropTypes.arrayOf(PropTypes.object).isRequired,
  choroplethValues: PropTypes.instanceOf(Map).isRequired,
  hydroRasterValues: PropTypes.instanceOf(Map).isRequired,
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
