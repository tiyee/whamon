/** @format */

export interface ILogger {
    error(s: string): ILogger
    warn(s: string): ILogger
    flush(): void
    write(s: string): void
}
class Log implements ILogger {
    readonly buff: Buffer
    private capacity
    private size = 0
    constructor(cap: number) {
        this.buff = Buffer.allocUnsafe(cap)
        this.capacity = cap
    }
    error(s: string): Log {
        return this
    }
    warn(s: string): Log {
        return this
    }
    flush(): void {
        this.buff.toString()
        this.size = 0
    }
    write(s: string): void {
        let i = 0
        while (i < s.length) {
            const ss = s.slice(i)
            i += this.buff.write(ss, 'utf8')
            if (this.buff.byteLength === this.capacity) {
                this.flush()
            }
        }
    }
}
export const logger = new Log(1024)
