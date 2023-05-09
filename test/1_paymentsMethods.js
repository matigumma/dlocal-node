import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Payin } from '../'

const options = {
  credentials: {
    // x_login: process.env.DLOCAL_X_LOGIN,
    x_api_key: process.env.DLOCAL_X_TRANS_KEY,
    secret_key: process.env.DLOCAL_X_SECRET_KEY
  },
  live: false
}

describe('Payments Methods', function () {
  this.timeout(5000)
  this.slow(10000)

  const payin = new Payin(options)

  it('AR', async function () {
    const { status, data } = await payin.paymentsMethods.get('AR')
    expect(status).to.be.equal(200)
    expect(data).to.be.an('array')
  })

  it('IT', async function () {
    const { status, data } = await payin.paymentsMethods.get('IT')
    expect(status).to.be.equal(400)
    expect(data.code).to.be.equal(5003)
    expect(data.message).to.be.equal('Country not supported')
  })
})
