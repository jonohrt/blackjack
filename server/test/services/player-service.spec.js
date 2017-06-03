import chai from 'chai'
import { playerService } from '../../services/player-service'
import { Player } from '../../factories/player'
import DatabaseCleaner from 'database-cleaner'
let databaseCleaner = new DatabaseCleaner('mongodb')
let connect = require('mongodb').connect

describe('playerService', () => {
  beforeEach(done => {
    let player = Player.build({
      name: 'Simon',
      _id: '1234'
    })
    let player2 = Player.build({
      name: 'Phil'
    })
    let player3 = Player.build({
      name: 'Ross'
    })
    playerService
      .createPlayer(player)
      .chain(r => playerService.createPlayer(player2))
      .chain(r => playerService.createPlayer(player3))
      .fork(
        e => {
          throw e
        },
        s => {
          done()
        }
      )
  })
  afterEach(done => {
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
  it('should create new player', done => {
    let player = { name: 'Biff' }
    playerService.createPlayer(player).fork(
      e => {
        throw e
      },
      createdPlayer => {
        chai.expect(createdPlayer.name).to.equal('Biff')
        done()
      }
    )
  })
  it('should find a player by id', done => {
    playerService.findPlayer({ _id: '1234' }).fork(
      e => {
        throw e
      },
      s => {
        chai.expect(s.name).to.equal('Simon')
        done()
      }
    )
  })
})
