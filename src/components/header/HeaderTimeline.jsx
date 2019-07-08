import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
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
    this.state = {
      containerWidth: null,
      containerHeight: null,
    };
    this.logged = {
      containerWidth: null,
      containerHeight: null,
    };
    this.sliderComponents = {
      svg: null,
      track: null,
    };
  }

  componentDidMount() {
    this.timelineNode = this.sliderRef.current;

    if (this.timelineNode !== undefined) {
      const bounds = this.timelineNode.getBoundingClientRect();
      this.setState({
        containerWidth: bounds.width,
        containerHeight: bounds.height,
      });
    }
  }

  componentDidUpdate() {
    console.log('update timeline');
    const {
      containerWidth,
      containerHeight,
    } = this.state;

    const { year } = this.props;

    const trackHeight = containerHeight - 10;
    const handleHeight = trackHeight + 4;
    if (this.sliderComponents.svg === null) {
      this.d3Slider = new D3Slider({
        trackHeight,
        width: containerWidth,
        height: containerHeight,
        padding: {
          left: 10,
          right: 10,
        },
        handleHeight,
        handleWidth: 16,
        timelineNode: this.sliderRef.current,
        // value range, current value
        currentValue: year,
        valueRange: [1800, 2010],
      });
      this.d3Slider.init();
    }
  }

  render() {
    return (
      <div className="header__timeline">
        <div className="timeline__slider" ref={this.sliderRef} />
      </div>
    );
  }
}

HeaderTimeline.propTypes = {
  /** Current year */
  year: PropTypes.number.isRequired,
};

export default HeaderTimeline;
