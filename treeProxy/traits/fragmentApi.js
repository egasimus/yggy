module.exports = function fragmentAPITrait (self) {
  return {
    '/': new Proxy({}, {
      has (_, k) {},
      get (_, k) {},
      set (_, k, v) {},
      deleteProperty (_, k) {},
      ownKeys (_) {}
    })
  }
}

