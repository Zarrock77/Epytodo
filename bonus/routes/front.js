const path = require('node:path')

function routeFront(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('bonus/index.html'))
    })

    app.get('/style.css', (req, res) => {
        res.sendFile(path.resolve('bonus/style.css'))
    })

    app.get('/login', (req, res) => {
        res.sendFile(path.resolve('bonus/login/index.html'))
    })

    app.get('/login/script.js', (req, res) => {
        res.sendFile(path.resolve('bonus/login/script.js'))
    })

    app.get('/login/style.css', (req, res) => {
        res.sendFile(path.resolve('bonus/login/style.css'))
    })

    app.get('/register', (req, res) => {
        res.sendFile(path.resolve('bonus/register/index.html'))
    })

    app.get('/register/style.css', (req, res) => {
        res.sendFile(path.resolve('bonus/register/style.css'))
    })

    app.get('/register/script.js', (req, res) => {
        res.sendFile(path.resolve('bonus/register/script.js'))
    })

    app.get('/workflow', (req, res) => {
        res.sendFile(path.resolve('bonus/workflow/index.html'))
    })

    app.get('/workflow/style.css', (req, res) => {
        res.sendFile(path.resolve('bonus/workflow/style.css'))
    })

    app.get('/workflow/script.js', (req, res) => {
        res.sendFile(path.resolve('bonus/workflow/script.js'))
    })

    app.get('/assets/*', (req, res) => {
        res.sendFile(path.resolve(`bonus/assets/${req.params[0]}`))
    })
}

module.exports = routeFront
