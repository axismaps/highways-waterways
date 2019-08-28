import * as mapboxgl from 'mapbox-gl';

const searchMethods = {
  getMousePos({
    e,
    canvas,
  }) {
    const rect = canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left - canvas.clientLeft,
      e.clientY - rect.top - canvas.clientTop,
    ];
  },
  onAreaMouseDown(e) {
    const {
      areaSearching,
      setAreaBoxStart,
    } = this.props;
    const { canvas } = this;
    if (!areaSearching) return;
    const pos = this.getMousePos({ e, canvas });
    setAreaBoxStart(pos);
    document.addEventListener('mousemove', this.onAreaMouseMove);
    document.addEventListener('mouseup', this.onAreaMouseUp);
  },
  onAreaMouseMove(e) {
    const {
      setAreaBoxEnd,
    } = this.props;
    const { canvas } = this;
    const pos = this.getMousePos({ e, canvas });
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
  },
};

export default searchMethods;
