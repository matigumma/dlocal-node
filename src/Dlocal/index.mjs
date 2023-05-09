import axios from 'axios'

export class Dlocal {
  constructor({ serverUrl, credentials, live = false }) {
    this.live = live;
    this.serverUrl = serverUrl;
    this._axios = axios.create({
      baseURL: `https://${live ? 'api' : 'api-sbx'}.dlocalgo.com/v1/`,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'User-Agent': 'foobar',
        Authorization: `Bearer ${credentials.x_api_key}:${credentials.secret_key}`,
        // 'X-Date': new Date().toISOString(),
      },
      validateStatus: function (status) {
        return status >= 100 && status < 1000;
      },
    });
  }
}

// export class Dlocal {
//   constructor ({ serverUrl, credentials, live = false }) {
//     this.live = live
//     this.serverUrl = serverUrl
//     axios.defaults.timeout = 5000
//     axios.defaults.headers.common['Content-Type'] = 'application/json'
//     axios.defaults.headers.common.Accept = 'application/json'
//     axios.defaults.headers.common['User-Agent'] = 'foobar'
//     axios.defaults.headers.common['X-Login'] = credentials.x_login
//     axios.defaults.headers.common['X-Trans-Key'] = credentials.x_trans_key
//     axios.defaults.baseURL = `https://${(live) ? 'api' : 'api-sbx'}.dlocal.com/`
//     axios.defaults.validateStatus = function (status) {
//       return status >= 100 && status < 1000
//     }
//     this._axios = axios
//   }
// }
