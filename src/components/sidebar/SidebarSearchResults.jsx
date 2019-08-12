import React from 'react';
import PropTypes from 'prop-types';

import SidebarBlock from './SidebarBlock';

/**
 * This component displays map search results, including the results
 * from Atlas click or area searches, or a Sidebar text search.
 * Clicking feature results highlights the feature on the map.
 */

class SidebarSearchResults extends React.PureComponent {
  static getResultFeatureRows(features) {
    return features
      .map(d => (
        <div
          key={d.ids[0]}
          className="sidebar__search-feature-row"
        >
          <div className="sidebar__search-feature-button">
            <div className="sidebar__search-feature-button-text">
              {d.name}
            </div>
          </div>
        </div>
      ));
  }

  getResultsByLayer() {
    const { searchFeatures } = this.props;

    return searchFeatures.map((d, i) => {
      let groupClass = 'sidebar__search-layer-group';
      if (i === 0) {
        groupClass += ` ${groupClass}--first`;
      }
      return (
        <div
          key={d.id}
          className={groupClass}
        >
          <div className="sidebar__search-layer-title-row">
            {d.title}
          </div>
          {SidebarSearchResults.getResultFeatureRows(d.features)}
        </div>
      );
    });
  }

  render() {
    return (
      <div className="sidebar__search-results">
        <SidebarBlock>
          {this.getResultsByLayer()}
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
