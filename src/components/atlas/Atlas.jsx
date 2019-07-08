import React from 'react';
import PropTypes from 'prop-types';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Atlas.scss';


/**
 * Map component
 *
 * This component displays the application map.
 * The map is rendered with mapbox-gl (not React).
 * Displays the following map layers:
 * view icons, viewsheds, historical raster overlays,
 * environmental raster overlays, choropleth vulnerability metrics,
 * and various static base layers. Layers are toggled on/off in
 * the sidebar. Data-driven layers (slider dependent) are
 * configured in the sidebar as well. Map layer data and overlays
 * depend on the year selected from the timeline. Clicking on a map view
 * icon selects that view, displaying the viewshed polygon
 * on the map and opening the view image in the raster probe.
 * Clicking on map or using the area drag feature
 * searches the map and brings up search results in Sidebar.
 */

class Atlas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.atlasRef = React.createRef();
  }

  componentDidMount() {
    const { style } = this.props;
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';
    const mbMap = new mapboxgl.Map({
      container: this.atlasRef.current,
      style,
    });
  }

  render() {
    const {
      style,
    } = this.props;
    console.log('style', style);
    return (
      <div className="atlas" ref={this.atlasRef}>
        Atlas
      </div>
    );
  }
}

Atlas.defaultProps = {
  views: null,
  currentLayers: [],
};

Atlas.propTypes = {
  /** Available view rasters */
  views: PropTypes.arrayOf(PropTypes.object),
  /** All map layers to display (layer ids) */
  currentLayers: PropTypes.arrayOf(PropTypes.string),
  /** Callback to set application search feature results */
  setSearchFeatures: PropTypes.func.isRequired,
};

export default Atlas;
