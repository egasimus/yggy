const {relative, sep} = require('path')
const {readFileSync}  = require('fs')

module.exports = function makeWatcher ({
  log,
  root,
  contents,
  flat
}) {
  const { setFileNode, setDirNode, unsetNode } = flat
    ? getFlatHandlers(contents, root)
    : getNestedHandlers(contents, root)
  const watcher = require('chokidar')
    .watch(root, { persistent: false })
    .on('all', function watcherUpdate (event, path) {
      log(`Yggy.Watch.${event}`, {path})
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

  const branchOptions = { empty: true, watch: false }

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
    data = require('.')(null, branchOptions).tree
  ) {
    addNode(contents, path, data)
  }

  function addNode (contents, path, data) {
    descend(
      contents,
      path,
      (tree, key) => tree[key] = data,
      (tree, key) => tree[key] = tree[key] || YggyTreeProxy(null, branchOptions).tree,
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
