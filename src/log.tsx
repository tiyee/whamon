/** @format */
import {WriteStream, createWriteStream} from 'fs'
import path from 'path'
export interface ILogger {
    error(s: string): ILogger
    warn(s: string): ILogger
    flush(): void
    info(s: string): ILogger
    debug(s: string): ILogger
    fatal(s: string): ILogger
    write(s: string): void
}
const formater = (prefix: string, ctn: string): string => {
    return `${prefix} ${new Date().toISOString()} ${ctn}\n`
}
class Log implements ILogger {
    readonly ws: WriteStream
    constructor(file: string) {
        const f = path.join(process.cwd(), 'logs', file)
        this.ws = createWriteStream(f, {flags: 'a', highWaterMark: 1024})
    }

    error(s: string): Log {
        this.ws.write(formater('[ERR]', s))
        return this
    }
    warn(s: string): Log {
        this.ws.write(formater('[WARN]', s))
        return this
    }
    fatal(s: string): Log {
        this.ws.write(formater('[FATAL]', s))
        return this
    }
    info(s: string): Log {
        this.ws.write(formater('[INFO]', s))

        return this
    }
    debug(s: string): Log {
        this.ws.write(formater('[DEBUG]', s))

        return this
    }
    flush(): void {
        this.ws.end()
    }
    write(s: string): void {
        const blockSize = 128
        const nbBlocks = Math.ceil(s.length / blockSize)
        for (let i = 0; i < nbBlocks; i += 1) {
            const currentBlock = s.slice(blockSize * i, Math.min(blockSize * (i + 1), s.length))
            this.write(currentBlock)
        }
    }
}

export const logger = new Log('default.log')
