const express = require('express')
require('svelte/ssr/register'); // for server side rendering

const app = express()



app.use('/public', express.static(__dirname + '/../www/public'))
app.use('/admin', express.static(__dirname + '/../www/admin'))

module.exports = { app }