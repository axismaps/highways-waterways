import React from 'react';
import PropTypes from 'prop-types';
import './Lightbox.scss';

class Lightbox extends React.PureComponent {
  render() {
    const { clearLightbox, lightboxRaster } = this.props;
    return (
      <div className="lightbox" onClick={clearLightbox}>
        <div className="lightbox__container">
          <div className="lightbox__inner">
            <img className="lightbox__img" src={lightboxRaster.raster.thumb} />
            <p>lightbox: {lightboxRaster.raster.title}</p>
          </div>
        </div>
      </div>
    );
  }
}

Lightbox.propTypes = {
  /** callback to close lightbox */
  clearLightbox: PropTypes.func.isRequired,
  lightboxRaster: PropTypes.shape({
    type: PropTypes.string,
    raster: PropTypes.object
  }).isRequired
};

export default Lightbox;
