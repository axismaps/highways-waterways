import React from 'react';
import PropTypes from 'prop-types';
import './Lightbox.scss';

class Lightbox extends React.PureComponent {
  render() {
    const { clearLightbox, lightboxRaster } = this.props;
    console.log(lightboxRaster);
    return (
      <div className="lightbox" onClick={clearLightbox}>
        <div className="lightbox__container">
          <div className="lightbox__inner">
            <img className="lightbox__img" src={lightboxRaster.raster.thumb} />
            <div className="lightbox__footer">
              <div>
                <span>{lightboxRaster.raster.creator} Malta, Algusto</span>
                <br />
                <span className="lightbox__footer-imgName">
                  {lightboxRaster.raster.title}
                </span>
                <br />
                <span className="lightbox__footer-imgCredit">
                  1912 [Instituto Moreira Salles]
                  {lightboxRaster.raster.credit}
                </span>
                <br />
              </div>
              <div>
                <a
                  className="lightbox__footer-button"
                  href={lightboxRaster.raster.thumb}
                  target="blank"
                >
                  View image on Artstor
                </a>
              </div>
            </div>
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
    raster: PropTypes.object,
  }).isRequired,
};

export default Lightbox;
