const mysql2 = require('mysql2')

class Database {

    constructor(env) {
        this.pool = mysql2.createPool({
            host: env.MYSQL_HOST,
            user: env.MYSQL_USER,
            password: env.MYSQL_ROOT_PASSWORD,
            database: env.MYSQL_DATABASE,
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err)
                }

                if (connection.state === 'disconnected') {
                    connection.connect((err) => {
                        if (err) {
                            return reject(err)
                        }

                        resolve(connection)
                    })
                } else {
                    resolve(connection)
                }
            })
        })
    }

    query(payload, args = undefined, callback) {
        this.getConnection().then((conn) => {
            conn.query(payload, args, callback)

            conn.release()
        }).catch(console.error)
    }
}

module.exports = Database;
