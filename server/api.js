const express = require('express')
require('svelte/ssr/register'); // for svelte server side rendering

module.exports = ({app, db}) => {
    
    app.use('/public', express.static(__dirname + '/../www/public'))
    app.use('/admin', express.static(__dirname + '/../www/admin'))
    app.use('/', express.static(__dirname + '/../www/index'))


}