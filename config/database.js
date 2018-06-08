if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://padvd:padvd1962@ds025389.mlab.com:25389/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}