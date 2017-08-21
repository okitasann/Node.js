const crypto = require("crypto");
const http = require("http");
const request=require('request');
const moment = require("moment");
class urlpasrer {
constructor ({AccessKeyId = '', AccessKeySecret = ''}) {
    this.AccessKeyId = AccessKeyId
    this.AccessKeySecret = AccessKeySecret
    this.api = 'https://dysmsapi.aliyuncs.com/'
  }
  sendMessage(args) {
    let params = {
      Version: '2017-05-25',
      Format: 'JSON',
      SignatureMethod: 'HMAC-SHA1',
      SignatureNonce: this.getRandomStr(10),
      SignatureVersion: '1.0',
      AccessKeyId: this.AccessKeyId,
      //Timestamp: new Date().toISOString()
      Timestamp: moment().utcOffset(0).format("YYYY-MM-DD HH:mm:ss Z")
    }
    Object.assign(params, args)
    params.Signature = this.getSignature(params)
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: this.api,
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: params
      }, (error, response, body) => {
        if (response.statusCode === 201 || response.statusCode === 200) {
          resolve(body)
        } else {
          reject(body, error)
        }
      })
    })
  }
   getRandomStr (length) {
    return Array.from({ length }).map((value) => {
      return Math.floor(Math.random() * 10)
    }).join('')
  }

  getSignature (params) {
    let paramsStr = this.toQueryString(params)
    let signTemp = `POST&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`
    let signature = crypto.createHmac('sha1', `${this.AccessKeySecret}&`).update(signTemp).digest('base64')
    console.log(signature)
    return signature
  }

  toQueryString (params) {
    return Object.keys(params).sort().map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    }).join('&')
  }
}
module.exports=urlpasrer

