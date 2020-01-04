import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Payin } from '../'

const options = {
  credentials: {
    x_login: process.env.DLOCAL_X_LOGIN,
    x_trans_key: process.env.DLOCAL_X_TRANS_KEY,
    secret_key: process.env.DLOCAL_X_SECRET_KEY
  },
  live: false
}

const payin = new Payin(options)

describe('Currencies Exchanges', function () {
  this.timeout(5000)
  this.slow(10000)

  it('USD > ARS', async function () {
    const response = await payin.currencyExchange.get('ARS')
    expect(response.status).to.be.equal(200)
    expect(response.data).to.have.keys(['from', 'to', 'rate'])
  })

  it('USD > USD', async function () {
    const response = await payin.currencyExchange.get('USD')
    expect(response.status).to.be.equal(200)
    expect(response.data).to.be.eql({ from: 'USD', to: 'USD', rate: 1 })
  })
})
