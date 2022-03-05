/** @format */

export const TimeoutCtr = async function <T>(fn: Promise<T>, defaultValue: T, timeout: number): Promise<T> {
    const t: Promise<T> = new Promise(resolve => {
        setTimeout(() => {
            resolve(defaultValue)
        }, timeout)
    })
    return Promise.race([fn, t])
}
