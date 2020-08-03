const webpack = require('webpack')
const app = new (require('express'))()
const port = 8000
const host = '0.0.0.0'

// app.use(
//   webpackDevMiddleware(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath
//   })
// )
// app.use(webpackHotMiddleware(compiler))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

app.listen(port, host, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info(
      '伺服器已啟動在 port %s。請打開 http://%s:%s/ 觀看。',
      port,
      host,
      port
    )
  }
})
