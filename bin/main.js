#!/usr/bin/env node

const {app} = require('../server/index.js')

const PID = process.pid;
const PORT = process.env.PORT || process.argv[2] || 8080;
const SECRET = process.env.SECRET || "force";


app.listen(PORT)
console.log(`server is running on http://127.0.0.1:${PORT}/`)
console.log(`PID ${PID}`)


// graceful shutdown
// ...