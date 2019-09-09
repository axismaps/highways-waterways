import React from 'react';
import ReactDOM from 'react-dom';

import './Dropdown.scss';

const dropdownRoot = document.getElementById('dropdown-root');

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    dropdownRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    dropdownRoot.removeChild(this.el);
  }

  render() {
    const {
      children,
      pos,
      open,
    } = this.props;

    console.log('pos', pos);
    const style = {
      top: `${pos.top}px`,
    };

    if ('left' in pos) {
      style.left = `${pos.left}px`;
    } else if ('right' in pos) {
      style.right = `${pos.right}px`;
    }

    const dropdown = (
      <div style={style} className="dropdown">
        <div className="dropdown__inner">
          {children}
        </div>
      </div>
    );

    return ReactDOM.createPortal(
      dropdown,
      this.el,
    );
  }
}

export default Dropdown;
