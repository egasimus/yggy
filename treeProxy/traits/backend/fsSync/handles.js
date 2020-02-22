module.exports = {
  dir:  DirectoryHandle,
  file: FileHandle
}

function BaseHandle (root, path) {
  return {
    get path () {
      return path
    },
    exists () {
    },
    stat () {
    },
    remove () {
    },
    linkAt (...fragments) {
      const {sep, join, dirname} = require('path')
      const {symlinkSync} = require('fs')
      const target   = join(root, path.join(sep).replace(/\/+/, '/'))
      const linkPath = join(root, fragments.join(sep))
      require('mkdirp').sync(dirname(linkPath))
      symlinkSync(target, linkPath)
    }
  }
}

function DirectoryHandle (root, path) {
  return Object.assign(BaseHandle(root, path), {
    type: require('../../base/symbols').Directory,
    read   () {},
    file   () {},
    mkdir  () {},
    watch  () {}
  })
}

function FileHandle (root, path) {
  return Object.assign(BaseHandle(root, path), {
    type: require('../../base/symbols').File,
    read   () {},
    write  () {},
    append () {},
    watch  () {},
  })
}
