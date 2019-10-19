/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
    return {
        entry: {
            youngblood: './src/main.ts',
            'youngblood.min': './src/main.ts',
        },
        mode: env.mode,
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'bundle'),
            library: 'yb',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        },
        optimization: {
            minimize: true,
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    include: /\.min\.js$/,
                    uglifyOptions: {
                        mangle: false,
                        compress: {
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            drop_console: true,
                        },
                    },
                }),
            ],
        },
    };
};
