'use strict'

import { Payin } from './src/Payin'
import { Payout } from './src/Payout'
import dotenv from 'dotenv'
dotenv.config()

process.on('unhandledRejection', (error) => error)

class Dlocal {
  constructor ({ serverUrl, credentials, live = false }) {
    this.payin = new Payin({ serverUrl, credentials, live })
    this.payout = new Payout({ serverUrl, credentials, live })
  }
}

export { Payin, Payout, Dlocal }
