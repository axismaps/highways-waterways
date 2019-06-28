import React from 'react';
import SidebarBlock from './SidebarBlock';
import SidebarViewFilmstrip from './SidebarViewFilmstrip';
import './Sidebar.scss';

class Sidebar extends React.PureComponent {
  render() {
    const {
      setView,
      currentView,
      views,
    } = this.props;
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

export default Sidebar;
