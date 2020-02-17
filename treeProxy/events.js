module.exports = [
  'Set',
  'Get',
  'Deleting',
  'Deleted',
  'Reading',
  'Read'
].reduce((events, event)=>
  Object.assign(events, {[event]: `Yggy.${event}`}),
  {})
