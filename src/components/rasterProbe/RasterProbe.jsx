import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component displays the currently the image and metadata of
 * the currently selected raster probe (view raster or overlay raster).
 * Selecting a new raster on the sidebar or map updates the image and data
 * on the raster probe. Clicking the stepper buttons on the raster probe
 * changes the current raster probe in the RasterProbe component and on the
 * map and sidebar. Clicking the image launches the image lightbox.
 *
 * App -> RasterProbe
 */

class RasterProbe extends React.PureComponent {
  render() {
    return (
      <div className="raster-probe">
        Raster probe
      </div>
    );
  }
}

RasterProbe.propTypes = {
  /** Current raster probe layer data */
  rasterProbe: PropTypes.object,
  /** Sets map rasterProbe and overlay/view to next available raster */
  nextRaster: PropTypes.func,
  /** Sets map rasterProbe and overlay/view to previous available raster */
  prevRaster: PropTypes.func,

};

export default RasterProbe;
