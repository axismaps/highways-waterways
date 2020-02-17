import React from 'react';

const Icon = props => {
  const { color, geometry } = props;

  switch (geometry) {
    case 'line':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 36.857 14"
          width="38px"
          height="14px"
        >
          <path
            d="M2.429 14a2.411 2.411 0 0 1-1.714-.667A2.133 2.133 0 0 1 0 11.714a2.009 2.009 0 0 1 .762-1.571L11.952.619a2.492 2.492 0 0 1 1.619-.571 2.584 2.584 0 0 1 1.714.667L24 8.667l8.714-8A2.5 2.5 0 0 1 34.428 0a2.666 2.666 0 0 1 1.667.619 2.161 2.161 0 0 1 .762 1.571 2.133 2.133 0 0 1-.714 1.619l-10.381 9.524a2.683 2.683 0 0 1-3.429 0l-8.762-8L4.1 13.429A2.929 2.929 0 0 1 2.429 14z"
            fill={color}
          />
        </svg>
      );
    case 'polygon':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38px"
          height="14px"
          viewBox="0 0 38 14"
        >
          <path data-name="Rectangle 1" d="M0 0h38v14H0z" fill={color} />
        </svg>
      );
    default:
      break;
  }
};

export default Icon;
