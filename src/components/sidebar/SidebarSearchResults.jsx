import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component displays map search results, including the results
 * from Atlas click or area searches, or a Sidebar text search.
 * Clicking feature results highlights the feature on the map.
 */

class SidebarSearchResults extends React.PureComponent {
  render() {
    return (
      <div className="sidebar__search-results">
        SEARCH RESULTS
      </div>
    );
  }
}

SidebarSearchResults.propTypes = {
  /** Results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
};

export default SidebarSearchResults;
