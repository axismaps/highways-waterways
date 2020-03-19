/**
 * This module represents a group of export functions used by
 * the App module to rasterize and download the map screen
 */
const exportMethods = {
  rasterize(props) {
    return props;
  },
  download(props) {
    const mapboxInstance = props.state.atlas;
    Object.defineProperty(window, 'devicePixelRatio', {
      get: function() {
        return 120 / 96;
      }
    });
    const img = mapboxInstance.getCanvas().toDataURL('image/png');

    return img;
  }
};

export default exportMethods;
