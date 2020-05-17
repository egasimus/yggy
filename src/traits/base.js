module.exports = (self, root, options) => {

  //backend-specific?
  self.root = root

  //options
  self.initialOptions = options
  self.options = parseOptions(options)

  //placeholder for async cleanup
  self.destroy = () => Promise.resolve() 

  //placeholder for $(...) syntax implementation
  self.called = () => require('../../errors').CALLED_NOT_IMPLEMENTED()

  //constants
  self.Events  = Events
  self.Symbols = Symbols

  return self
}

const Events = module.exports.Events = [
  'Set',
  'Get',
  'Deleting',
  'Deleted',
  'Refreshing',
  'Refreshed'
].reduce((events, event)=>
  Object.assign(events, {[event]: `Yggy.${event}`}),
  {})

// symbol marks the contents
const Symbols = module.exports.Symbols = {
  File:      Symbol('Yggy.File'),
  Directory: Symbol('Yggy.Directory'),
  Symlink:   Symbol('Yggy.Symlink'),
  Hardlink:  Symbol('Yggy.Hardlink')
}

const parseOptions = module.exports.parseOptions = function parseOptions (
  options = {}
) {

  const {

    // backend: String
    backend = 'fsSync',

    // contents: Object
    // initial tree contents can be provided via this option
    contents = {},

    // patterns: Array
    // TODO: handle path matches in different ways
    patterns = [],

    // flat: Boolean
    // if false: `{ 'foo': 0, 'bar': { 'baz': 1 } }`
    // TODO:
    // if true:  `{ 'foo': 0, 'bar/baz': 1 }`
    // OR maybe: `Map({ ['foo']: 0, ['bar', 'baz']: 1 })`???
    flat     = false,

    // empty: Boolean
    // if true: starts out empty, populated manually
    // if false: calls `read()` to auto-populate (before watcher)
    empty    = false,

    // watch: Boolean
    // if true: listen for updates
    // if false: needs to be updated manually (e.g. via `read()`)
    watch    = true,

    // log: (String, Object) -> ()
    // by default, prints every operation except Get
    log      = (event, data={}) => {
      if (event!==require('./events').Get) {
        console.log({ event, ...data })
      }
    }

  } = options

  return {
    backend,
    contents,
    patterns,
    flat,
    empty,
    watch,
    log
  }

}
