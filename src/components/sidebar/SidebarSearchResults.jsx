import React from 'react';
import PropTypes from 'prop-types';

import SidebarBlock from './SidebarBlock';

/**
 * This component displays map search results, including the results
 * from Atlas click or area searches, or a Sidebar text search.
 * Clicking feature results highlights the feature on the map.
 */

class SidebarSearchResults extends React.PureComponent {
  getResultsBlock() {
    const { searchFeatures } = this.props;
    // console.log('searchFeatures', searchFeatures);
    // console.log('all', searchFeatures.length);
    // console.log('id', [...new Set(searchFeatures.map(d => d.properties.id))].map(d => searchFeatures.filter(dd => dd.properties.id === d)));
    const uniqueFeatures = [...new Set(searchFeatures.map(d => d.properties.id))].map(d => searchFeatures.find(dd => dd.properties.id === d));
    return uniqueFeatures.map(d => (
      <div
        key={d.properties.id}
        className="sidebar__search-results-row"
      >
        {d.properties.name}
      </div>
    ));
  }

  render() {
    return (
      <div className="sidebar__search-results">
        <SidebarBlock>
          {this.getResultsBlock()}
        </SidebarBlock>
      </div>
    );
  }
}

SidebarSearchResults.propTypes = {
  /** Results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
};

export default SidebarSearchResults;
