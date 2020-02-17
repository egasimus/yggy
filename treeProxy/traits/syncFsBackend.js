const defGetter = (x, y, get) => Object.defineProperty(x, y, { get, configurable: true })

module.exports = function syncFsBackendTrait (self) {

  const {statSync} = require('fs')
  const {sep} = require('path')

  const stat = statSync(self.root)

  const trait = {}

  if (stat.isDirectory()) {
    defGetter(trait, '/', () => YggyDirectory(self.root))
    trait.called = (path) => descend(self['/'], ...path.split(sep))

  } else if (stat.isFile()) {
    defGetter(trait, '/', () => require('../errors').NOT_A_DIR(self.root))
    trait.called = () => YggyFile(self.root)

  } else {
    throw require('../errors').NOT_A_FILE_OR_DIR(self.root)
  }

  return trait

}

function YggyFile (path) {
  return {
    get path () { return path },
    stat   () {},
    remove () {},
    read   () {},
    write  () {},
    append () {},
    watch  () {},
  }
}

function YggyDirectory (path) {
  return {
    get path () { return path },
    stat   () {},
    remove () {},
    read   () {},
    file   () {},
    mkdir  () {},
    watch  () {}
  }
}
