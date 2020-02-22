module.exports = { defGetter, descend, fsTrait }

function defGetter (x, y, get) {
  return Object.defineProperty(x, y, { get, configurable: true })
}

function descend (x, ...fragments) {
  fragments.forEach(y=>x=x[y])
  return x
}

function fsTrait (self, getHandles, getProxies) {
  const {statSync} = require('fs')

  const stat   = statSync(self.root)
  const isFile = stat.isFile()
  const isDir  = stat.isDirectory()

  const { NOT_A_DIR, NOT_A_FILE_OR_DIR } = require('../../errors')

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
      if (k === '/') {
        // TODO if (k.startsWith('.')||k.startsWith('./')||k.startsWith('../')...
        return isFile ? NOT_A_DIR(self.root) :
               isDir  ? getProxies().dir(self.root) :
               NOT_A_FILE_OR_DIR(self.root)
      } else {
        return self[k]
      }
    },
    set (self, k, v) {
      return self[k] = v // TODO
    }
  })

  return self
}
