module.exports = self => {
  const backends = {
    fsSync:      require('./fsSync'),
    fsAsyncRead: require('./fsAsyncRead')
  }
  const {backend} = self.options
  self = backends[backend](self)
  return self
}
