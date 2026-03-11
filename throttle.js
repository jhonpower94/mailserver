const pLimit = require("p-limit");
const limit = pLimit(5);

function throttle(task) {
  return limit(task);
}

module.exports = throttle;
