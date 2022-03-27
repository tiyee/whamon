/** @format */
import {IContext} from '../context'
const CheckEtag = (ctx: IContext): boolean => {
    const etag = ctx.request.headers.etag
    const date = ctx.request.headers['if-modified-since']
    return false
}
const CreateEtag = (ctx: IContext): string => {
    // create by url+param or body hash
    return 'W/' + Date.now().toString()
}

const EtagCacheBefore = async (ctx: IContext): Promise<IContext> => {
    if (CheckEtag(ctx)) {
        ctx.Abort().then(ctx => {
            ctx.Status(304)
            ctx.End()
        })
    }

    return ctx
}
const EtagCacheAfter = async (ctx: IContext): Promise<IContext> => {
    ctx.SetHeader('Expires', new Date(Date.now() + 3000).toUTCString())
    ctx.SetHeader('ETag', CreateEtag(ctx))
    return ctx
}
