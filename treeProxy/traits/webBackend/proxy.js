const { URL } = require('url')

module.exports = {
  WebCacheProxy,
  WebHostProxy,
  WebPageProxy
}

function getOwnPropertyDescriptor (_) {
  return { enumerable: true, configurable: true }
}

function WebCacheProxy (cache) {
  return new Proxy({}, {
    has (_, url) {
      /* is cached? */
      return cache.has(url)
    },
    get (_, url) {
      /* get cached or fresh */
      return cache.get(url)
    },
    set (_, url, data) {
      /* store in cache */
      return cache.set(url, data)
    },
    deleteProperty (_, url) {
      /* flush */
      return cache.del(url)
    },
    ownKeys (_) {
      /* list keys */
      return cache.keys()
    },
    getOwnPropertyDescriptor,
  })
}

function WebHostProxy (host, cache = {}) {
  return new Proxy({}, {
    has (_, path) {
      /* host has path? */
      const url = new URL(path, host).toString()
    },
    get (_, path) {
      /* get path from host */
      const url = new URL(path, host).toString()
    },
    set (_, path) {
      /* noop? */
      const url = new URL(path, host).toString()
    },
    deleteProperty (_, path) {
      /* flush cache */
      const url = new URL(path, host).toString()
    },
    ownKeys (_) {
      /* cached paths from this host? */
    },
    getOwnPropertyDescriptor
  })
}

function WebPageProxy (url) {
  return new Proxy({}, {
    has (_, k) { /* Boolean(querySelector} */ },
    get (_, k) { /* querySelectorAll */ },
    set (_, k) { /* noop? */ },
    deleteProperty (_, k) { /* noop? (or cache selectors?) */ },
    ownKeys (_) { /* crawl page for items of interest? */ },
    getOwnPropertyDescriptor
  })
}
