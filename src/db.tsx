/** @format */

import mysql, {Connection} from 'mysql'
import {config} from 'config'
export const connection: Connection = mysql.createConnection(config.mysql_mster)
