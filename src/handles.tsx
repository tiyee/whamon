/** @format */

import {IContext} from './context'
import {RouteHandle} from './router'
import {connection} from 'db'
import {Post} from './model/post'
import {FetchAllPost} from './repository/post'
import {IndexRender, PostRender, AboutRender, OpenSoureeRender, SiteMapRender} from 'view'
interface retTag {
    title: string
    url: string
    text: string
}
interface retIndex {
    id: number
    created: Date
    title: string
    tags: retTag[]
}
interface retPost extends retIndex {
    content: string
}
export const postHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    let x = ctx.getQuery('id', '0')
    const id = parseInt(x)
    if (id === undefined || id < 1) {
        ctx.Status(404)
        ctx.End()
        return ctx
    }
    const promise = new Promise<IContext>(resolve => {
        connection.query('SELECT * from ag_post where id=?', id, (error, results: Post[], fields) => {
            if (error) throw error
            if (results.length < 1) {
                ctx.Status(404)
                ctx.End()
                return resolve(ctx)
            }
            const result = results[0]

            const info: retPost = {
                id: result.id,
                content: result.content,

                created: new Date(result.created * 1000),
                title: result.title,

                tags: result.tags.split(',').map(tag => {
                    return {
                        title: tag,
                        url: `/tag/${encodeURIComponent(tag)}.html`,
                        text: tag,
                    }
                }),
            }
            const meta = {
                title: `${result.title} -  tiyee's 微言微语"`,
                keywords: result.tags,
                content: '',
            }
            return ctx.Html(PostRender({info, meta}))
        })
    })

    return promise
}
export const defaultHanle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    return FetchAllPost().then(async (results: Post[]): Promise<IContext> => {
        const list = new Array<retIndex>()
        results.forEach(result => {
            const item: retIndex = {
                id: result.id,
                created: new Date(result.created * 1000),
                title: result.title,

                tags: result.tags.split(',').map(tag => {
                    return {
                        title: tag,
                        url: `/tag/${encodeURIComponent(tag)}.html`,
                        text: tag,
                    }
                }),
            }
            list.push(item)
        })
        const meta = {
            title: `首页 - tiyee's 微言微语`,
            keywords: '',
            content: '',
        }
        return ctx.Html(IndexRender({list, meta}))
    })
}
export const demoMid: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    console.log('demo midleware')
    return ctx
}
export const tagHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    let tag = ctx.getQuery('id', '0')
    tag = decodeURIComponent(tag)
    return new Promise<IContext>(resolve => {
        connection.query('SELECT id,tags,title,created from ag_post', (error, results: Post[], fields) => {
            if (error) throw error
            const list = new Array<retIndex>()
            results.forEach(result => {
                const tags = result.tags.split(',').map(tag => {
                    return {
                        title: tag,
                        url: `/tag/${encodeURI(tag)}.html`,
                        text: tag,
                    }
                })
                if (
                    tags.filter(item => {
                        return item.title === tag
                    }).length > 0
                ) {
                    list.push({
                        id: result.id,
                        created: new Date(result.created * 1000),
                        title: result.title,
                        tags,
                    })
                }
            })
            const meta = {
                title: `${tag} -  tiyee's 微言微语`,
                keywords: tag,
                content: '',
            }
            resolve(ctx.Html(IndexRender({list, meta})))
        })
    })
}
export const aboutHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    const meta = {
        title: `关于 - tiyee's 微言微语`,
        keywords: '',
        content: '',
    }
    const info = {}
    return ctx.Html(AboutRender({info, meta}))
}
export const openSourceHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    const meta = {
        title: `开源项目 - tiyee's 微言微语`,
        keywords: '',
        content: '',
    }
    const info = {}
    return ctx.Html(OpenSoureeRender({info, meta}))
}
export const siteMap: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    return FetchAllPost().then(async (results: Post[]): Promise<IContext> => {
        const list = new Array<retIndex>()
        let maxTime = 0
        results.forEach(result => {
            const item: retIndex = {
                id: result.id,
                created: new Date(result.created * 1000),
                title: result.title,

                tags: [],
            }
            maxTime = Math.max(maxTime, result.created)
            list.push(item)
        })
        const meta = {
            title: `tiyee's 微言微语`,
            lastModify: new Date(maxTime * 1000),
            keywords: '',
            content: '',
        }
        return (await ctx.Render(200, SiteMapRender({list, meta}), {'Content-Type': 'text/xml;charset=UTF-8'})).Status(
            200,
        )
    })
}
