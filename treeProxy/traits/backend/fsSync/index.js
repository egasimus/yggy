// TODO: util.inspect.custom: https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects

module.exports = self =>
  require('../helpers').fsTrait(
    self,
    () => require('./handles'),
    () => require('./proxies')
  )
