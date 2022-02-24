/** @format */

import http from 'http'
import {routers} from 'router'

export const start = (hostname: string, port: number) => {
    const onRequest = (request: http.IncomingMessage, response: http.ServerResponse) => {
        let uri = request.url ?? ''
        const pos = uri.indexOf('?')
        if (pos !== -1) {
            uri = uri.slice(0, pos)
        }
        console.log('Request for ' + uri + ' received.')
        const fn = routers(uri)
        if (fn !== undefined) {
            fn({request, response})
        } else {
            response.writeHead(404, {'Content-Type': 'text/plain'})
            response.write('<body><center>not found</center></body>')
            response.end()
        }
    }

    http.createServer(onRequest).listen(port, hostname, 511, () => {
        console.log('Server has started.')
    })
}
