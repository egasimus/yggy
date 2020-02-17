module.exports = function parseOptions (options) {

  const {
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
        console.log(JSON.stringify({ event, ...data }))
      }
    }
  } = options

  return { contents, patterns, flat, empty, watch, log }

}