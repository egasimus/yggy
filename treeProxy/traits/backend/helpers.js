module.exports = { defGetter, descend, fsTrait }

function defGetter (x, y, get) {
  return Object.defineProperty(x, y, { get, configurable: true })
}

function descend (x, ...fragments) {
  fragments.forEach(y=>x=x[y])
  return x
}

function fsTrait (self, getHandles, getProxies) {
  const {sep} = require('path')
  const {statSync} = require('fs')

  const stat   = statSync(self.root)
  const isFile = stat.isFile()
  const isDir  = stat.isDirectory()

  const {
    NOT_A_DIR,
    NOT_A_FILE_OR_DIR,
    NOT_IMPLEMENTED
  } = require('../../errors')

  // $('/') syntax returns node handles
  // TODO handle dir replaced with file
  self.called = path =>
    isFile ? path ? NOT_A_DIR(self.root)
                  : getHandles().file(self.root) :
    isDir  ? getHandles().dir(path||self.root)
           : NOT_A_FILE_OR_DIR(self.root)

  // $['/'] syntax returns just the node values
  self = new Proxy(self, {

    get (self, k) {

      if      (k.startsWith('../')) NOT_IMPLEMENTED('tree ascension') // TODO
      else if (k.startsWith('./'))  NOT_IMPLEMENTED('current dir')    // TODO
      else if (!k.startsWith('/'))  return self[k] // all other props left alone

      let here = isFile ? NOT_A_DIR(self.root) :
                 isDir  ? getProxies().dir(self.root) :
                 NOT_A_FILE_OR_DIR(self.root)
      if (k.slice(1).length>0) here = descend(here, ...k.slice(1).split(sep))
      return here
    },

    set (self, k, v) {
      return self[k] = v // TODO
    }

  })

  return self
}
