
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
    obj.removeListener('error', onError)
    obj.removeListener(name, onResult)
  }
  obj.on('error', onError)
  obj.on(name, onResult)
})

// Wait for the first of several events and report which won
exports.EE = (obj, ...names) => new Promise((resolve, reject) => {
  let handlers = { error: err => {
    clear()
    reject(err)
  } }
  obj.on('error', handlers.error)
  for (let name of names) {
    if (name === 'error') continue
    let handler = handlers[name] = () => {
      clear()
      resolve(name)
    }
    obj.on(name, handler)
  }
  function clear () {
    for (let name in handlers) {
      obj.removeListener(name, handlers[name])
      delete handlers[name]
    }
  }
})

// Call a normal function as always async
exports.C = async (fn, ...args) => fn(...args)
