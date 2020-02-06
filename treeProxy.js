const debug = require('./debug')
const {resolve, relative, sep} = require('path')
const rimraf = require('rimraf').sync

module.exports = function yggyTreeProxy (
  root,
  opts: {
    nest    = false,
    watch   = true,
    maxSize = 128 * 1024
  }
) {

  const rel = (...args) => relative(root, ...args)
  const abs = (...args) => resolve(root, ...args)

  const watcher = watch &&
    require('chokidar').watch(root).on('all', update)

  let cache
  refresh()

  const handler = {
    has (key) {
      return Object.keys(cache).includes(key)
    },
    get (key, val) {
      return cache[key]
    },
    set (key, val) {
      cache[key] = val
    },
    deleteProperty (key) {
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
    path = rel(path)
    debug(event, path)
    switch (event) {
      case 'add':
      case 'change':
				setFile(path)
				break
      case 'addDir':
				setDir(path)
        break
      case 'unlink':
      case 'unlinkDir':
				unset(path)
        break
    }
  }

	function setFile (path) {
		if (nest) {
			throw new Error('not implemented')
		} else {
			cache[path] = readFileSync(path, 'utf8')
		}
		break
	}

	function setDir (path) {
		if (nest) {
			throw new Error('not implemented')
		} else {
			cache[path] = {}
		}
	}

	function unset (path) {
		if (nest) {
			throw new Error('not implemented')
		} else {
			delete cache[path]
		}
	}

}
