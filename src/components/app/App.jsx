import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      year: 1950,
      sidebarOpen: true,
      rasterProbe: null,
      overlay: null,
      availableLayers: [],
      views: [],
      overlays: [],
      currentLayers: [],
      currentFilters: [],
      currentView: null,
      currentOverlay: null,
    };

    this.setView = this.setView.bind(this);
  }

  setView(newView) {
    const { currentView } = this.state;

    if (currentView === newView) {
      this.setState({
        currentView: null,
      });
    } else {
      this.setState({
        currentView: newView,
      });
    }
  }

  render() {
    const {
      views,
      currentView,
    } = this.state;
    return (
      <div className="App">
        <Sidebar
          setView={this.setView}
          views={views}
          currentView={currentView}
        />
      </div>
    );
  }
}

export default App;
