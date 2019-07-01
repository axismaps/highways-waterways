import React from 'react';
import PropTypes from 'prop-types';
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
 */

class Atlas extends React.PureComponent {
  render() {
    return (
      <div className="atlas">
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
};

export default Atlas;
