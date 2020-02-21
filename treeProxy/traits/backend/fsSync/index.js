// TODO: util.inspect.custom: https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects

module.exports = function syncFsBackendTrait (self) {
  const {defGetter, descend} = require('../helpers')
  const {statSync} = require('fs')
  const {sep} = require('path')
  const stat = statSync(self.root)
  if (stat.isFile()) {
    // there's no unixy way for a file to refer to itself
    // . = current directory, $0 = "current program"
    // so the two descent methods, file['foo'] and file('/foo') must fail
    // TODO: descend into structured data files (such as JSON)
    defGetter(self, '/', () => require('../errors').NOT_A_DIR(self.root))
    self.called = (path) => {
      if (path) require('../errors').NOT_A_DIR(self.root)
      return require('./handles').file(self.root)
    }
  } if (stat.isDirectory()) {
    defGetter(self, '/', () => require('./proxies').dir(self.root))
    self.called = (path) => require('./handles').dir(path||self.root)
  } else {
    throw require('../errors').NOT_A_FILE_OR_DIR(self.root)
  }
  return self
}
