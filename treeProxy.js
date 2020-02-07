const debug                    = require('./debug')
const {resolve, relative, sep} = require('path')
const rimraf                   = require('rimraf').sync
const {readFileSync}           = require('fs')

const YggyDirFlag = Symbol('YggyDirFlag')

module.exports = function yggyTreeProxy (
  root,
  {
    flat    = false,
    empty   = false,
    watch   = true,
    maxSize = 128 * 1024,
    cache   = {}
  } = {}
) {

  cache[YggyDirFlag] = true

  const rel = (...args) => relative(root, ...args)
  const abs = (...args) => resolve(root, ...args)

  if (!empty) refresh()
  const watcher = watch && require('chokidar').watch(root).on('all', update)

  const handler = {
    has (_, key) {
      return Object.keys(cache).includes(key)
    },
    get (_, key) {
      debug(`get`, key)
      return cache[key]
    },
    set (_, key, val) {
      debug(`set`, key)
      cache[key] = val
    },
    deleteProperty (_, key) {
      const path = abs(key)
      debug(`deleting`, path)
      rimraf(path)
    },
    ownKeys () {
      return Object.keys(cache)
    }
  }

  return {
    tree: new Proxy(cache, handler),
    watcher,
    refresh,
    destroy
  }

  function refresh () {
    debug(`reading tree from`, root)
    cache = require('./treeRead')(root)
    debug(`read tree from`, root, `:`, cache)
  }
  
  function destroy () {
    return Promise.resolve(watch && watcher.close())
  }

  function update (event, path) {
    console.log(event, path)
    if (event === 'add' || event === 'change') {
      setFile(path)
    } else if (event === 'addDir') {
      setDir(path)
    } else {
      unset(path)
    }
  }

  function add (cache, fragments, data) {
    let current = cache
    for (let index in fragments) {
      const key = fragments[index]
      if (index < fragments.length - 1) {
        if (current[key] === undefined) {
          const subtree = yggyTreeProxy(null, { empty: true, watch: false })
          current[key] = subtree.tree
        }
        current = current[key]
      } else {
        current[key] = data
      }
    }
  }

  function setFile (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      add(cache, rel(path).split(sep), readFileSync(path, 'utf8'))
    }
  }

  function setDir (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      const subtree = yggyTreeProxy(null, { empty: true, watch: false })
      add(cache, rel(path).split(sep), subtree.tree)
    }
  }

  function unset (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      console.warn(`TODO unset ${path}`)
      delete cache[rel(path)]
    }
  }

}
