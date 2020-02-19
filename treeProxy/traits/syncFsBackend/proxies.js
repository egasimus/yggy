module.exports = {
  dir:  DirectoryProxy,
  file: FileProxy
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
          return readFileSync(k, 'utf8')
        } else if (stat.isDirectory()) {
          return DirectoryProxy(k)
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
      const keys = readdirSync(path)
      return keys
    },

    getOwnPropertyDescriptor (_) {
      return { enumerable: true, configurable: true }
    }

  })

}

function FileProxy () {
  console.log(FileProxy)
}

