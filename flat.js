const flat = require('flat')

module.exports = data => flat(data, {
  delimiter:    require('path').sep,
  transformKey: encodeURIComponent
})

