module.exports = Object.assign(require('./treeProxy'), {
  treeRead:  require('./treeRead'),
  treeWrite: require('./treeWrite'),
  treeMemo:  require('./treeMemo'),
})
