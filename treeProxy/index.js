const {resolve, relative, sep} = require('path')
const {readFileSync}           = require('fs')
const EventEmitter             = require('events')

module.exports = YggyRoot

function YggyRoot (root, options={}) {

  const self = function Yggy (...args) {
    return self.called(...args)
  }

  const trait = x => Object.defineProperties(self,
    Object.getOwnPropertyDescriptors(x))

  trait({ // constants
    events:  require('./events'),
    symbols: require('./symbols'),
  })

  trait({ // init & cleanup
    root,
    initialOptions: options,
    options: require('./options')(options),
    destroy: () => Promise.resolve(),
    called: () => require('./errors').CALLED_NOT_IMPLEMENTED()
  })

  switch (self.options.backend) {
    case 'webCrawling':
      trait(require('./traits/webCrawlingBackend')(self));
      break
    case 'asyncRead':
      trait(require('./traits/asyncReadFsbackend')(self))
      break
    default:
      trait(require('./traits/syncFsBackend')(self))
      break
  }

  trait(require('./traits/subscription')(self))

  return self
}
