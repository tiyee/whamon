/** @format */

export const config = {
    mysql_mster: {
        host: 'localhost',
        user: 'ang_w',
        password: '123456',
        database: 'angemon',
        insecureAuth: true,
        flags: '-SECURE_CONNECTION',
    },
    mysql_slave: {
        host: 'localhost',
        user: 'ang_r',
        password: '123456',
        database: 'angemon',

        insecureAuth: true,
        flags: '-SECURE_CONNECTION',
    },
}
