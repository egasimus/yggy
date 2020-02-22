module.exports = {
  dir:  DirectoryHandle,
  file: FileHandle
}

function DirectoryHandle (path) {
  return {
    type: require('../../base/symbols').Directory,
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

function FileHandle (path) {
  return {
    type: require('../../base/symbols').File,
    get path () { return path },

    exists () {},
    stat   () {},
    remove () {},

    read   () {},
    write  () {},
    append () {},
    watch  () {},

    linkAt (...fragments) {
      console.log('linkAt', this.path, fragments)
    }
  }
}
