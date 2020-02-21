module.exports = self => {
  const backends = {
    syncFs:      require('./traits/syncFsBackend'),
    asyncReadFs: require('./traits/asyncReadFsbackend')
  }
  const {backend} = self.options
  self = backends[backend](self)
  return self
}
