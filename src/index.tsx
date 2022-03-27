/** @format */

import {start} from 'server'
import process from 'process'
import {logger} from 'log'
logger.warn('111')
start('127.0.0.1', 3000)
process.on('uncaughtException', err => {
    console.log('Caught Exception:' + err)
    logger.fatal(err.message)
})
process.on('beforeExit', code => {
    console.log('Process beforeExit event with code: ', code)
    logger.fatal('exit: ' + code.toString())
    logger.flush()
})

process.on('exit', code => {
    console.log('Process exit event with code: ', code)
    logger.fatal('exit: ' + code.toString())
})
