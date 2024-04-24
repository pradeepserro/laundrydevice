const prod = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: prod ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist/',
    },
    resolve: {
        fallback: {
            assert: "assert/",
            buffer: "buffer/",
            console: "console-browserify",
            constants: "constants-browserify",
            crypto: "crypto-browserify",
            domain: "domain-browser",
            events: "events/",
            http: "stream-http",
            https: "https-browserify",
            "fs": false,
            "os": false,
            "path": false,
            punycode: "punycode/",
            process: "process/browser",
            querystring: "querystring-es3",
            stream: "stream-browserify",
            _stream_duplex: "readable-stream/duplex",
            _stream_passthrough: "readable-stream/passthrough",
            _stream_readable: "readable-stream/readable",
            _stream_transform: "readable-stream/transform",
            _stream_writable: "readable-stream/writable",
            string_decoder: "string_decoder/",
            sys: "util/",
            timers: "timers-browserify",
            tty: "tty-browserify",
            url: "url/",
            util: "util/",
            vm: "vm-browserify",
            zlib: "browserify-zlib"
        }
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx', '.js', '.json'],
                },
                use: 'ts-loader',
            },
        ]
    },
    devtool: prod ? undefined : 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.js',

        })
    ],
};
