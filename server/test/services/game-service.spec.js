import chai from 'chai'
import * as gameService from '../../services/game-service'
import { Game } from '../../factories/game'
import DatabaseCleaner from 'database-cleaner'
let databaseCleaner = new DatabaseCleaner('mongodb')
let connect = require('mongodb').connect

describe('game service', () => {
  let game
  beforeEach(done => {
    connect(process.env.MONGO_URL, (err, db) => {
      if (err) {
        throw err
      }
      databaseCleaner.clean(db, () => {
        db.close()
        done()
      })
    })
  })

  it('should find no games', done => {
    gameService.findGames({}).fork(
      e => {
        throw e
      },
      s => {
        chai.expect(s.length).to.equal(0)
        done()
      }
    )
  })
  describe('with games', () => {
    beforeEach(done => {
      game = Game.build({
        name: 'game1',
        _id: '12345',
        another: 'something',
        completed: false,
        started: false
      })
      let game2 = Game.build({
        name: '1234',
        _id: '12346',
        another: 'something',
        completed: true,
        started: true
      })
      let game3 = Game.build({
        name: '12345',
        _id: '12347',
        another: 'something',
        completed: false,
        started: true
      })
      gameService
        .createGame(game)
        .chain(r => gameService.createGame(game2))
        .chain(r => gameService.createGame(game3))
        .fork(
          e => {
            throw e
          },
          s => {
            done()
          }
        )
    })

    it('should get all games', done => {
      gameService.findGames({}).fork(
        e => {
          throw e
        },
        s => {
          chai.expect(s.length).to.equal(3)
          done()
        }
      )
    })
    it('should get game by id', done => {
      gameService.findGame({ _id: '12345' }).fork(
        e => {
          throw e
        },
        game => {
          chai.expect(game.name).to.equal('game1')
          done()
        }
      )
    })

    it('should return a list of joinable games', done => {
      gameService.getCurrentJoinableGamesList().fork(
        e => {
          throw e
        },
        s => {
          chai.expect(s).to.deep.equal([{ name: 'game1', _id: '12345' }])
          done()
        }
      )
    })
    it('should allow player to join game', done => {
      let player = { name: 'Texas Ted', _id: '123' }
      gameService
        .joinGame(game, player)
        .chain(() => gameService.findGame({ _id: game._id }))
        .fork(
          e => {
            console.log(e)
          },
          s => {
            chai.expect(s.players).to.deep.include(player)
            done()
          }
        )
    })

    it('should allow multiple players to join a game', done => {
      let player = { name: 'Texas Ted', _id: '123' }
      let player2 = { name: 'Billy Kid', _id: '456' }
      gameService
        .joinGame(game, player)
        .chain(() => gameService.joinGame(game, player2))
        .chain(() => gameService.findGame({ _id: game._id }))
        .fork(
          e => {
            console.log(e)
            done()
          },
          s => {
            chai.expect(s.players).to.deep.include(player)
            chai.expect(s.players).to.deep.include(player2)
            done()
          }
        )
    })
  })
})
