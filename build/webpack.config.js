const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const utils = require('./utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const xOption = process.cwd();
const NODE_ENV = process.env.NODE_ENV;
const BUILD_WAY = process.env.BUILD_WAY;
// 编译前做的事
// 获取 yml 配置信息
// 获取所有页面
utils.gerRouterList();

/****************************************************
 * config entry
 ***************************************************/
const entry = {};

// ./src/index.ts
entry.app = [`${__dirname}/router-list.tsx`];

if ('development' === BUILD_WAY) {
  entry.app = ['webpack-hot-middleware/client?reload=true'].concat(entry.app);
}

/****************************************************
 * config output
 ***************************************************/
const output = {};
output.publicPath = './';
output.path = path.join(process.cwd(), 'dist');
output.filename = `static/js/[name]-[hash:5].js`;

if ('development' === BUILD_WAY) {
  output.path = '/';
  output.publicPath = '/';
}

/****************************************************
 * config resolve
 ***************************************************/
const resolve = {
  extensions: [".ts", ".tsx",  ".less", ".js"],
  alias: {
    'src': path.resolve('src'),
    'assets': path.resolve('src/assets'),
    'entities': path.resolve('src/components'),
    'pages': path.resolve('src/pages'),
    'models': path.resolve('src/models'),
    'styles': path.resolve('src/styles'),
    'services': path.resolve('src/services'),
  }
};

/****************************************************
 * config module
 ***************************************************/
// const stylePrivate = new ExtractTextPlugin(
//   {
//     filename: `static/styles/style-[hash:5].css`,
//     allChunks: true,
//   });
const moduleOptions = {
  rules: []
};

//typescript
//----------------
// ts
moduleOptions.rules.push({
  test: /\.(ts|tsx)$/,
  loader: 'ts-loader',
  options: {
    allowTsInNodeModules: true
  }
});

// tslint
moduleOptions.rules.push({
  test: /\.(ts|tsx)$/,
  enforce: 'pre',
  exclude: /node_modules/,
  loader: 'tslint-loader',
});


// less
moduleOptions.rules.push({
  test: /\.(less|css)$/,
  //loader: stylePrivate.extract({
   // fallback:"style-loader",
  use: [
    MiniCssExtractPlugin.loader,
    ...utils.getLessLoader()
  ],
  //  publicPath: '/'
 // })
});
// image
moduleOptions.rules.push({
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  query: {
    limit: 1000,
    name: `static/resources/[name]-[hash:5].[ext]`,
    publicPath: '/'
  }
});

// font
moduleOptions.rules.push({
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url-loader',
  query: {
    limit: 1000,
    name: `static/resources/[name]-[hash:5].[ext]`,
    publicPath: '/'
  }
});

/****************************************************
 * config plugins
 ***************************************************/
const plugins = [];
plugins.push(new MiniCssExtractPlugin({
    filename: `static/styles/style-[hash:5].css`,
    chunkFilename: '[id].css',
    allChunks: true,
  }));
plugins.push(new webpack.DefinePlugin(utils.getConfigDefinePlugin()));
plugins.push(new HtmlPlugin(utils.getConfigHtmlTemplate()));

if ('development' === BUILD_WAY) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
}
/****************************************************
 * config target
 ***************************************************/

let target = 'web';
// if ('server' === env.BUILD_TYPE) {
//   target = 'node';
// }

const mode = process.env.NODE_ENV;

module.exports = {entry, mode, output, module: moduleOptions, resolve, plugins, target};