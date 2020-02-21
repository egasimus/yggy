module.exports = {
  dir:  DirectoryHandle,
  file: FileHandle
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
