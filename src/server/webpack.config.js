const webpack = require('webpack');
const path = require('path');
var glob = require('glob');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const preBuildPath = path.resolve(__dirname, '../../dist');
const buildPath = path.resolve(preBuildPath, 'server');

const opts = 
{
    "ifdef-verbose": true,       // add this for verbose output
    "ifdef-triple-slash": true  // add this to use double slash comment instead of default triple slash
};

module.exports = function(env)
{
    const entry = glob.sync('./src/server/index.ts').reduce(function(obj, el) 
        {
            obj[path.parse(el).name] = el;
            return obj
        },
    );

    const loaders = [
        { 
            test: /\.tsx?$/, 
            exclude: /node_modules/, 
            use: [
                { 
                    loader: 'ts-loader' 
                }, 
                {
                    loader: `ifdef-loader`,
                    options: opts 
                } 
            ]
        }
    ];

    let config = 
    {
        module: { rules: loaders },
        externals: [nodeExternals()],
        entry: entry,
        cache: true,
        node: {
            fs: 'empty',
        },
        optimization: {
            minimize: true,
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            path: buildPath,
            filename: "[name].js"
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                  { from: "./src/prisma/schema.prisma", to: "./schema.prisma" },
                ],
              }), // without this the prisma generate above will not work
           ]
    };

    return config
}
