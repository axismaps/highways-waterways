import React from 'react';
import PropTypes from 'prop-types';
import SidebarLayersBlock from './SidebarLayersBlock';

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

class SidebarLegend extends React.PureComponent {
  drawLayerBlocks() {
    const {
      legendData,
    } = this.props;
    return legendData.map(legendGroup => (
      <SidebarLayersBlock
        key={legendGroup.id}
        mapLayers={legendGroup.Types}
        groupName={legendGroup.title}
      />
    ));
  }

  render() {
    const { legendData } = this.props;
    console.log('legendData', legendData);
    return (
      <div className="sidebar__legend">
        {this.drawLayerBlocks()}
      </div>
    );
  }
}

SidebarLegend.propTypes = {
  legendData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SidebarLegend;
