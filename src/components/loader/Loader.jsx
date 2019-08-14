import React from 'react';
import './Loader.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/pro-solid-svg-icons';

function Loader() {
  return (
    <div className="loader">
      <FontAwesomeIcon icon={faSpinner} />
    </div>
  );
}

export default Loader;
