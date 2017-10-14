
// Consume a node-style method
exports.M = (obj, name, ...args) => new Promise((resolve, reject) =>
  obj[name](...args, (err, val) => err ? reject(err) : resolve(val)))

// Consume a node-style function
exports.F = (fn, ...args) => new Promise((resolve, reject) =>
  fn(...args, (err, val) => err ? reject(err) : resolve(val)))

// Wait for a single node-style event (or error)
exports.E = (obj, name) => new Promise((resolve, reject) => {
  function onError (err) {
    clear()
    return reject(err)
  }
  function onResult (val) {
    clear()
    return resolve(val)
  }
  function clear () {
    obj.off('error', onError)
    obj.off(name, onResult)
  }
  obj.on('error', onError)
  obj.on(name, onResult)
})
