import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import SidebarLayersBlock from './SidebarLayersBlock';
import SidebarBlock from './SidebarBlock';
import SidebarVulnerabilityLayer from './SidebarVulnerabilityLayer';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';

/**
 * This component displays the map legend--map layers,
 * raster filmstrips, layer filters, etc.
 *
 * App -> Sidebar-> SidebarBlock -> SidebarLegend
 */

class SidebarLegend extends React.PureComponent {
  drawViewFilmstrip() {
    const { viewsData, setRaster } = this.props;
    if (viewsData.length === 0) return null;

    const thumbs = viewsData.map((view) => {
      const viewThumbStyle = {
        backgroundImage: `url(${view.thumb})`,
      };

      return (
        <Tippy
          allowHTML={true}
          maxWidth={190}
          content={
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', fontSize: '12px' }}>
                {view.title}
              </p>
              <p style={{ fontStyle: 'italic', fontSize: '10px' }}>
                Click to view on map
              </p>
            </div>
          }
          placement="right"
          theme="translucent"
        >
          <div
            // src={view.thumb}
            style={viewThumbStyle}
            key={view.id}
            className="sidebar__view-thumb"
            onClick={() => {
              setRaster({
                type: 'view',
                raster: view,
              });
            }}
          />
        </Tippy>
      );
    });

    return (
      <SidebarBlock title="Views" icon={<FontAwesomeIcon icon={faCamera} />}>
        <div className="sidebar__filmstrip">{thumbs}</div>
      </SidebarBlock>
    );
  }

  drawSidebarOverlayDataBlock() {
    const { overlaysData, viewsData, setRaster } = this.props;

    const overlayBlocks = overlaysData.map((overlayBlock) => {
      return this.drawOverlayFilmstrip(overlayBlock);
    });
    return overlayBlocks;
  }

  drawOverlayFilmstrip(overlayBlock) {
    const { setRaster } = this.props;

    const thumbs = overlayBlock.documents.map((view) => {
      const overlayThumbStyle = {
        backgroundImage: `url(${view.thumb})`,
      };

      return (
        <Tippy
          allowHTML={true}
          maxWidth={190}
          content={
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', fontSize: '12px' }}>
                {view.title}
              </p>
              <p style={{ fontStyle: 'italic', fontSize: '10px' }}>
                Click to view on map
              </p>
            </div>
          }
          placement="right"
          theme="translucent"
        >
          <div
            style={overlayThumbStyle}
            key={view.id}
            className="sidebar__overlay-thumb"
            onClick={() => {
              setRaster({
                type: overlayBlock.title,
                raster: view,
              });
            }}
          />
        </Tippy>
      );
    });

    return (
      <SidebarBlock
        title={overlayBlock.title}
        icon={<FontAwesomeIcon icon={faCamera} />}
      >
        <div className="sidebar__filmstrip">{thumbs}</div>
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
        geometry={legendGroup.geometry}
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

    return <SidebarBlock title="Environment">{layerBlocks}</SidebarBlock>;
  }

  drawVulnerability() {
    const {
      choroplethData,
      choroplethValues,
      hiddenLayers,
      setChoroplethValue,
      toggleLayerVisibility,
      highlightedLayer,
      setHighlightedLayer,
      setSelectedThematicLayer,
    } = this.props;

    const choroplethBlocks = choroplethData.map((d) => {
      const { name, id, minValue, maxValue, slider, colorRamp, types } = d;
      return (
        <SidebarVulnerabilityLayer
          colorRamp={colorRamp}
          hidden={hiddenLayers.includes(id)}
          highlightedLayer={highlightedLayer}
          setHighlightedLayer={setHighlightedLayer}
          id={id}
          key={id}
          setChoroplethValue={setChoroplethValue}
          setSelectedThematicLayer={setSelectedThematicLayer}
          name={name}
          minValue={minValue}
          maxValue={maxValue}
          types={types}
          slider={slider}
          value={choroplethValues.get(id)}
          toggleLayerVisibility={toggleLayerVisibility}
        />
      );
    });
    return (
      <SidebarBlock title="Vulnerability">{choroplethBlocks}</SidebarBlock>
    );
  }

  render() {
    return (
      <div className="sidebar__legend">
        {this.drawVulnerability()}
        {this.drawViewFilmstrip()}
        {this.drawSidebarOverlayDataBlock()}
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
  /** Callbak to set app `hiddenLayers` state field */
  setSelectedThematicLayer: PropTypes.func.isRequired,
  /** All views for selected year */
  viewsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All overlays for selected year */
  overlaysData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** all hydro rasters (SLR) for selected year */
  // hydroRasterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** All choropleth layers for selected year */
  choroplethData: PropTypes.arrayOf(PropTypes.object).isRequired,
  choroplethValues: PropTypes.instanceOf(Map).isRequired,
  // hydroRasterValues: PropTypes.instanceOf(Map).isRequired,
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
