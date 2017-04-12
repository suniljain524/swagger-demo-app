const envalid = require('envalid');

module.exports = envalid.cleanEnv(process.env, {
  TEST_API: envalid.str({
    desc: 'The API key'
  }),
});
