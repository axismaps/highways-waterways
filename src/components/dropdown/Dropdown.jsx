import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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
      toggleDropdown,
    } = this.props;

    const style = {
      top: `${pos.top}px`,
      right: `${pos.right}px`,
    };

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

Dropdown.propTypes = {
  /** dropdown html content */
  children: PropTypes.node.isRequired,
  /** dropdown absolute position */
  pos: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
  }).isRequired,
  /** callback to set dropdown visibility */
  toggleDropdown: PropTypes.func.isRequired,
};
