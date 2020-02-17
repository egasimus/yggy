const {resolve} = require('path')

module.exports = function makeProxy ({
  log,
  root,
  contents,
}) {

  const events = require('./events')

  return new Proxy(contents, {

    has (_, key) {
      return Object.keys(contents).includes(key)
    },

    get (_, key) {
      log(events.Get, {key})
      return contents[key]
    },

    set (_, key, val) {
      log(events.Set, {key})
      contents[key] = val
    },

    deleteProperty (_, key) {
      const path = resolve(root, key)
      log(events.Deleting, {path})
      require('rimraf').sync(path)
      log(events.Deleted, {path})
    },

    ownKeys () {
      return Object.keys(contents)
    }

  })

}
