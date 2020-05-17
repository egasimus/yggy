// TODO: util.inspect.custom: https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects

module.exports = self =>
  require('./baseFSTrait')(
    self,
    () => handles,
    () => proxies
  )

const proxies = {
  dir: function DirectoryProxy (path) {
    const {resolve} = require('path')
    const { stat, readFile, writeFile, unlink, readdir } = require('fs')
    return new Proxy({}, {
      async has (_, k) {
        try {
          await new Promise((resolve, reject)=>
            statSync(resolve(path, k), err=>err?reject(err):resolve(true))
          )
          return true
        } catch (e) {
          if (e.code === 'ENOENT') return false
          throw e
        }
      },
      async get (_, k) {
        if (typeof k === 'string') {
          k = resolve(path, k)
          let stats
          try {
            stats = await new Promise((resolve, reject)=>
              stat(k, (error, stats)=>error?reject(error):resolve(stats))
            )
          } catch (e) {
            if (e.code === 'ENOENT') return undefined
            throw e
          }
          if (stat.isFile()) {
            return new Promise((resolve, reject)=>
              readFile(k, 'utf8', (error, data)=>error?reject(error):resolve(data))
            )
          } else if (stat.isDirectory()) {
            return DirectoryProxy(k)
          }
        } else {
          return undefined
        }
      },
      set (_, k, v) {
        writeFileSync(resolve(path, k), v)
        return v
      },
      deleteProperty (_, k) {
        unlinkSync(resolve(path, k))
      },
      ownKeys (_) {
        const keys = readdirSync(path)
        return keys
      },
      getOwnPropertyDescriptor (_) {
        return { enumerable: true, configurable: true }
      }
    })
  },
  file: function FileProxy () {
    console.log(FileProxy)
  }
}

const handles = {
  dir: function DirectoryHandle (path) {
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
  },
  file: function FileHandle (path) {
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
}
