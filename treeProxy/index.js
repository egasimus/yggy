const {resolve, relative, sep} = require('path')
const {readFileSync}           = require('fs')
const EventEmitter             = require('events')

module.exports = YggyTreeProxy

function YggyTreeProxy (root, options={}) {
  const self = {}
  const trait = x => Object.assign(self, x)
  trait({ // constants
    events:  require('./events'),
    symbols: require('./symbols'),
  })
  trait({ // init & cleanup
    root,
    initialOptions: options,
    options: require('./options')(options),
    destroy: () => Promise.resolve(self.watcher && self.watcher.close()),
  })
  trait(subscriptionTrait(self))
  trait(contentTrait(self))
  trait(fsTrait(self))
  trait(fsWatcherTrait(self))
  return self
}

function subscriptionTrait (self) {
  return {
    subscribers: [],
    subscribe:   s => self.subscribers.push(s),
    unsubscribe: s => self.subscribers = self.subscribers.filter(x=>x!==s),
    emit: (event, data = {}) => {
      event = { event, ...data }
      self.subscribers.forEach(s=>s.next(event))
    },
  }
}

function fsTrait (self) {
  return {
    refresh: (/* TODO refresh subtree */) => {
      const path = self.root
      self.emit(self.events.Refreshing, {path})
      for (let key in self.contents) delete contents[key]
      Object.assign(self.contents, require('../treeRead')(path))
      self.emit(self.events.Refreshed, {path})
    },

    read:     () => {},
    write:    () => {},
    unlink:   () => {},
    expand:   () => {},
    collapse: () => {},
  }
}

function contentTrait (self) {
  const contents = Object.assign(
    self.options.contents,
    { [self.symbols.YggyIsDir]: true }
  )
  return {
    contents,
    '/': new Proxy(contents, {
      has (_, key) {
        return Object.keys(contents).includes(key)
      },
      get (_, key) {
        emit(events.Get, {key})
        return contents[key]
      },
      set (_, key, val) {
        emit(events.Set, {key})
        contents[key] = val
      },
      deleteProperty (_, key) {
        const path = resolve(root, key)
        emit(events.Deleting, {path})
        require('rimraf').sync(path)
        emit(events.Deleted, {path})
      },
      ownKeys () {
        return Object.keys(contents)
      }
    })
  }
}

function fsWatcherTrait (self) {
  emit(`Yggy.Watching`, { root })
  const { setFileNode, setDirNode, unsetNode } = 
    getNestedHandlers(contents, root)
  return {
    watch: require('chokidar')
      .watch(root, { persistent: false })
      .on('all', function watcherUpdate (event, path) {
        emit(`Yggy.Watch.${event}`, {path})
        if (event === 'add' || event === 'change') {
          setFileNode(path)
        } else if (event === 'addDir') {
          setDirNode(path)
        } else {
          unsetNode(path)
        }
      })
  }
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
