module.exports = { defGetter, descend, fsTrait }

function defGetter (x, y, get) {
  return Object.defineProperty(x, y, { get, configurable: true })
}

function descend (x, ...fragments) {
  fragments.forEach(y=>x=x[y])
  return x
}

function fsTrait (
  self,
  getHandles,
  getProxies
) {
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

  // the $('/') syntax returns node handles
  self.called = (...path) => {

    // when file:
    if (isFile) {
      // $() -> handle(self)
      // $(anything else) -> error 
      // TODO if parseable file descend into file
      if (path.length > 0) throw new Error(NOT_A_DIR)
      return getHandles().file(self.root)
    }

    // when directory:
    if (isDir) {
      // $() -> handle(self)
      // $('foo'), $('foo/bar'), $('foo', 'bar') -> descend
      if (path.length === 0) path = [self.root]
      return getHandles().dir(path.join(sep))
    }

    // other node types not supported yet
    NOT_A_FILE_OR_DIR(self.root)

  }

  // the $['/'] syntax returns just the node contents
  self = new Proxy(self, {

    get (self, k) {
      if (!k.startsWith) return self[k]

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
