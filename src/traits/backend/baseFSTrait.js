module.exports = function baseFSTrait (
  self,
  getHandles,
  getProxies
) {
  const {sep} = require('path')
  const {statSync} = require('fs')

  const stat   = statSync(self.root)
  const amFile = stat.isFile()
  const amDir  = stat.isDirectory()

  const {
    NOT_A_DIR,
    NOT_A_FILE_OR_DIR,
    NOT_IMPLEMENTED
  } = require('../../errors')

  // the $('/') syntax returns node handles
  self.called = (...path) =>
    require('./called')(
      amFile, amDir, getHandles, self.root, path)

  // the $['/'] syntax returns just the node contents
  self = new Proxy(self, {

    get (self, k) {
      if (!k.startsWith) return self[k]

      if      (k.startsWith('../')) NOT_IMPLEMENTED('tree ascension') // TODO
      else if (k.startsWith('./'))  NOT_IMPLEMENTED('current dir')    // TODO
      else if (!k.startsWith('/'))  return self[k] // all other props left alone

      let here = amFile ? NOT_A_DIR(self.root) :
                 amDir  ? getProxies().dir(self.root) :
                 NOT_A_FILE_OR_DIR(self.root)
      if (k.slice(1).length>0)
        here = require('./descend')(here, ...k.slice(1).split(sep))
      return here
    },

    set (self, k, v) {
      return self[k] = v // TODO
    }

  })

  return self
}
