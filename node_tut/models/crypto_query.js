/* Example in Node.js ES6 using request-promise, concepts should translate to your language of choice */
  
const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    start: 1,
    limit: 5000,
    convert: 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '78154020-a5ac-4078-8459-17be2e3184de'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
  console.log('API call response:', response);
}).catch((err) => {
  console.log('API call error:', err.message);
});