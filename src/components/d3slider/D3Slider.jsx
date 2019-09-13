import * as d3 from 'd3';

class D3Slider {
  constructor(props) {
    const defaultProps = {
      trackCornerRadius: 10,
      colorRamp: null,
      handleLineOffset: 8,
      tooltip: false,
    };
    this.props = Object.assign(defaultProps, props);
    this.dragging = false;
    this.hovering = false;
    this.components = {};
  }

  config(config) {
    Object.assign(this.props, config);
    return this;
  }

  init() {
    this.draw();
    this.setScale();
  }

  draw() {
    this.drawSVG();
    this.setSVGWidth();
    this.drawTrack();
    this.setTrackWidth();
    this.drawColorRamp();
    this.setScale();
    this.drawAxis();
    this.updateAxisWidth();
    this.drawHandle();
    this.setHandlePosition();
    this.setDrag();
    this.setTooltipListener();
  }

  updateSize() {
    this.setSVGWidth();
    this.setTrackWidth();
    this.setScale();
    this.setHandlePosition();
    this.updateAxisWidth();
  }

  drawSVG() {
    const {
      timelineNode,
      height,
    } = this.props;
    this.components.svg = d3.select(timelineNode)
      .append('svg')
      .attr('class', 'timeline__slider-svg')
      .style('height', `${height}px`);
  }

  setSVGWidth() {
    const {
      width,
    } = this.props;

    this.components.svg
      .style('width', `${width}px`);
  }

  drawTrack() {
    const {
      padding,
      height,
      trackHeight,
      trackCornerRadius,
    } = this.props;
    const { svg } = this.components;

    this.components.track = svg.append('rect')
      .attr('class', 'timeline__track')
      .attr('x', padding.left)
      .attr('y', (height / 2) - (trackHeight / 2))
      .attr('rx', trackCornerRadius)
      .attr('height', trackHeight);
  }

  drawColorRamp() {
    const {
      colorRamp,
      padding,
      width,
      height,
      trackHeight,
    } = this.props;

    if (colorRamp === null) return;

    const { svg } = this.components;

    const rectWidth = (width - padding.left - padding.right) / colorRamp.length;
    this.components.ramp = svg.selectAll('.timeline__ramp-rect')
      .data(colorRamp)
      .enter()
      .append('rect')
      .attr('class', 'timeline__ramp-rect')
      .attr('pointer-events', 'none')
      .attr('width', rectWidth)
      .attr('height', trackHeight)
      .attr('y', (height / 2) - (trackHeight / 2))
      .attr('x', (d, i) => padding.left + (i * rectWidth))
      .attr('fill', d => d);
  }

  setTrackWidth() {
    const {
      width,
      padding,
    } = this.props;

    this.components.track
      .attr('width', width - padding.left - padding.right);
  }

  drawAxis() {
    const {
      height,
      trackHeight,
      axisOn,
    } = this.props;
    const {
      svg,
    } = this.components;

    if (!axisOn) return;

    this.axisGroup = svg.append('g')
      .attr('transform', `translate(0, ${((height / 2) - (trackHeight / 2))})`)
      .attr('class', 'timeline__axis');
  }

  updateAxisWidth() {
    const { mobile, axisOn } = this.props;
    const { axisScale } = this.components;
    if (!axisOn) return;

    const domain = axisScale.domain();

    const ticks = [domain[0]];
    for (let i = domain[0]; i < domain[1]; i += 1) {
      if (i % 5 === 0) {
        ticks.push(i);
      }
    }
    ticks.push(domain[1]);

    this.axis = d3.axisBottom(axisScale)
      .tickValues(ticks)
      .tickFormat((d) => {
        if (mobile) {
          return '';
        }
        if ((d - 10) % 20 !== 0 && d !== domain[0] && d !== domain[1]) {
          return '';
        }
        return d;
      });

    this.axisGroup.call(this.axis);
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
      handleLineOffset,
    } = this.props;
    const { svg } = this.components;

    const handleY = (height / 2) - (handleHeight / 2);

    this.components.handle = svg.append('rect')
      .attr('class', 'timeline__handle')
      .attr('width', handleWidth)
      .attr('height', handleHeight)
      .attr('rx', handleCornerRadius)
      .attr('x', 0)
      .attr('y', handleY);

    this.components.handleLine = svg.append('line')
      .attr('class', 'timeline__handle-line')
      .attr('stroke-width', 1)
      .attr('stroke', 'white')
      .attr('y1', handleY + handleLineOffset)
      .attr('y2', (handleY + handleHeight) - handleLineOffset);
  }

  setHandlePosition() {
    const {
      currentValue,
      handleWidth,
    } = this.props;

    const {
      handle,
      handleLine,
      xScale,
    } = this.components;

    const handlePos = xScale.invert(currentValue) - (handleWidth / 2);
    const handleLinePos = handlePos + (handleWidth / 2);

    handle
      .attr('x', handlePos);

    handleLine
      .attr('x1', handleLinePos)
      .attr('x2', handleLinePos);
  }

  setDrag() {
    const {
      setYear,
      tooltip,
      setTooltip,
      removeTooltip,
      padding,
      width,
    } = this.props;
    const {
      track,
      svg,
    } = this.components;
    const svgRect = svg.node().getBoundingClientRect();
    const y = svgRect.top - svgRect.height;
    const tooltipWidth = 40;
    const getX = eventX => svgRect.left + (eventX - (tooltipWidth / 2) - 20);

    const setYearAndTooltip = () => {
      const { xScale } = this.components;
      const outside = d3.event.x < (padding.left) || d3.event.x > width + padding.right;
      setYear(xScale(d3.event.x));

      if (tooltip && !outside) {
        setTooltip({
          x: getX(d3.event.x),
          y,
          value: Math.round(xScale(d3.event.x)),
          width: tooltipWidth,
        });
      }
    };

    track.call(d3.drag()
      .on('start', () => {
        this.dragging = true;
        this.hovering = true;
        setYearAndTooltip();
      })
      .on('drag', () => {
        setYearAndTooltip();
      }).on('end', () => {
        this.dragging = false;
        if (tooltip && !this.hovering) {
          removeTooltip();
        }
      }));
  }

  setTooltipListener() {
    const {
      tooltip,
      setTooltip,
      removeTooltip,
    } = this.props;
    const {
      track,
      svg,
    } = this.components;
    if (!tooltip) return;
    const svgRect = svg.node().getBoundingClientRect();
    const y = svgRect.top - svgRect.height;
    const width = 40;
    const getX = eventX => eventX - (width / 2) - 20;
    track
      .on('mouseover', () => {
        this.hovering = true;
      })
      .on('mousemove', () => {
        this.hovering = true;
        if (this.dragging) return;
        const { xScale } = this.components;
        setTooltip({
          x: getX(d3.event.x),
          y,
          value: Math.round(xScale(d3.event.x - svgRect.left)),
          width,
        });
      })
      .on('mouseout', () => {
        this.hovering = false;
        if (this.dragging) return;
        removeTooltip();
      });
  }

  updateValue(newVal) {
    this.props.currentValue = newVal;
    this.setHandlePosition();
  }
}

export default D3Slider;
