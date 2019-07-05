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
  render() {
    return (
      <div className="header__timeline">
        Timeline
      </div>
    );
  }
}

export default HeaderTimeline;
