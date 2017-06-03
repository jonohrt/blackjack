import Task from 'data.task'
// import * as _ from 'ramda'
let mf = require('mongo-func')
const findOneDb = mf.findOne(process.env.MONGO_URL)('player')
const createDb = mf.insert(process.env.MONGO_URL)('player')
var ObjectId = require('mongodb').ObjectID

const createPlayer = attrs =>
  new Task((rej, res) => {
    createDb(attrs)()
      .then(player => {
        res(player.ops[0])
      })
      .catch(err => {
        rej(err)
      })
  })

const findPlayer = id =>
  new Task((rej, res) => {
    findOneDb({ _id: new ObjectId(id) })()
      .then(player => {
        res(player)
      })
      .catch(err => rej(err))
  })

export const playerService = {
  createPlayer,
  findPlayer
}
