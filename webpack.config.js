const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // Generate source maps for better debugging
    devtool: 'source-map',
    module: {
        rules: [
            {
                // Add babel-loader for JavaScript files
                test: /\.m?js$/,  // Match both .js and .mjs files
                exclude: /node_modules/, // Don't transpile node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                // Simplified browser targets
                                targets: {
                                    browsers: [
                                        'last 2 versions',
                                        'not dead',
                                        '> 0.5%'
                                    ]
                                }
                            }]
                        ],
                        // Cache babel transformation to speed up builds
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                // Fix font file pattern - remove incorrect quotes
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './src/index.html',
        }),
    ],
    // Add better error handling
    stats: {
        colors: true,
        errorDetails: true
    },
    // Configure the dev server
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true, // Enable hot module replacement
        client: {
            overlay: true, // Show errors as overlay on the page
            progress: true // Show build progress
        }
    },
    // Improve error handling and performance
    optimization: {
        // Don't minimize in development for better debugging
        minimize: false
    },
    // Provide better error reporting
    infrastructureLogging: {
        level: 'warn'
    }
};
