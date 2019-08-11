// on mouse up, convert box to coords and query API (or map)

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
      // toggleAreaBox,
      setAreaBoxStart,
    } = this.props;
    if (!areaSearching) return;
    const pos = this.getMousePos(e);
    setAreaBoxStart(pos);
    document.addEventListener('mousemove', this.onAreaMouseMove);
    document.addEventListener('mouseup', this.onAreaMouseUp);
    console.log('e', e);
    // e.stopPropagation();
    
  },
  onAreaMouseMove(e) {
    const {
      setAreaBoxEnd,
    } = this.props;
    const pos = this.getMousePos(e);
    setAreaBoxEnd(pos);
    // setAreaBoxEnd
    
  },
  onAreaMouseUp() {
    const {
      toggleAreaBox,
      toggleAreaSearching,
    } = this.props;
    /** combine these two methods into one to avoid unnecessary renders */
    toggleAreaBox();
    toggleAreaSearching();
    document.removeEventListener('mousemove', this.onAreaMouseMove);
    document.removeEventListener('mouseup', this.onAreaMouseUp);
    /** perform search here */
  },
};

export default searchMethods;
