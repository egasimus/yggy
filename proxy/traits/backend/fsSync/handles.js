module.exports = {
  dir:  DirectoryHandle,
  file: FileHandle
}

function BaseHandle (root, pathFragments) {
  const self = {
    is: {
      mime (type) { return self.mime === type },
      get file () { return self.stat().isFile() },
      get dir  () { return self.stat().isDir()  },
      get link () { return self.stat().isSymbolicLink() },
    },
    as: {
      get file () { return FileHandle(root, pathFragments) },
      get dir  () { return DirectoryHandle(root, pathFragments) }
    },
    get mime () {
      return require('mime-types').lookup(this.fullPath)
    },
    get path () {
      const {sep} = require('path')
      return pathFragments.join(sep).replace(/\/+/, '/')
    },
    get fullPath () {
      const {join} = require('path')
      return join(root, this.path)
    },
    get exists () {
      const {existsSync} = require('fs')
      return existsSync(this.fullPath)
    },
    stat () {
      const {statSync} = require('fs')
      return statSync(this.fullPath)
    },
    remove () {
    },
    linkAt (...fragments) {
      const {sep, join, dirname} = require('path')
      const {symlinkSync, statSync, readlinkSync} = require('fs')
      const target   = this.fullPath
      const linkPath = join(root, fragments.join(sep))
      require('mkdirp').sync(dirname(linkPath))
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
    readlink () {
      const {join, relative} = require('path')
      const {readlinkSync} = require('fs')
      return relative(root, readlinkSync(join(root, this.path)))
    },
  }
  return self
}

function DirectoryHandle (root, pathFragments) {
  return Object.assign(BaseHandle(root, pathFragments), {
    as: {
      get file () { return FileHandle(root, pathFragments) },
      get dir  () { return this }
    },
    type: require('../../base/symbols').Directory,
    read   () {},
    file   () {},
    mkdir  () {},
    watch  () {}
  })
}

function FileHandle (root, pathFragments) {
  return Object.assign(BaseHandle(root, pathFragments), {
    as: {
      get file () { return this },
      get dir  () { return DirectoryHandle(root, pathFragmentsFragments) }
    },
    type: require('../../base/symbols').File,
    read (options) {
      return require('fs').readFileSync(this.fullPath, options)
    },
    write (data, options) {
      require('fs').writeFileSync(this.fullPath, data, options)
    },
    append (data, options) {
      require('fs').appendFileSync(this.fullPath, data, options)
    },
    watch  () {},
  })
}
