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

  trait(require('./traits/syncFsBackend')(self))
  trait(require('./traits/subscription')(self))

  //trait(contentTrait(self))
  //trait(fsTrait(self))
  //trait(fsWatcherTrait(self))

  return self
}
