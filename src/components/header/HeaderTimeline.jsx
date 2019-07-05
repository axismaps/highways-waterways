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
      console.log('bounds.width', bounds.width);
      this.setState({
        containerWidth: bounds.width,
        containerHeight: bounds.height,
      });
    }
  }

  componentDidUpdate() {
    console.log('UPDATE');
    const {
      containerWidth,
      containerHeight,
    } = this.state;
    if (this.sliderComponents.svg === null) {
      this.d3Slider = new D3Slider({
        width: containerWidth,
        height: containerHeight,
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0,
        },
        handleHeight: containerHeight + 4,
        handleWidth: 16,
        timelineNode: this.sliderRef.current,
        yearRange: [1800, 1910],
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

HeaderTimeline.defaultProps = {

}

export default HeaderTimeline;
