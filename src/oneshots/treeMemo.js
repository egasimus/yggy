module.exports = function treeMemo (name, path) {
  let value = require('./treeRead')(path)
  return {
    get [name] () {
      return value
    },
    set [name] (newValue) {
      treeWrite(path, newValue)
      value = newValue
      return value
    }
  }
}
