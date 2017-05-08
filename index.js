const promise = require('bluebird')
const fs = promise.promisifyAll(require('fs'))
const cheerio = require('cheerio')
const Enities = require('html-entities').XmlEntities
const enities = new Enities()
const _ = require('lodash')
const rp = require('request-promise')

var options = {
  uri: 'http://rate.bot.com.tw/xrt?Lang=zh-TW',
  transform: function (body) {
    return cheerio.load(body)
  }
}

rp(options)
  .then($ => {
    let exchange = []
    $('tr').each((i, tr) => {
      let currencyType = cheerio(tr).find('td .hidden-phone.print_show').text().replace(/ |\r?\n|\r/g, '')
      let currency = cheerio(tr).find('td.rate-content-sight[data-table="本行即期買入"]').text().replace(/\r?\n|\r/g, '')

      if (currencyType !== '' && currency !== '-') {
        let data = { 'currencyType': currencyType, 'currency': currency }
        exchange.push(data)
      }
    })
    fs.writeFileSync('currency.json', JSON.stringify(exchange))
  })
  .catch((err) => {
    console.log(err)
  })
