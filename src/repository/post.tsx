/** @format */
import {Post} from '../model/post'

import {MysqlError, FieldInfo} from 'mysql'
import {connection} from '../db'
export const FetchAllPost = async (): Promise<Post[]> => {
    return new Promise<Post[]>(resolve => {
        connection.query(
            'SELECT * from ag_post order by id desc',
            (error: MysqlError, results: Post[], fields?: FieldInfo[]) => {
                if (error) throw error
                return resolve(results)
            },
        )
    })
}
