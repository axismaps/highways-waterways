import React from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';
import D3Slider from '../d3slider/D3Slider';

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
      containerWidth: null,
      containerHeight: null,
    };
    this.logged = {
      containerWidth: null,
      containerHeight: null,
      year: null,
    };
    this.d3Slider = null;
  }

  componentDidMount() {
    this.timelineNode = this.sliderRef.current;
    this.containerNode = this.containerRef.current;

    this.setDimensions();
    this.listenForResize();

    this.logYear();
    this.logDimensions();
  }

  componentDidUpdate() {
    const {
      containerWidth,
      containerHeight,
    } = this.state;

    const {
      year,
      setYear,
      mobile,
      yearRange,
    } = this.props;


    const trackHeight = 36;

    const handleHeight = containerHeight;
    if (this.d3Slider === null) {
      this.d3Slider = new D3Slider({
        trackHeight,
        width: containerWidth,
        height: containerHeight,
        padding: {
          left: 10,
          right: 10,
        },
        handleCornerRadius: 5,
        handleHeight,
        handleWidth: 20,
        timelineNode: this.sliderRef.current,
        // value range, current value
        currentValue: year,
        valueRange: yearRange,
        setYear,
        axisOn: true,
        mobile,
      });
      this.d3Slider.init();
    }
    if (this.logged.year !== year) {
      this.d3Slider.updateValue(year);
      this.logYear();
    }
    if (this.logged.containerWidth !== containerWidth) {
      this.d3Slider.config({ width: containerWidth })
        .updateSize();
      this.logDimensions();
    }
  }

  setDimensions() {
    if (this.timelineNode !== undefined) {
      const bounds = this.timelineNode.getBoundingClientRect();
      const containerBounds = this.containerNode.getBoundingClientRect();
      this.setState({
        containerWidth: containerBounds.width - 40,
        // containerWidth: bounds.width,
        containerHeight: bounds.height,
      });
    }
  }

  listenForResize() {
    window.addEventListener('resize', () => {
      this.setDimensions();
    });
  }

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

  render() {
    return (
      <div className="header__timeline" ref={this.containerRef}>
        <div className="timeline__slider" ref={this.sliderRef} />
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
