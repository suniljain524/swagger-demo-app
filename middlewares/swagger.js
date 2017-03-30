'use strict';

module.exports = {
  init: init
};

function init(app, swagger, config) {

  //TODO: Add security check logic to verify auth token.

  swagger.register(app);
}
