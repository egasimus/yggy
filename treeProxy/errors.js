module.exports = {
  CALLED_NOT_IMPLEMENTED: () => throw new Error(
    `my fault: calling this function should be implemented`),
  NOT_A_FILE_OR_DIR: path => throw new Error(
    `${path}: not file or directory`),
  NOT_A_DIR: path => throw new Error(
    `${path}: not a directory`)
}
