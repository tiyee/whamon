/** @format */

const path = require('path')
const webpack = require('webpack')

const UglifyJsPlugin = require('terser-webpack-plugin')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const isDebug = process.env.NODE_ENV === 'development'
const root_path = __dirname
console.log('isDebug', isDebug, path.join(__dirname, 'src/index.tsx'))
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
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: ['src', 'node_modules'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.join(__dirname, 'tsconfig.json'),
            }),
        ],
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

                        babelrc: true
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
                            babelrc: true

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
            }



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
                },
            }),
        ]
    },
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDebug ? JSON.stringify('development') : JSON.stringify('production'),
            },
        }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),


    ]
}
