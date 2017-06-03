import Task from 'data.task'
import * as _ from 'ramda'
let mf = require('mongo-func')

const findDb = mf.find(process.env.MONGO_URL)('games')
const findOneDb = mf.findOne(process.env.MONGO_URL)('games')
const createDb = mf.insert(process.env.MONGO_URL)('games')
const updateDb = mf.update(process.env.MONGO_URL)('games')

const filterByKeys = _.pick(['name', '_id'])

const joinableStatus = { completed: false, started: false }
export const findGames = query =>
  new Task((rej, res) => {
    findDb(query)()
      .then(results => {
        res(results)
      })
      .catch(err => {
        rej(err)
      })
  })

export const findGame = query =>
  new Task((rej, res) => {
    findOneDb(query)()
      .then(result => {
        res(result)
      })
      .catch(err => {
        rej(err)
      })
  })
export const getCurrentJoinableGamesList = () =>
  findGames(joinableStatus).map(t => t.map(filterByKeys))

export const createGame = game =>
  new Task((rej, res) => {
    let newGame = createDb(game)()
      .then(game => {
        res(newGame)
      })
      .catch(err => rej(err))
  })

export const joinGame = (game, player) =>
  new Task((rej, res) => {
    updateDb({ _id: game._id })({ $push: { players: player } })()
      .then(game => {
        res([])
      })
      .catch(err => {
        rej(err)
      })
  })
