module.exports = self => ({
  fsSync:      require('./fsSyncBackend'),
  fsAsyncRead: require('./fsAsyncReadBackend'),
  web:         require('./webBackend')
}[self.options.backend](self))
