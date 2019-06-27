module.exports = {
  "env": {
      "browser": true,
      "es6": true
  },
  "extends": "airbnb",
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly",
      "L": false
  },
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "react/prefer-stateless-function": "off",
      "react/no-unused-state": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off"
  }
};