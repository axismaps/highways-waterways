import React from 'react';
import PropTypes from 'prop-types';

import SidebarBlock from './SidebarBlock';

/**
 * This component displays map search results, including the results
 * from Atlas click or area searches, or a Sidebar text search.
 * Clicking feature results highlights the feature on the map.
 */

class SidebarSearchResults extends React.PureComponent {
  getResultFeatureRows({ features, id }) {
    const {
      highlightedFeature,
      setHighlightedFeature,
    } = this.props;

    const getButtonClass = (feature) => {
      let buttonClass = 'sidebar__search-feature-button';
      if (highlightedFeature !== null
        && feature.name === highlightedFeature.feature.name) {
        buttonClass += ` ${buttonClass}--highlighted`;
      }

      return buttonClass;
    };

    return features
      .map(d => (
        <div
          key={d.ids[0]}
          className="sidebar__search-feature-row"
        >
          <div
            className={getButtonClass(d)}
            onClick={() => setHighlightedFeature({ feature: d, source: id })}
          >
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
          {this.getResultFeatureRows(d)}
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

SidebarSearchResults.defaultProps = {
  highlightedFeature: null,
  searchFeatures: [],
};

SidebarSearchResults.propTypes = {
  highlightedFeature: PropTypes.shape({
    feature: PropTypes.shape({
      bbox: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      ids: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
    }),
    source: PropTypes.string,
  }),
  /** results from Atlas search */
  searchFeatures: PropTypes.arrayOf(PropTypes.object),
  /** callback to set highlighted map feature */
  setHighlightedFeature: PropTypes.func.isRequired,
};

export default SidebarSearchResults;
