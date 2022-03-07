/** @format */

const path = require('path')
const webpack = require('webpack')

const UglifyJsPlugin = require('terser-webpack-plugin')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const htmlMinifier = require('html-minifier').minify
const fs = require('fs')
const isDebug = process.env.NODE_ENV === 'development'
const root_path = __dirname
console.log('isDebug', isDebug, path.join(__dirname, 'src/index.tsx'))
if (isDebug) {
    fs.copyFileSync(path.join(__dirname, 'config/dev.tsx'), path.join(__dirname, 'src/config.tsx'))
} else {
    fs.copyFileSync(path.join(__dirname, 'config/pro.tsx'), path.join(__dirname, 'src/config.tsx'))
}

module.exports = {
    mode: isDebug ? 'development' : 'production',
    context: root_path,
    entry: {
        index: path.join(__dirname, 'src/index.tsx'),
    },
    output: {
        path: path.join(__dirname, 'scripts'),
        filename: '[name].js',
    },
    devtool: isDebug ? 'source-map' : false, // 'source-map', // 'source-map', //'cheap-eval-source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json', '.art'],
        modules: ['src', 'node_modules'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.join(__dirname, 'tsconfig.json'),
            }),
        ],
        alias: {
            //'art-template': 'art-template/lib/index.js',
        },
    },
    cache: {
        type: 'memory',
    },
    target: 'node',
    node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,

                        babelrc: true,
                    },
                },
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            babelrc: true,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            // compilerOptions: {
                            //     module: 'es6',
                            // },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.art$/,
                loader: 'art-template-loader',
                options: {
                    htmlResourceRoot: '',
                    minimize: true,
                    // HTML minifier. Work only in NodeJS environment
                    htmlMinifier: htmlMinifier,

                    // HTML minifier configuration. Refer to: https://github.com/kangax/html-minifier
                    htmlMinifierOptions: {
                        collapseWhitespace: true,
                        minifyCSS: true,
                        minifyJS: true,
                        // automatically merged at runtime: rules.map(rule => rule.test)
                        ignoreCustomFragments: [],
                    },
                    // art-template options (if necessary)
                    // @see https://github.com/aui/art-template
                },
            },
        ],
    },

    optimization: {
        minimize: true,
        removeEmptyChunks: true,
        minimizer: [
            new UglifyJsPlugin({
                extractComments: false,
                parallel: true,
                terserOptions: {
                    ie8: false,
                    safari10: false,
                    compress: !isDebug,
                    warnings: isDebug,
                    output: {
                        comments: false,
                    },
                    // Preventing mangling of function names fixes "Received packet in the wrong sequence" bug
                    // See https://github.com/mysqljs/mysql/issues/1655 and https://github.com/mysqljs/mysql/pull/2375/files
                    keep_fnames: /Packet|ChangeUser|Handshake|Ping|Query|Quit|Sequence|Statistics/,
                },
            }),
        ],
    },
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDebug ? JSON.stringify('development') : JSON.stringify('production'),
            },
            BROWSER_SUPPORTS_HTML5: true,
            ROOT_PATH: `'${root_path}'`,
        }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
    ],
}
