import * as d3 from 'd3';


// on mouse up, convert box to coords and query API (or map)
const searchMethods = {
  onAreaMouseDown(e) {
    const {
      areaSearching,
      toggleAreaBox,
      setAreaBoxStart,
    } = this.props;
    if (!areaSearching) return;
    toggleAreaBox(true);
    const rect = this.canvas.getBoundingClientRect();
    const start = [
      e.clientX - rect.left - this.canvas.clientLeft,
      e.clientY - rect.top - this.canvas.clientTop,
    ];
    setAreaBoxStart(start);
  },
};

export default searchMethods;
