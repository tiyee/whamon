/** @format */

import {router} from '../decorator'
import {IContext} from '../context'
@router.Prefix('/tag')
class Tag {
    @router.GET('/')
    async handle(ctx: IContext): Promise<IContext> {
        return ctx
    }
}
