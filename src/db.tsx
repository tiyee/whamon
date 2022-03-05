/** @format */

import mysql, {Connection} from 'mysql'
export const connection: Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
})
