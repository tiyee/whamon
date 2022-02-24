/** @format */

import {IncomingMessage, ServerResponse} from 'http'
export interface IContext {
    readonly request: IncomingMessage
    readonly response: ServerResponse
}
