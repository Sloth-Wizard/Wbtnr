const path = require('path');

module.exports = {
    entry: './src/ts/app.ts',
    devtool: 'inline-source-map',
    watch: false,
    module: {
        rules: [
            { // TS rules
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { // SCSS rules
                test: /\.s[ac]ss$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  {
                      loader: 'sass-loader',
                      options: {
                          // Prefer `dart-sass`
                          implementation: require('sass')
                      }
                  }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            'fs': false
        }
    },
    output: {
        filename: 'wbtnr.js',
        path: path.resolve(__dirname, 'dist'),
    },
};