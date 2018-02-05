module.exports = {
  "extends": ["airbnb-base", "plugin:flowtype/recommended"],
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "src/"]
      }
    }
  },
  "rules": {
    "import/prefer-default-export": 0,
    "no-console": 0,
    "consistent-return": 0,
    "arrow-body-style": 0,
    "class-methods-use-this": 0,
    "no-plusplus": 0,
    "func-names": 0,
    "object-property-newline": 0
  },
  "plugins": [
    "flowtype"
  ]
};