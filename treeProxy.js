const debug                    = require('./debug')
const {resolve, relative, sep} = require('path')
const rimraf                   = require('rimraf').sync
const {readFileSync}           = require('fs')

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
    debug(event, path)
    if (event === 'add' || event === 'change') {
      setFile(path)
    } else if (event === 'addDir') {
      setDir(path)
    } else {
      unset(path)
    }
  }

  function setFile (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      let current = cache
      const data = readFileSync(path, 'utf8')
      const fragments = rel(path).split(sep)
      while (fragments.length > 1) {
        const fragment = fragments.shift()
        if (!current[fragment]) {
          current[fragment] = yggyTreeProxy(null, { empty: true, watch: false })
        }
        current = current[fragment]
      }
      current[fragments[0]] = data
    }
  }

  function setDir (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      cache[rel(path)] = {}
    }
  }

  function unset (path) {
    if (flat) {
      throw new Error('not implemented')
    } else {
      delete cache[rel(path)]
    }
  }

}
