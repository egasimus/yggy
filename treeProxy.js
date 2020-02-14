const {resolve, relative, sep} = require('path')
const rimraf                   = require('rimraf').sync
const {readFileSync}           = require('fs')

const YggyIsDir = Symbol('Yggy.IsDir')

const events = [
  'Set',
  'Get',
  'Deleting',
  'Deleted',
  'Reading',
  'Read'
].reduce((events, event)=>
  Object.assign(events, {[event]: `Yggy.${event}`}),
  {})

module.exports = YggyTreeProxy

function YggyTreeProxy (
  root,
  options = {}
) {

  // TODO:
  // * sorted mode
  // * maxDepth
  // * maxPreload

  let {
    // contents: Object
    // initial tree contents can be provided via this option
    contents = {},

    // patterns: Array
    // TODO: handle path matches in different ways
    patterns = [],
  } = options

  const {

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
    // by default, prints every operation
    debug    = (event, data={}) =>
      console.debug(JSON.stringify({ event, ...data }))

  } = options

  // add hidden (symbol) property that allows
  // the contents to be recognized as a Yggy tree
  contents[YggyIsDir] = true

  // optionally, preload tree contents
  // and/or start watching for updates
  if (!empty) read()
  const watcher = watch ? makeWatcher(debug, root, contents, flat) : undefined

  // on-demand loading of contents
  const handler = {
    has (_, key) {
      return Object.keys(contents).includes(key)
    },
    get (_, key) {
      debug(events.Get, {key})
      return contents[key]
    },
    set (_, key, val) {
      debug(events.Set, {key})
      contents[key] = val
    },
    deleteProperty (_, key) {
      const path = resolve(root, key)
      debug(events.Deleting, {path})
      rimraf(path)
      debug(events.Deleted, {path})
    },
    ownKeys () {
      return Object.keys(contents)
    }
  }

  const tree = new Proxy(contents, handler)

  return {
    destroy () {
      return Promise.resolve(watch && watcher.close())
    },
    get tree () {
      return tree
    },
    get watcher () {
      return watcher
    },
    read,
  }

  function read () {
    debug(events.Reading, {root})
    contents = require('./treeRead')(root)
    debug(events.Read, {root})
  }

}

function makeWatcher (debug, root, contents, flat) {
  const { setFileNode, setDirNode, unsetNode } = flat
    ? getFlatHandlers(contents, root)
    : getNestedHandlers(contents, root)
  const watcher = require('chokidar')
    .watch(root, { persistent: false })
    .on('all', function watcherUpdate (event, path) {
      debug(`Yggy.Watch.${event}`, {path})
      if (event === 'add' || event === 'change') {
        setFileNode(path)
      } else if (event === 'addDir') {
        setDirNode(path)
      } else {
        unsetNode(path)
      }
    })
  return watcher
}

function getFlatHandlers () {
  throw new Error('not implemented')
}

function getNestedHandlers (contents, root) {

  const branch = { empty: true, watch: false }

  return { setFileNode, setDirNode, unsetNode }

  function rel (...args) {
    return relative(root, ...args)
  }

  function toFragments (path) {
    return rel(path).split(sep)
  }

  function descend (tree, path, onLeaf, onBranch) {
    const fragments = toFragments(path)
    const last = fragments.length - 1
    fragments.forEach((key, index)=>{
      if (index < fragments.length - 1) {
        onBranch(tree, key)
        tree = tree[key]
      } else {
        onLeaf(tree, key)
      }
    })
  }

  function setFileNode (
    path,
    data = readFileSync(path, 'utf8')
  ) {
    addNode(contents, path, data)
  }

  function setDirNode (
    path,
    data = YggyTreeProxy(null, branch).tree
  ) {
    addNode(contents, path, data)
  }

  function addNode (contents, path, data) {
    descend(
      contents,
      path,
      (tree, key) => tree[key] = data,
      (tree, key) => tree[key] = tree[key] || YggyTreeProxy(null, branch).tree,
    )
  }

  function unsetNode (path) {
    descend(
      contents,
      path,
      (tree, key) => delete tree[key]
    )
  }

}
