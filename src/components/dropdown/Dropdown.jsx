import React from 'react';
import ReactDOM from 'react-dom';

import './Dropdown.scss';

const dropdownRoot = document.getElementById('dropdown-root');

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.timer = null;
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
      toggleDropdown,
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

    const setTimer = () => {
      this.timer = setTimeout(() => {
        this.timer = null;
        toggleDropdown(false);
      }, 1000);
    };

    const cancelTimer = () => {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    };

    const dropdown = (
      <div
        style={style}
        className="dropdown"
        onMouseOver={cancelTimer}
        onFocus={cancelTimer}
        onMouseOut={setTimer}
        onBlur={setTimer}
      >
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
