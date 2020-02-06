let debug = true//false

module.exports = function yggyDebug (...args) {
  if (debug) console.debug(...args)
}

module.exports.enable  = () => debug = true

module.exports.disable = () => debug = false
