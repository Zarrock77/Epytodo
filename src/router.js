const { json } = require('express')
const UserQuerier = require('./queries/user')
const TodosQuerier = require('./queries/todos')

function route(app, databasePool, secret) {
    app.use(json())

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            res.status(400).json({ msg: 'JSON format error' });
        } else {
            next();
        }
    })

    let userQuerier = new UserQuerier(databasePool, secret)
    let todosQuerier = new TodosQuerier(databasePool, secret)

    require('./routes/auth')(app, userQuerier)
    require('./routes/todos')(app, todosQuerier, secret)
    require('./routes/user')(app, userQuerier, secret)
    require('../bonus/routes/front')(app)
}

module.exports = route
