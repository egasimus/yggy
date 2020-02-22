module.exports = {
  dir:  DirectoryHandle,
  file: FileHandle
}

function BaseHandle (root, path) {
  return {
    get path () {
      const {sep} = require('path')
      return path.join(sep).replace(/\/+/, '/')
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
      const target   = join(root, this.path)
      const linkPath = join(root, fragments.join(sep))
      require('mkdirp').sync(dirname(linkPath))
      symlinkSync(target, linkPath)
    },
    readlink () {
      const {join, relative} = require('path')
      const {readlinkSync} = require('fs')
      return relative(root, readlinkSync(join(root, this.path)))
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
