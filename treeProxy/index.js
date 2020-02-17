const {resolve} = require('path')

module.exports = YggyTreeProxy

function YggyTreeProxy (
  root,
  options = {}
) {

  const events =
    require('./events')

  const { contents, patterns, flat, empty, watch, log } =
    require('./options')(options)

  contents[require('./symbols').YggyIsDir] =
    true

  if (!empty)
    read()

  const watcher =
    watch
    ? require('./watch')({ log, root, contents, flat })
    : undefined

  const tree =
    require('./proxy')({ log, root, contents })

  return {
    tree,
    watcher,
    read,
    destroy,
  }

  function read () {
    log(events.Reading, {root})
    for (let key in contents) delete contents[key]
    Object.assign(contents, require('../treeRead')(root))
    log(events.Read, {root})
  }

  function destroy () {
    return Promise.resolve(watch && watcher.close())
  }

}

