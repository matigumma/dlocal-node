import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Payin } from '../src/Payin'
const puppeteer = require('puppeteer')

const options = {
  credentials: {
    x_login: process.env.DLOCAL_X_LOGIN,
    x_trans_key: process.env.DLOCAL_X_TRANS_KEY,
    secret_key: process.env.DLOCAL_X_SECRET_KEY
  },
  live: false
}

const goodData = {
  country: 'BR',
  payment_method_id: 'VI',
  amount: 500000,
  payer: {
    name: 'Thiago Gabriel',
    email: 'thiago@example.com',
    document: '53033315550',
    user_reference: '12345'
  },
  description: 'foo bar'
}

describe('Redirect Payments', function () {
  this.timeout(30000)
  this.slow(60000)

  it('Valid card payment and refund', async function () {
    const payin = new Payin(options)
    const payment = await payin.payments.create(goodData)
    expect(payment.status).to.be.equal(200)
    expect(payment.data.status).to.be.equal('PENDING')
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(payment.data.redirect_url)
    await page.type('#cc-holder-name', 'Satoshi Nakamoto')
    await page.type('#cc-number', '1234123412341234')
    await page.type('#cc-cvc', '123')
    await page.type('#cc-exp', '1023')
    await page.waitFor(500)
    await page.click('.lock-icon')
    await page.waitFor(2000)
    await browser.close()
    const status = await payin.payments.status(payment.data.id)
    expect(status.status).to.be.equal(200)
    expect(status.data.status).to.be.equal('PAID')
    const refund = await payin.refunds.create({ payment_id: payment.data.id })
    expect(refund.status).to.be.equal(200)
    expect(refund.data.status).to.be.equal('PENDING')
  })
})
