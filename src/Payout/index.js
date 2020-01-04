import merge from 'lodash.merge'
import * as crypto from 'crypto'
import uuid from 'uuidv4'
import { Dlocal } from '../Dlocal'

export class Payout extends Dlocal {
  constructor ({ serverUrl, credentials, live }) {
    super({ serverUrl, credentials, live })
    const instance = this._axios.create()
    instance.defaults.baseURL = `${this._axios.defaults.baseURL}api_curl/cashout_api/`
    instance.interceptors.request.use((config) => {
      config = this._sign(config, credentials)
      config = this._addDefaults(config, credentials)
      return config
    })
    this._instance = instance
  }

  _sign (config, credentials) {
    const stringData = JSON.stringify(config.data || {})
    const signature = crypto.createHmac('sha256', credentials.secret_key).update(stringData).digest('hex')
    config.headers.common['Payload-Signature'] = signature
    return config
  }

  _addDefaults (config, credentials) {
    const defaults = {
      version: '2.0',
      login: credentials.x_login,
      password: credentials.x_trans_key
    }

    if (config.method === ('get' || 'delete')) {
      config.params = merge({}, config.params, defaults)
    } else if (config.method === 'post') {
      config.data = merge({}, config.data, defaults, {
        notification_url: `${super.notificationUrl}/payout/${config.data.external_id}`
      })
    }
    return config
  }

  _createUUID () {
    const generator = `${new Date().toString()}${Math.random()}`
    return uuid.fromString(generator)
  }

  async create ({ payer, receiver, payment }) {
    const { data } = await this._instance.post('request_cashout', {
      data: merge({}, {
        external_id: this._createUUID(),
        on_hold: 0,
        type: 'json'
      }, payer, receiver, payment)
    })
    return data
  }

  async status ({ externalId, cashoutId }) {
    const { data } = await this.instance.get('check_status_cashout', {
      params: {
        external_id: externalId,
        cashout_id: cashoutId
      }
    })
    return data
  }

  async remove ({ externalId, cashoutId }) {
    const { data } = await this.instance.delete('cancel_cashout', {
      params: {
        external_id: externalId,
        cashout_id: cashoutId
      }
    })
    return data
  }

  async getExchangeRate ({ currency }) {
    const { data } = await this._instance.get('get_exchange_rate', { params: { currency } })
    return data
  }
}

// payer = {
//   remitter_document,
//   remitter_address,
//   remitter_bank_account,
//   remitter_full_name,
//   remitter_postal_code,
//   remitter_city,
//   remitter_country,
// }

// payment = {
//   amount, // 2 decimal, as number
//   currency, // USd or local
//   extra_info,
//   purpose // code
// }

// receiver = {
//   document_id,
//   document_type,
//   beneficiary_name,
//   beneficiary_lastname,
//   country,
//   bank_code, //integer
//   bank_name,
//   bank_branch,
//   bank_account, //numer as string
//   account_type, // C: for Checking accounts S: for Savings accounts M: for Maestra accounts(Only Peru)
//   address, // street and building nimber
//   city, // city
//   currency, // 'USD or local'
//   email, // beneficiary email
// }
