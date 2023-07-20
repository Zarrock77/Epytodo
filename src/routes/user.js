const auth = require('../middleware/auth.js')
const { isEmail } = require('../middleware/user.js')

function routeUser(app, userQuerier, secret) {

    app.get('/user', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId && userEmail) {
                userQuerier.usersGetId( userId, (info) => {
                    if (info !== undefined && info.length == 1) {
                        res.json(info[0])
                    } else {
                        res.status(400).json({ msg: 'Bad parameters' });
                    }
                })
            }
        })
    })

    app.get('/user/todos', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId && userEmail) {
                userQuerier.userGetTodos( userId, (todos) => {
                    if (todos !== undefined) {
                        res.json({ todos });
                    } else {
                        res.status(400).json({ msg: 'Bad parameters' });
                    }
                })
            }
        })
    })

    app.get('/users/:data', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId && userEmail) {
                const data = req.params.data
                if (data == userEmail && isEmail(data)) {
                    userQuerier.usersGetEmail( data, (infoEmail) => {
                        if (infoEmail !== undefined && infoEmail.length == 1) {
                            res.json(infoEmail[0])
                        } else {
                            res.status(400).json({ msg: 'Bad parameters' })
                        }
                    })
                } else if (data == userId) {
                    userQuerier.usersGetId( data, (infoId) => {
                        if (infoId !== undefined && infoId.length == 1) {
                            res.json(infoId[0])
                        } else {
                            res.status(400).json({ msg: 'Bad parameters' })
                        }
                    })
                } else {
                    res.status(400).json({ msg: 'Bad parameters' })
                }
            }
        })
    })

    app.put('/users/:id', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            const id = req.params.id;
            if (userId && userEmail) {
                if (userId == id && 'email' in req.body && 'password' in req.body &&
                'firstname' in req.body && 'name' in req.body) {
                    userQuerier.usersPut(userId, req.body.email, req.body.password, req.body.firstname, req.body.name, (info) => {
                        if (info !== undefined) {
                            res.json({ info });
                        } else {
                            res.status(400).json({ msg: 'Bad parameters' });
                        }
                    })
                } else {
                    res.status(400).json({ msg: 'Bad parameters' });
                }
            }
        })
    })

    app.delete('/users/:id', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            const id = req.params.id;
            if (userId && userEmail) {
                if (id == userId) {
                    userQuerier.usersDeleteId(id, (info) => {
                        if (info !== undefined) {
                            res.json({ msg: `Successfully deleted record number : ${id}` });    
                        } else {
                            res.status(400).json({ msg: 'Bad parameters' });
                        }
                    })
                } else {
                    res.status(400).json({ msg: 'Bad parameters' });
                }
            }
        })
    })
}

module.exports = routeUser
