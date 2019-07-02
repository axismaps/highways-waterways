import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component wraps other application components
 * to make them downloadable from the application's export function.
 *
 * App -> AppExportable -> child component
 */

class AppExportable extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="exportable">
        {children}
      </div>
    );
  }
}

AppExportable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]).isRequired,
};

export default AppExportable;
