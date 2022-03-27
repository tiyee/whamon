/** @format */

export const config = {
    mysql_mster: {
        host: 'localhost',
        user: 'angw',
        password: '123456',
        database: 'angemon',
        insecureAuth: true,
        flags: '-SECURE_CONNECTION',
    },
    mysql_slave: {
        host: 'localhost',
        user: 'angr',
        password: '123456',
        database: 'angemon',

        insecureAuth: true,
        flags: '-SECURE_CONNECTION',
    },
}

