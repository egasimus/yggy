module.exports = function observableTreeProxy (root, options = {}) {
  return require('rxjs').Observable.create(observer=>{
    const log = (event, info={}) => observer.next({ ...info, event })
    require('.')(root, { ...options, log })
    return () => {}
  })
}
