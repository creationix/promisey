
// Consume a node-style method
exports.M = (obj, name, ...args) => new Promise((resolve, reject) =>
  obj[name](...args, (err, val) => err ? reject(err) : resolve(val)))

// Consume a node-style function
exports.F = (fn, ...args) => new Promise((resolve, reject) =>
  fn(...args, (err, val) => err ? reject(err) : resolve(val)))

// Wait for a single node-style event (or error)
exports.E = (obj, name) => new Promise((resolve, reject) => {
  obj.once('error', reject)
  obj.once(name, resolve)
})
