import * as mapboxgl from 'mapbox-gl';

const searchMethods = {
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left - this.canvas.clientLeft,
      e.clientY - rect.top - this.canvas.clientTop,
    ];
  },
  onAreaMouseDown(e) {
    const {
      areaSearching,
      setAreaBoxStart,
    } = this.props;
    if (!areaSearching) return;
    const pos = this.getMousePos(e);
    setAreaBoxStart(pos);
    document.addEventListener('mousemove', this.onAreaMouseMove);
    document.addEventListener('mouseup', this.onAreaMouseUp);
  },
  onAreaMouseMove(e) {
    const {
      setAreaBoxEnd,
    } = this.props;
    const pos = this.getMousePos(e);
    setAreaBoxEnd(pos);
  },
  onAreaMouseUp() {
    const {
      areaBox,
      searchByArea,
      toggleAreaBox,
      toggleAreaSearching,
    } = this.props;
    /** combine these two methods into one to avoid unnecessary renders */
    toggleAreaBox();
    toggleAreaSearching();

    const startCoords = this.mbMap.unproject(new mapboxgl.Point(...areaBox.start));
    const endCoords = this.mbMap.unproject(new mapboxgl.Point(...areaBox.end));
    searchByArea([startCoords, endCoords]);
    document.removeEventListener('mousemove', this.onAreaMouseMove);
    document.removeEventListener('mouseup', this.onAreaMouseUp);
    /** perform search here */
  },
};

export default searchMethods;
