import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component displays the map legend--map layers,
 * raster filmstrips, layer filters, etc.
 * 
 * App -> Sidebar-> SidebarBlock -> SidebarLegend
 */

// <SidebarBlock>
// <SidebarViewFilmstrip
//   setView={setView}
//   currentView={currentView}
//   availableViews={availableViews}
// />
// </SidebarBlock>

class SidebarLegend extends React.Component {
  render() {
    const { legendData } = this.props;
    console.log('legendData', legendData);
    return (
      <div className="sidebar__legend">
        LEGEND
      </div>
    );
  }
}

SidebarLegend.propTypes = {
  legendData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SidebarLegend;
