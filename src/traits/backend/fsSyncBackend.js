// TODO: util.inspect.custom: https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects

module.exports = self =>
  require('./baseFSTrait')(
    self,
    () => handles,
    () => proxies,
  )

const handles = {
  dir: function DirectoryHandle (root, pathFragments) {
    let self
    const{readdirSync}=require('fs')
    return self = Object.assign(BaseHandle(root, pathFragments), {
      read  () { return readdirSync(self.fullPath) },
      file  () {},
      mkdir () {},
      watch () {},
      type: require('../base').Symbols.Directory,
      as: {
        get file () { return FileHandle(root, pathFragments) },
        get dir  () { return self }
      },
    })
  },
  file: function FileHandle (root, pathFragments) {
    let self
    const{readFileSync,writeFileSync,appendFileSync}=require('fs')
    return self = Object.assign(BaseHandle(root, pathFragments), {
      read   (options)       { return readFileSync(self.fullPath, options)  },
      write  (data, options) { writeFileSync(self.fullPath, data, options)  },
      append (data, options) { appendFileSync(self.fullPath, data, options) },
      watch  () {},
      type: require('../../base').Symbols.File,
      as: {
        get file () { return self },
        get dir  () { return DirectoryHandle(root, pathFragmentsFragments) }
      },
    })
  }
}

function BaseHandle (root, pathFragments) {
  let self
  const {sep, join, relative, dirname} = require('path')
  const {existsSync, statSync, symlinkSync, readlinkSync} = require('fs')
  const mkdirp = require('mkdirp').sync
  const {lookup} = require('mime-types')
  return self = {
    get mime     () { return lookup(this.fullPath) },
    get path     () { return pathFragments.join(sep).replace(/\/+/, '/') },
    get fullPath () { return join(root, this.path) },
    get exists   () { return existsSync(this.fullPath) },
    get stat     () { return statSync(this.fullPath) },
    remove () {},
    readlink () { return relative(root, readlinkSync(join(root, this.path))) },
    linkAt (...fragments) {
      const target   = this.fullPath
      const linkPath = join(root, fragments.join(sep))
      mkdirp(dirname(linkPath))
      try {
        symlinkSync(target, linkPath)
      } catch (error) {
        if (error.code === 'EEXIST') {
          try {
            if (
              statSync(target).isSymbolicLink() &&
              target === readlinkSync(linkPath)
            ) return
          } catch (e) {
            throw e
          }
        } else {
          throw e
        }
      }
    },
    is: {
      mime (type) { return self.mime === type },
      get file () { return self.stat.isFile() },
      get dir  () { return self.stat.isDirectory() },
      get link () { return self.stat.isSymbolicLink() },
    },
    as: {
      get file () { return FileHandle(root, pathFragments) },
      get dir  () { return DirectoryHandle(root, pathFragments) }
    },
  }
}

const proxies = {

  dir: function DirectoryProxy (path) {
    const {resolve, dirname
          } = require('path')
    const { statSync, readFileSync, writeFileSync, unlinkSync, readdirSync
          } = require('fs')
    return new Proxy({}, {
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
      ownKeys: () => readdirSync(path),
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
        //console.debug(`set`, path, k)
        require('mkdirp').sync(dirname(resolve(path, k)))
        writeFileSync(resolve(path, k), v)
        return v
      },
      deleteProperty: (_, k) => unlinkSync(resolve(path, k)),
    })
  },

  file: function FileProxy () {
    console.log(FileProxy)
  }

}
