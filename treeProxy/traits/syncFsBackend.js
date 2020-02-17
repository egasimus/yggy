// TODO: util.inspect.custom: https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects

const defGetter = (x, y, get) =>
  Object.defineProperty(x, y, { get, configurable: true })

const descend = (x, ...fragments) => {
  fragments.forEach(y=>x=x[y])
  return x
}

module.exports = function syncFsBackendTrait (self) {

  const trait = {}

  const {statSync} = require('fs')
  const {sep} = require('path')

  const stat = statSync(self.root)

  if (stat.isFile()) {
    // there's no unixy way for a file to refer to itself
    // . = current directory, $0 = "current program"
    trait.called = (path) => {
      if (path) require('../errors').NOT_A_DIR(self.root)
      return FileHandle(self.root)
    }
    defGetter(trait, '/', () => require('../errors').NOT_A_DIR(self.root))

  } if (stat.isDirectory()) {
    trait.called = (path) => DirectoryHandle(path||self.root)
    defGetter(trait, '/', () => DirectoryProxy(self.root))

  } else {
    throw require('../errors').NOT_A_FILE_OR_DIR(self.root)
  }

  return trait

}

function DirectoryHandle (path) {
  return {
    get path () { return path },

    exists () {},
    stat   () {},
    remove () {},

    read   () {},
    file   () {},
    mkdir  () {},
    watch  () {}
  }
}

function DirectoryProxy (path) {
  const {resolve} = require('path')
  const {
    statSync,
    readFileSync,
    writeFileSync,
    unlinkSync,
    readdirSync
  } = require('fs')
  return new Proxy({}, {

    has (_, k) {
      try {
        statSync(resolve(path, k))
        return true
      } catch (e) {
        if (e.code === 'ENOENT') return false
        throw e
      }
    },

    get (_, k) {
      if (typeof k === 'string') {
        k = resolve(path, k)
        let stat
        try {
          stat = statSync(k)
        } catch (e) {
          if (e.code === 'ENOENT') return undefined
          throw e
        }
        if (stat.isFile()) {
          return readFileSync(k)
        } else if (stat.isDirectory()) {
          return readdirSync(k)
        }
      } else {
        return undefined
      }
    },

    set (_, k, v) {
      writeFileSync(resolve(path, k), v)
      return v
    },

    deleteProperty (_, k) {
      unlinkSync(resolve(path, k))
    },

    ownKeys (_) {
      return readdirSync(path)
    }

  })
}

function FileHandle (path) {
  return {
    get path () { return path },
    exists () {},
    stat   () {},
    remove () {},

    read   () {},
    write  () {},
    append () {},
    watch  () {},
  }
}

function FileProxy () {}
