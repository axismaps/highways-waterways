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
    const {
      padding,
      width,
      height,
      timelineNode,
    } = this.props;
    const svg = d3.select(timelineNode)
      .append('svg')
      .attr('class', 'timeline__slider-svg')
      .style('width', `${width}px`)
      .style('height', `${height}px`);
    const track = svg.append('rect')
      .attr('class', 'timeline__track')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('rx', 10)
      .attr('width', width - padding.left - padding.right)
      .attr('height', height - padding.top - padding.bottom);
    Object.assign(this.components,
      {
        svg,
        track,
      });
  }

  setScales() {
    const {
      padding,
      width,
      handleWidth,
      yearRange,
    } = this.props;
    const xScale = d3.scaleLinear()
      .domain([
        padding.left + (handleWidth / 2),
        width - padding.right - (handleWidth / 2),
      ])
      .range(yearRange);
    Object.assign(this.components, { xScale });
  }
}

export default D3Slider;
