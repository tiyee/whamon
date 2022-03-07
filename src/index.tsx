/** @format */

import {start} from 'server'

start('127.0.0.1', 3000)
process.on('uncaughtException', err => {
    console.log('Caught Exception:' + err)
})
