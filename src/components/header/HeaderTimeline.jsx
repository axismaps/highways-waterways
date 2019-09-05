import React from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';
import D3Slider from '../d3slider/D3Slider';
import Tooltip from '../tooltip/Tooltip';

/**
 * This is the timeline slider component.
 *
 * This slider displays the timeline range for the map. The component
 * shows the currently selected year. Dragging the timeline updates the
 * application's year, updating the available layers on the sidebar,
 * year values on the stepper, and data on the map.
 *
 * App -> Header -> HeaderStepper
 */

class HeaderTimeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sliderRef = React.createRef();
    this.containerRef = React.createRef();
    this.state = {
      // containerWidth: null,
      // containerHeight: null,
      tooltip: null,
    };
    this.containerWidth = null;
    this.containerHeight = null;
    this.logged = {
      containerWidth: null,
      containerHeight: null,
      year: null,
      screenWidth: null,
    };
    this.d3Slider = null;
    this.setTooltip = this.setTooltip.bind(this);
    this.removeTooltip = this.removeTooltip.bind(this);
  }

  componentDidMount() {
    this.timelineNode = this.sliderRef.current;
    this.containerNode = this.containerRef.current;

    this.setDimensions();
    // this.listenForResize();

    this.logYear();
    this.logDimensions();
    this.logScreenWidth();

    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const {
      year,
      setYear,
      mobile,
      yearRange,
      screenWidth,
    } = this.props;


    const trackHeight = 36;

    const handleHeight = this.containerHeight;
    if (this.d3Slider === null) {
      this.d3Slider = new D3Slider({
        trackHeight,
        width: this.containerWidth,
        height: this.containerHeight,
        padding: {
          left: 10,
          right: 0,
        },
        handleCornerRadius: 5,
        handleHeight,
        handleLineOffset: 15,
        handleWidth: 20,
        timelineNode: this.sliderRef.current,
        // value range, current value
        currentValue: year,
        valueRange: yearRange,
        setYear,
        axisOn: true,
        mobile,
        tooltip: true,
        setTooltip: this.setTooltip,
        removeTooltip: this.removeTooltip,
      });
      this.d3Slider.init();
    }
    if (this.logged.year !== year) {
      this.d3Slider.updateValue(year);
      this.logYear();
    }

    if (this.logged.screenWidth !== screenWidth) {
      this.setDimensions();
      this.d3Slider.config({ width: this.containerWidth })
        .updateSize();
      this.logScreenWidth();
    }
  }

  setDimensions() {
    if (this.timelineNode !== undefined) {
      const bounds = this.timelineNode.getBoundingClientRect();
      const containerBounds = this.containerNode.getBoundingClientRect();
      // this.setState({
      //   containerWidth: containerBounds.width - 40,
      //   containerHeight: bounds.height,
      // });]
      this.containerWidth = containerBounds.width - 40;
      this.containerHeight = bounds.height;
    }
  }

  setTooltip({
    x,
    y,
    value,
    width,
  }) {
    const tooltip = (
      <Tooltip
        x={x}
        y={y}
        width={width}
      >
        <div>{value}</div>
      </Tooltip>
    );

    this.setState({
      tooltip,
    });
  }

  removeTooltip() {
    this.setState({ tooltip: null });
  }

  drawTooltip() {
    const {
      tooltip,
    } = this.state;
    if (tooltip === null) return null;
    return tooltip;
  }

  // listenForResize() {
  //   window.addEventListener('resize', () => {
  //     this.setDimensions();
  //   });
  // }

  logYear() {
    const { year } = this.props;
    if (year !== this.logged.year) {
      this.logged.year = year;
    }
  }

  logDimensions() {
    const {
      containerWidth,
      containerHeight,
    } = this.state;
    Object.assign(this.logged, { containerWidth, containerHeight });
  }

  logScreenWidth() {
    const { screenWidth } = this.props;
    Object.assign(this.logged, { screenWidth });
  }

  render() {
    return (
      <div className="header__timeline" ref={this.containerRef}>
        <div className="timeline__slider" ref={this.sliderRef} />
        {this.drawTooltip()}
      </div>
    );
  }
}

HeaderTimeline.defaultProps = {
  mobile: false,
};

HeaderTimeline.propTypes = {
  /** if app is running on mobile device */
  mobile: PropTypes.bool,
  /** sets current year */
  setYear: PropTypes.func.isRequired,
  /** current year */
  year: PropTypes.number.isRequired,
  /** range of available years */
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default HeaderTimeline;
