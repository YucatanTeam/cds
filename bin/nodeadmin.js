#!/usr/bin/env node

const express = require('express')
const nodeadmin = require('nodeadmin')



const app = express()
app.use(nodeadmin(app))

const PID = process.pid;
const PORT = process.argv[2] || 3000

app.listen(PORT)
console.log(`nodeadmin is running on http://127.0.0.1:${PORT}/nodeadmin`)
console.log(`PID ${PID}`)