import * as crypto from 'crypto'
import uuid from 'uuidv4'

const countries = [
  'AR',
  'BR',
  'CL',
  'CO',
  'MX',
  'PE',
  'UY'
]

const currencies = [
  'ARS',
  'BRL',
  'CLP',
  'COP',
  'MXN',
  'PEN',
  'UYU'
]

const genarateId = () => {
  const generator = `${new Date().toString()}${Math.random()}`
  return uuid.fromString(generator)
}

const getMessage = (config, credentials, nounce) => {
  const stringData = (config.data) ? JSON.stringify(config.data) : ''
  return `${credentials.x_login}${nounce}${stringData}`
}

const getSignature = (credentials, message) => {
  // console.log('credentials: ', credentials)
  return crypto
    .createHmac('sha256', credentials.secret_key)
    .update(message)
    .digest('hex')
}

const signRequest = (config, credentials) => {
  // const nounce = new Date().toISOString()
  // console.log('config: ', config)
  // config.headers['X-Date'] = nounce
  // const message = getMessage(config, credentials, nounce)
  // const signature = getSignature(credentials, message)
  // const authorization = `V2-HMAC-SHA256, Signature: ${signature}`
  // config.headers.Authorization = authorization
  return config
}

// const verify = (config, credentials) => {
//   const nounce = config.headers['X-Date']
//   const message = getMessage(credentials.x_login, config.data, nounce)
//   const signature = getSignature(credentials.secret_key, message)
//   const expected = `V2-HMAC-SHA256, Signature: ${signature}`
//   const received = config.headers.common['Authorization']
//   return (expected === received) ? config : null
// }

const addUrls = (config, serverUrl) => {
  const id = config.data.order_id
  config.data.notification_url = `${serverUrl}/payin/notifications/${id}`
  config.data.callback_url = `${serverUrl}/payin/callbacks/${id}`
  return config
}

const paymentBuilder = (config) => {
  const index = countries.indexOf(config.data.country)
  config.data.currency = currencies[index]
  config.data.payment_method_flow = 'REDIRECT'
  config.data.order_id = genarateId()
  return config
}

export const interceptors = (config, credentials, serverUrl) => {
  config = (config.method === 'post' && config.url === 'payments')
    ? paymentBuilder(config)
    : config

  config = (config.method === 'post' && config.data.order_id && serverUrl)
    ? addUrls(config, serverUrl)
    : config

  config = signRequest(config, credentials)
  console.log(config)

  return config
}
