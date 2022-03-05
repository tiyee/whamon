/** @format */

import {IContext} from './context'
import {RouteHandle} from './router'

export const postHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    console.log('begin')
    // ctx.getFormPost().then((data)=>{
    //     console.log('data',data)
    // })
    const x = await ctx.getFormPostAll()

    console.log('end')
    ctx.Success('ok', {'222': 1})
    return ctx
}
export const defaultHanle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    const people = ['geddy', 'neil', 'alex']
    ctx.Render('xxx', {people})
    return ctx
}
export const demoMid: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    console.log('demo midleware')
    return ctx
}
