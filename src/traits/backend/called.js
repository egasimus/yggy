module.exports = function invoke (amFile, amDir, getHandles, root, path) {

  const {
    NOT_A_DIR,
    NOT_A_FILE_OR_DIR,
    NOT_IMPLEMENTED
  } = require('../../errors')

  // when file:
  if (amFile) {
    // $() -> handle(root)
    // $(anything else) -> error
    // TODO if parseable file descend into file
    if (path.length > 0) NOT_A_DIR(root)
    return getHandles().file(root, path)
  }

  // when directory:
  if (amDir) {
    // $() -> handle(root)
    // $('foo'), $('foo/bar'), $('foo', 'bar') -> descend
    return getHandles().dir(root, path)
  }

  // other node types not supported yet
  NOT_A_FILE_OR_DIR(root)

}
