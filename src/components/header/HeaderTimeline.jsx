import React from 'react';
import PropTypes from 'prop-types';

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
    this.timelineRef = React.createRef();
    this.state = {
      containerWidth: null,
    };
  }

  componentDidMount() {
    const timelineNode = this.timelineRef.current;
    console.log('timelinenode', timelineNode);
    if (timelineNode !== undefined) {
      this.setState({
        containerWidth: timelineNode.getBoundingClientRect().width,
      });
    }
  }

  getTimeline() {
    const { containerWidth } = this.state;
    if (containerWidth === null) return null;
    const padding = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    };
    const height = 20;
    return (
      <div className="timeline__slider">
        slider
      </div>
    );
  }

  render() {
    return (
      <div className="header__timeline" ref={this.timelineRef}>
        <div className="timeline__slider">
          timeline slider
        </div>
      </div>
    );
  }
}

export default HeaderTimeline;
