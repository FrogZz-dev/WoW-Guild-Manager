const { alias } = require("react-app-rewire-alias");

module.exports = function override(config) {
  alias({
    "@components": "src/components",
    "@utils": "src/utils",
    "@contexts": "src/contexts",
    "@styles": "src/styles",
  })(config);

  return config;
};
