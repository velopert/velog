const path = require('path');

module.exports = {
  "extends": [
    "react-app",
    "airbnb"
  ],
  "settings": {
    "import/resolver": {
      node: { paths: [path.resolve('./src')] }
    },
  },
  "rules": {
    "class-methods-use-this": 0,
    "react/jsx-filename-extension": 0,
    "jsx-a11y/href-no-hash": 0,
    "no-unused-vars": 1,
    "arrow-body-style": 0,
    "import/prefer-default-export": 1,
    "react/prop-types": 0,
    "react/self-closing-comp": 1,
    "react/prefer-stateless-function": 0,
    "react/default-props-match-prop-types": 0
  }
}