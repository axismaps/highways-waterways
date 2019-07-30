import React from 'react';
import PropTypes from 'prop-types';
import './Lightbox.scss';

class Lightbox extends React.PureComponent {
  render() {
    const {
      clearLightbox,
      lightboxRaster,
    } = this.props;
    console.log('raster', lightboxRaster);
    return (
      <div
        className="lightbox"
        onClick={clearLightbox}
      >
        <div className="lightbox__container">
          <div className="lightbox__inner">
            lightbox :
            {lightboxRaster.raster.name}
          </div>
        </div>
      </div>
    );
  }
}

Lightbox.propTypes = {
  /** Callback to close lightbox */
  clearLightbox: PropTypes.func.isRequired,
  lightboxRaster: PropTypes.shape({
    type: PropTypes.string,
    raster: PropTypes.object,
  }).isRequired,
};

export default Lightbox;
