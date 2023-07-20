const { isEmail } = require("../middleware/user")

function routeAuth(app, userQuerier) {

    app.post('/register', (req, res) => {
        if ('name' in req.body && 'firstname' in req.body &&
            'email' in req.body && 'password' in req.body && isEmail(req.body.email)) {
            console.info(req.body)
            userQuerier.register(
                req.body.name, req.body.firstname, req.body.email,
                req.body.password, function (token) {
                console.info(token)
                if (token) {
                    res.json({ token })
                } else {
                    res.status(400).json({ msg: 'Account already exists' })
                }
            })
        } else {
            res.status(400).json({ msg: 'Bad parameters' })
        }
    })

    app.post('/login', (req, res) => {
        if ('email' in req.body && 'password' in req.body && isEmail(req.body.email)) {
            userQuerier.login(req.body.email, req.body.password, (token) => {
                if (token) {
                    res.json({ token })
                } else {
                    res.status(401).json({ msg: 'Invalid credentials' })
                }
            })
        } else {
            res.status(400).json({ msg: 'Bad parameters' })
        }
    })
}

module.exports = routeAuth
