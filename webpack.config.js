const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  stats: {
    children: true,
  },
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/apigateway': {
        target: 'https://sit.hrms.alphadot.in//gateway/', // Replace this with the address of your backend server
        secure: true, // Set to true if your backend server has SSL enabled
        changeOrigin: true,
        pathRewrite: {
          '^/apigateway': '', // Remove '/api' prefix when forwarding the request
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images', // Optional: specify the output path for images
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
};
