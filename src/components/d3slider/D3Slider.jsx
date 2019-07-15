import * as d3 from 'd3';

class D3Slider {
  constructor(props) {
    const defaultProps = {};
    this.props = Object.assign(defaultProps, props);
    this.components = {};
  }

  init() {
    this.draw();
    this.setScale();
  }

  draw() {
    this.drawSVG();
    this.drawTrack();
    this.setScale();
    this.drawAxis();
    this.drawHandle();
    
    this.setHandlePosition();
    this.setDrag();
  }

  drawSVG() {
    const {
      timelineNode,
      width,
      height,
    } = this.props;
    this.components.svg = d3.select(timelineNode)
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
    const { svg } = this.components;

    this.components.track = svg.append('rect')
      .attr('class', 'timeline__track')
      .attr('x', padding.left)
      .attr('y', (height / 2) - (trackHeight / 2))
      .attr('rx', 10)
      .attr('width', width - padding.left - padding.right)
      .attr('height', trackHeight);
  }

  drawAxis() {
    const {
      height,
      trackHeight,
    } = this.props;
    const {
      svg,
      axisScale,
    } = this.components;

    const axisGroup = svg.append('g')
      .attr('transform', `translate(0, ${((height / 2) - (trackHeight / 2))})`)
      .attr('class', 'timeline__axis');

    const axis = d3.axisBottom(axisScale)
      .tickFormat(d => d);

    axisGroup.call(axis);
  }

  setScale() {
    const {
      padding,
      width,
      handleWidth,
      valueRange,
    } = this.props;
    const xScale = d3.scaleLinear()
      .domain([
        padding.left + (handleWidth / 2),
        width - padding.right - (handleWidth / 2),
      ])
      .range(valueRange)
      .clamp(true);
    const axisScale = d3.scaleLinear()
      .domain(xScale.range())
      .range(xScale.domain());

    Object.assign(this.components, { xScale, axisScale });
  }

  getScale() {
    return this.components.xScale;
  }

  drawHandle() {
    const {
      handleWidth,
      handleHeight,
      handleCornerRadius,
      height,
    } = this.props;
    const { svg } = this.components;

    this.components.handle = svg.append('rect')
      .attr('class', 'timeline__handle')
      .attr('width', handleWidth)
      .attr('height', handleHeight)
      .attr('rx', handleCornerRadius)
      .attr('x', 0)
      .attr('y', (height / 2) - (handleHeight / 2));
  }

  setHandlePosition() {
    const {
      currentValue,
      handleWidth,
    } = this.props;

    const {
      handle,
      xScale,
    } = this.components;

    handle
      .attr('x', xScale.invert(currentValue) - (handleWidth / 2));
  }

  setDrag() {
    const { setYear } = this.props;
    const {
      track,
      xScale,
    } = this.components;

    track.call(d3.drag()
      .on('start drag', () => {
        setYear(xScale(d3.event.x));
      }));
  }

  updateValue(newVal) {
    this.props.currentValue = newVal;
    this.setHandlePosition();
  }
}

export default D3Slider;
