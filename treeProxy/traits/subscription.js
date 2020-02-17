module.exports = function subscriptionTrait (self) {
  return {
    subscribers: [],
    subscribe:   s => self.subscribers.push(s),
    unsubscribe: s => self.subscribers = self.subscribers.filter(x=>x!==s),
    emit: (event, data = {}) => {
      event = { event, ...data }
      self.subscribers.forEach(s=>s.next(event))
    },
  }
}
