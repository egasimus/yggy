module.exports = [
  'Set',
  'Get',
  'Deleting',
  'Deleted',
  'Refreshing',
  'Refreshed'
].reduce((events, event)=>
  Object.assign(events, {[event]: `Yggy.${event}`}),
  {})
