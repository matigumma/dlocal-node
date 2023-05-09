import { describe, it } from 'mocha'
import chai from 'chai'
// const chai = require('chai')
const expect = chai.expect
import { Payin } from '../src/Payin/index.mjs'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
dotenv.config()

const options = {
  credentials: {
    // x_login: process.env.DLOCAL_X_LOGIN,
    x_api_key: process.env.DLOCAL_X_API_KEY,
    secret_key: process.env.DLOCAL_X_SECRET_KEY
  },
  live: false
}

const goodData = {
  amount: 50,
  currency: '',
  country: 'BR',
  payer: {
    id: '12345',
    name: 'Thiago Gabriel',
    email: 'thiago@example.com',
    user_reference: '12345',
    phone: '',
    document_type: 'CPF',
    document: '00000000000',
    address: {
      state: '',
      city: '',
      zip_code: '',
      full_address: '',
    }
  },
  description: 'foo bar service',
  // success_url: 'https://www.google.com',
  // back_url: 'https://www.google.com',
}

describe('Redirect Payments', function () {
  this.timeout(30000)
  this.slow(60000)

  it('Valid card payment and refund', async function () {
    const payin = new Payin(options)
    const payment = await payin.payments.create(goodData)
    console.log(payment.data)
    expect(payment.status).to.be.equal(200)
    expect(payment.data.status).to.be.equal('PENDING')
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(payment.data.redirect_url)
    await page.waitFor(1500)
    await page.click('#panel1bh-header')
    await page.waitFor(400000)
    // await page.type('#cc-holder-name', 'Satoshi Nakamoto')
    await page.type('#pan-input', '1234123412341234')
    await page.type('#cvv-input', '123')
    await page.type('#expiration-input', '1023')
    await page.waitFor(500)
    await page.click('.MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-fullWidth css-1ddei2k')
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
