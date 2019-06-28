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
      currentLayers: [],
      currentFilters: [],
    };
  }

  render() {
    return (
      <div className="App">
        <Sidebar />
      </div>
    );
  }
}

export default App;
