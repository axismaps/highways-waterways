import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import './RasterProbe.scss';

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
  getProbeHeader() {
    const { currentRaster, clearRaster } = this.props;
    return (
      <div className="raster-probe__header">
        <div className="raster-probe__title">{currentRaster.raster.title}</div>
        <div className="raster-probe__close-icon" onClick={clearRaster}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    );
  }

  getProbeFooter() {
    const {
      currentRaster,
      clearRaster,
      prevRaster,
      nextRaster,
      rasterOpacity,
      setRasterOpacity
    } = this.props;
    if (currentRaster.type === 'view') {
      return (
        <div className="raster-probe__nav-buttons">
          <div
            className="raster-probe__nav-button raster-probe__prev raster-probe__footer-button"
            onClick={prevRaster}
          >
            Prev
          </div>
          <div
            className="raster-probe__nav-button raster-probe__next raster-probe__footer-button"
            onClick={nextRaster}
          >
            Next
          </div>
        </div>
      );
    }
    return (
      <div>
        <input
          value={rasterOpacity}
          onChange={e => setRasterOpacity(e.target.value)}
          type="range"
        />
        <div
          className="raster-probe__clear-button raster-probe__footer-button"
          onClick={clearRaster}
        >
          Remove from map
        </div>
      </div>
    );
  }

  getImage() {
    const { currentRaster, setLightbox } = this.props;

    return (
      <img
        src={currentRaster.raster.thumb}
        className="raster-probe__image"
        onClick={() => setLightbox(currentRaster)}
      />
    );
  }

  render() {
    const { currentRaster } = this.props;
    return (
      <div className="raster-probe">
        <div className="raster-probe__inner">
          {this.getProbeHeader()}
          {this.getImage()}
          <div className="raster-probe__caption">
            {currentRaster.raster.title}
          </div>
          {this.getProbeFooter()}
        </div>
      </div>
    );
  }
}

RasterProbe.propTypes = {
  /** Current raster probe layer data */
  currentRaster: PropTypes.shape({
    type: PropTypes.string,
    raster: PropTypes.object
  }).isRequired,
  /** Sets map rasterProbe and overlay/view to next available raster */
  nextRaster: PropTypes.func.isRequired,
  /** Sets map rasterProbe and overlay/view to previous available raster */
  prevRaster: PropTypes.func.isRequired,
  /** Callback to set app currentRaster state field to `null` */
  clearRaster: PropTypes.func.isRequired,
  /** Callback to launch lightbox of current raster */
  setLightbox: PropTypes.func.isRequired
};

export default RasterProbe;
