const {resolve} = require('path')
const EventEmitter = require('events')

module.exports = YggyTreeProxy

function YggyTreeProxy (root, options={}) {

  const self = {
    events: require('./events'),

    root,
    initialOptions: options,
    options: require('./options')(options),
    get log () { return self.options.log },

    destroy: () => Promise.resolve(self.watcher && self.watcher.close()),

    subscribers: [],
    subscribe:   s => self.subscribers.push(s),
    unsubscribe: s => self.subscribers = self.subscribers.filter(x=>x!==s),
    emit: (event, data = {}) => {
      event = { event, ...data }
      self.subscribers.forEach(s=>s.next(event))
    },

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

  self.initialOptions = options
  self.contents = self.options.contents
  self.contents[require('./symbols').YggyIsDir] = true
  if (!self.options.empty) self.refresh()
  if (self.options.watch) self.watcher = require('./watch')(self)
  self.tree = require('./proxy')(self)

  return self

}
