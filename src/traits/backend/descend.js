module.exports = function descend (x, ...fragments) {
  fragments.forEach(y=>x=x[y])
  return x
}

