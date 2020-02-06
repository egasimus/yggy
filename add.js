module.exports = (obj, keys, value) => {
  let current = obj
  for (let index in keys) {
    const key = keys[index]
    if (index < keys.length - 1) {
      current[key] = current[key] || {}
      current = current[key]
    } else {
      current[key] = value
    }
  }
  return obj
}

