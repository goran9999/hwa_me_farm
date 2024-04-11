const { webpackPaths } = require("../webpack.paths");
module.exports = [
  {
    test: /\.node$/,
    use: "node-loader",
  },

  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
    },
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    loader: "file-loader",
    options: {
      name: "[path][name].[ext]",
    },
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    // include: [webpackPaths.srcRendererPath],
    use: ["style-loader", "css-loader", "postcss-loader"],
  },
];
