const path = require("path");
const webpack = require("webpack");

const libraryName = "ParramattaMobileDashboard";

const config = {
  context: path.join(__dirname, "src"),
  entry: [__dirname + "/src/index.js"],
  devtool: false,
  output: {
    path: __dirname + "/dist/scripts",
    filename: libraryName + ".js",
    publicPath: "/scripts/",
    library: libraryName,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      masonry: "masonry-layout",
      isotope: "isotope-layout"
    }
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader?modules", "postcss-loader"]
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules|ParramattaMobileDashboard|LizardApiClient/
      },
      {
        test: /\.(png|jpg|svg|woff|eot|ttf|otf)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    })
  ]
};

module.exports = config;
