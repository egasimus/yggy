module.exports = (self, root, options) => {

  self.root = root
  self.initialOptions = options
  self.options = require('./options')(options)

  //placeholder for async cleanup
  self.destroy = () => Promise.resolve() 

  //placeholder for $(...) syntax implementation
  self.called = () => require('../../errors').CALLED_NOT_IMPLEMENTED()

  self.events  = require('./events')
  self.symbols = require('./symbols')
}
