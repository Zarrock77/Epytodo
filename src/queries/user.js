const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserQuerier {

    constructor(pool, secret) {
        this.secret = secret
        this.pool = pool
    }

    register(name, firstname, email, password, callback) {
        const self = this

        this.pool.query('INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
            [email, bcrypt.hashSync(password), name, firstname], function (error, results) {

                if (!error && results.affectedRows == 1) {
                    callback(jwt.sign({ id: results.insertId, email: email }, self.secret))
                } else {
                    console.error(error)
                    callback(undefined)
                }
            })
    }

    login(email, password, callback) {
        const self = this

        this.pool.query('SELECT id, email, password FROM user WHERE email = ?',
            [email, password], function (error, results) {
                console.log(error, results)
                if (!error && results.length == 1) {
                    let user = results[0]
                    if (user.id && bcrypt.compareSync(password, user.password)) {
                        callback(jwt.sign({ id: user.id, email: user.email }, self.secret))
                    } else {
                        callback(undefined)
                    }
                } else {
                    callback(undefined)
                }
            })
    }

    userGetTodos(id, callback) {
        
        this.pool.query('SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE user_id = ?',
        [id], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined);
            }
        })
    }

    usersGetId(id, callback) {

        this.pool.query('SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?',
        [id], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined);
            }
        })
    }

    usersGetEmail(email, callback) {

        this.pool.query('SELECT id, email, password, name, firstname, created_at FROM user WHERE email = ?',
        [email], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined);
            }
        })
    }

    usersPut(id, email, password, firstname, name, callback) {
        const self = this;

        this.pool.query('UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?',
        [email, password, firstname, name, id], function (error, results) {
            if (!error) {
                self.pool.query('SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?',
                [id], function (selectError, selectResults) {
                    if (!selectError) {
                        callback(selectResults);
                    } else {
                        callback(undefined);
                    }
                })
            } else {
                callback(undefined);
            }
        })
    }

    usersDeleteId(id, callback) {

        this.pool.query('DELETE FROM user WHERE id = ?',
        [id], function (error, results) {
            if (!error) {
                callback(results);
            } else {
                callback(undefined);
            }
        })
    }
}

module.exports = UserQuerier
