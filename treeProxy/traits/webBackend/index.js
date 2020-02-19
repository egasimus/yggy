module.exports = function webBackendTrait (self) {
  const trait = {}

  trait.called = url => require('./handle')(url)
  defGetter(trait, '/', () => require('./proxy').WebCacheProxy)

  return trait
}
