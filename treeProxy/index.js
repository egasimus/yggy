const {resolve, relative, sep} = require('path')
const {readFileSync} = require('fs')
const EventEmitter   = require('events')

module.exports = YggyRoot

function YggyRoot (root, options={}) {
  let self = function Yggy (...args) { return self.called(...args) }
  self = require('./traits/base')(self, root, options)
  self = require('./traits/backend')(self)
  self = require('./traits/subscriptions')(self)
  return self
}
