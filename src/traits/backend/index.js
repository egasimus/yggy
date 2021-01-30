module.exports = self => {
  const backends = {
    fsSync:      require('./fsSyncBackend'),
    fsAsyncRead: require('./fsAsyncReadBackend')
  }
  const {backend} = self.options
  self = backends[backend](self)
  return self
}
