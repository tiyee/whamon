/** @format */

import http from 'http'
import {routers} from 'router'
import {getCtx, setCtx} from 'context'

export const start = (hostname: string, port: number) => {
    const onRequest = (request: http.IncomingMessage, response: http.ServerResponse) => {
        let uri = request.url ?? ''
        const pos = uri.indexOf('?')
        if (pos !== -1) {
            uri = uri.slice(0, pos)
        }
        console.log('Request for ' + uri + ' received.')
        const links = routers(uri)
        if (links !== undefined) {
            const ctx = getCtx(request, response)
            let link = (async () => {
                return ctx
            })()
            links.forEach(fn => {
                link = link.then(fn)
            })
            link.catch(e => {
                console.log(e)
                return e
            }).finally(() => {
                setCtx(ctx)
            })
        } else {
            response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
            response.write('<html><body><center><h1>404 Not Found</h1></center></body></html>')
            response.end()
        }
    }

    http.createServer(onRequest).listen(port, hostname, 511, () => {
        console.log('Server has started.', `${hostname}:${port}`)
    })
}
