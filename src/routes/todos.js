const auth = require('../middleware/auth.js')

function routeTodos(app, todosQuerier, secret) {

    app.get('/todos', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId || userEmail) {
                todosQuerier.todosGetAll((todos) => {
                    if (todos !== undefined) {
                        res.json({ todos })
                    } else {
                        res.status(400).json({ msg: 'Bad parameters' })
                    }
                })
            }
        })
    })

    app.get('/todos/:id', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId || userEmail) {
                const id = req.params.id
                todosQuerier.todosGetId(id, (todos) => {
                    if (todos !== undefined) {
                        res.json({ todos });
                    } else {
                        res.status(400).json({ msg: 'Bad parameters' })
                    }
                })
            }
        })
    })

    app.post('/todos', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId || userEmail) {
                if ('title' in req.body && 'description' in req.body &&
                'due_time' in req.body && 'status' in req.body && userId == req.body.user_id) {
                    todosQuerier.todosPost(req.body.title, req.body.description, req.body.due_time, req.body.user_id, req.body.status, (todos) => {
                        if (todos !== undefined && todos.length == 1) {
                            res.json({
                                title: todos[0].title,
                                description: todos[0].description,
                                due_time: todos[0].due_time,
                                user_id: todos[0].user_id,
                                status: todos[0].status
                            })
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

    app.put('/todos/:id', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId || userEmail) {
                if ('title' in req.body && 'description' in req.body &&
                'due_time' in req.body && 'status' in req.body && userId == req.body.user_id) {
                    const id = req.params.id;
                    todosQuerier.todosPut(id, req.body.title, req.body.description, req.body.due_time, req.body.user_id, req.body.status, (todos) => {
                        if (todos !== undefined) {
                            res.json({ todos });
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

    app.delete('/todos/:id', (req, res) => {
        auth(res, req.headers, secret, (userId, userEmail) => {
            if (userId || userEmail) {
                const id = req.params.id;
                todosQuerier.todosDeleteId(id, (del) => {
                    if (del !== undefined && del.affectedRows == 1) {
                        res.json({ msg: `Successfully deleted record number : ${id}` });
                    } else {
                        res.status(400).json({ msg: 'Bad parameters' })
                    }
                })
            }
        })
    })
}

module.exports = routeTodos
