module.exports = (self, root, options) => {

  //backend-specific?
  self.root = root

  //options
  self.initialOptions = options
  self.options = require('./options')(options)

  //placeholder for async cleanup
  self.destroy = () => Promise.resolve() 

  //placeholder for $(...) syntax implementation
  self.called = () => require('../../errors').CALLED_NOT_IMPLEMENTED()

  //constants
  self.events  = require('./events')
  self.symbols = require('./symbols')

  return self
}
