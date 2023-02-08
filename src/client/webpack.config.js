    const webpack = require('webpack');
const path = require('path');
var glob = require('glob');

const preBuildPath = path.resolve(__dirname, '../../dist');
const buildPath = path.resolve(preBuildPath, 'client');

const opts = 
{
    "ifdef-verbose": true,       // add this for verbose output
    "ifdef-triple-slash": true  // add this to use double slash comment instead of default triple slash
};

module.exports = function(env)
{
    const entry = glob.sync('./src/client/index.ts').reduce(function(obj, el) 
        {
			console.log("teste")
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
        entry: entry,
        cache: true,
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
    };

    return config
}
