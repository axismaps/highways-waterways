import * as d3 from 'd3';

class D3Slider {
  constructor(props) {
    const defaultProps = {};
    this.props = Object.assign(defaultProps, props);
    this.components = {};
  }

  init() {
    this.draw();
    this.setScales();
  }

  draw() {
    this.drawSVG();
    this.drawTrack();
    this.drawHandle();
    this.setScales();
    this.setHandlePosition();
    this.setDrag();
  }

  drawSVG() {
    const {
      timelineNode,
      width,
      height,
    } = this.props;
    this.svg = d3.select(timelineNode)
      .append('svg')
      .attr('class', 'timeline__slider-svg')
      .style('width', `${width}px`)
      .style('height', `${height}px`);
  }

  drawTrack() {
    const {
      padding,
      width,
      height,
      trackHeight,
    } = this.props;

    this.track = this.svg.append('rect')
      .attr('class', 'timeline__track')
      .attr('x', padding.left)
      .attr('y', (height / 2) - (trackHeight / 2))
      .attr('rx', 10)
      .attr('width', width - padding.left - padding.right)
      .attr('height', trackHeight);
  }

  setScales() {
    const {
      padding,
      width,
      handleWidth,
      valueRange,
    } = this.props;
    this.xScale = d3.scaleLinear()
      .domain([
        padding.left + (handleWidth / 2),
        width - padding.right - (handleWidth / 2),
      ])
      .range(valueRange)
      .clamp(true);
  }

  drawHandle() {
    const {
      handleWidth,
      handleHeight,
      height,
    } = this.props;
    this.handle = this.svg.append('rect')
      .attr('class', 'timeline__handle')
      .attr('width', handleWidth)
      .attr('height', handleHeight)
      .attr('x', 0)
      .attr('y', (height / 2) - (handleHeight / 2));
  }

  setHandlePosition() {
    const {
      currentValue,
      handleWidth,
    } = this.props;

    this.handle
      .attr('x', this.xScale.invert(currentValue) - (handleWidth / 2));
  }

  setDrag() {
    const { setYear } = this.props;
    this.track.call(d3.drag()
      .on('start drag', () => {
        setYear(this.xScale(d3.event.x));
      }));
  }

  updateValue(newVal) {
    this.props.currentValue = newVal;
    this.setHandlePosition();
  }
}

export default D3Slider;
