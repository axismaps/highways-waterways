import React from 'react';
import PropTypes from 'prop-types';
import SidebarBlock from './SidebarBlock';
import SidebarViewFilmstrip from './SidebarViewFilmstrip';
import './Sidebar.scss';

class Sidebar extends React.PureComponent {
  render() {
    const {
      setView,
      currentView,
      views,
      sidebarOpen,
    } = this.props;
    if (!sidebarOpen) return null;
    return (
      <div className="sidebar">
        <SidebarBlock>
          <SidebarViewFilmstrip
            setView={setView}
            currentView={currentView}
            views={views}
          />
        </SidebarBlock>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  views: [],
  currentView: null,
};

Sidebar.propTypes = {
  /** Available view rasters */
  views: PropTypes.arrayOf(PropTypes.object),
  /** Selected views */
  currentView: PropTypes.shape({
    name: PropTypes.string,
  }),
  /**
   * Set app `currentView` state.
   * @param {Object} view A viewshed object
   * */
  setView: PropTypes.func.isRequired,
  /** If sidebar is open or collapsed */
  sidebarOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
