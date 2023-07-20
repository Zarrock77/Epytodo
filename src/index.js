const express = require('express')
const dotenv = require('dotenv')
const route = require('./router')
const Database = require('./database')

dotenv.config()

const databasePool = new Database(process.env)

const app = express()
const ip = process.env.npm_package_config_ip
const port = process.env.npm_package_config_port

route(app, databasePool, process.env.SECRET)

app.listen(port, ip, () => {
    console.info(`Server started: http://localhost:${port}`)
})
