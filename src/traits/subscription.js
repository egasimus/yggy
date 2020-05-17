module.exports = self => {
  self.subscribers = []
  self.subscribe   = s => self.subscribers.push(s)
  self.unsubscribe = s => self.subscribers = self.subscribers.filter(x=>x!==s)
  self.emit = function emit (event, data = {}) {
    event = { event, ...data }
    self.subscribers.forEach(s=>s.next(event))
  }
  return self
}
