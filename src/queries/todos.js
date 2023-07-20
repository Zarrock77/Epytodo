const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class TodosQuerier {

    constructor(pool, secret) {
        this.secret = secret
        this.pool = pool
    }

    todosGetAll(callback) {
        this.pool.query('SELECT id, title, description, created_at, due_time, user_id, status FROM todo',
        function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined)
            }
        })
    }

    todosGetId(id, callback) {
        this.pool.query('SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?',
        [id], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined)
            }
        })
    }

    todosPost(title, description, due_time, user_id, status, callback) {
        const self = this;

        this.pool.query('INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
        [title, description, due_time, user_id, status], function (error, results) {
            if (!error) {
                const todoId = results.insertId;
                self.pool.query('SELECT * FROM todo WHERE id = ?',
                [todoId], function (selectError, selectResults) {
                    if (!selectError) {
                        callback(selectResults);
                    } else {
                        callback(undefined);
                    }
                })    
            } else {
                callback(undefined)
            }
        })
    }

    todosPut(id, title, description, due_time, user_id, status, callback) {
        const self = this;

        this.pool.query('UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?',
        [title, description, due_time, user_id, status, id], function (error, results) {    
            if (!error && results.affectedRows == 1) {
                self.pool.query('SELECT title, description, due_time, user_id, status FROM todo WHERE id = ?',
                [id], function (selectError, selectResults) {
                    if (!selectError) {
                        callback(selectResults);
                    } else {
                        callback(undefined);
                    }
                })
            } else {
                callback(undefined)
            }
        })
    }

    todosDeleteId(id, callback) {

        this.pool.query('DELETE FROM todo WHERE id = ?',
        [id], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined);
            }
        })
    }
}

module.exports = TodosQuerier
