module.exports = { defGetter, descend }

function defGetter (x, y, get) {
  return Object.defineProperty(x, y, { get, configurable: true })
}

function descend (x, ...fragments) {
  fragments.forEach(y=>x=x[y])
  return x
}
